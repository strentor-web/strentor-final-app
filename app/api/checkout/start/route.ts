import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { createClient } from "@/utils/supabase/server";
import { createServiceClient } from "@/utils/supabase/service";
import prisma from "@/utils/prisma/prismaClient";
import { MIN_SESSIONS_PER_WEEK, MAX_SESSIONS_PER_WEEK } from "@/utils/pricing/sessionPricing";
import { CUSTOMER_SEGMENTS } from "@/utils/pppPricing";

// Bridges the public, no-account /checkout page into the existing
// authenticated subscription flow. Creates (or reuses) an account silently
// — no password is ever shown or asked for here; the payment itself is the
// proof of intent — signs the browser into it, then lets the unmodified
// ensure-plan / create / lifetime create-order routes take over exactly as
// they do from Settings.
const payloadSchema = z.object({
  fullName: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(1).max(50),
  sessionsPerWeek: z.number().int().min(MIN_SESSIONS_PER_WEEK).max(MAX_SESSIONS_PER_WEEK),
  planType: z.enum(["ONLINE", "SELF_PACED"]),
  tier: z.enum(["recurring", "lifetime"]),
  billingCycle: z.number().int().optional(),
  paymentProvider: z.enum(["razorpay", "paypal"]).default("razorpay"),
  city: z.string().trim().max(120).optional(),
  segment: z.enum(CUSTOMER_SEGMENTS).optional(),
});

async function markAttempt(attemptId: string | null, data: Record<string, unknown>) {
  if (!attemptId) return;
  try {
    await prisma.checkout_attempts.update({ where: { id: attemptId }, data });
  } catch (error) {
    console.error("Failed to update checkout attempt:", error);
  }
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout details" }, { status: 400 });
  }
  const data = parsed.data;

  if (data.tier === "recurring" && data.billingCycle === undefined) {
    return NextResponse.json({ error: "billingCycle is required for a recurring plan" }, { status: 400 });
  }

  // Record the attempt immediately, best-effort, before anything else can
  // fail — this is what makes drop-off at any later stage still visible.
  let attemptId: string | null = null;
  try {
    const attempt = await prisma.checkout_attempts.create({
      data: {
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        sessions_per_week: data.sessionsPerWeek,
        plan_type: data.planType,
        tier: data.tier,
        billing_cycle: data.tier === "recurring" ? data.billingCycle : null,
        payment_provider: data.paymentProvider,
        city: data.city || null,
        customer_segment: data.segment || null,
        status: "started",
      },
    });
    attemptId = attempt.id;
  } catch (error) {
    console.error("Failed to record checkout attempt:", error);
  }

  const supabase = await createClient();

  // Already signed in (e.g. retrying after a drop-off) — just continue.
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();
  if (currentUser) {
    await markAttempt(attemptId, { status: "account_created", user_id: currentUser.id });
    return NextResponse.json({ status: "ok" });
  }

  // An account already exists with this email — don't create a duplicate.
  const existingProfile = await prisma.users_profile.findUnique({
    where: { email: data.email },
    select: { id: true },
  });
  if (existingProfile) {
    await markAttempt(attemptId, { status: "existing_account" });
    return NextResponse.json({
      status: "existing_account",
      redirectTo: `/sign-in?redirect=${encodeURIComponent("/checkout")}`,
    });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing Supabase service role configuration for checkout account creation");
    await markAttempt(attemptId, { status: "failed" });
    return NextResponse.json({ error: "Failed to start checkout" }, { status: 500 });
  }

  const serviceClient = createServiceClient();
  const randomPassword = crypto.randomBytes(24).toString("hex");

  const { data: createdUser, error: createError } = await serviceClient.auth.admin.createUser({
    email: data.email,
    password: randomPassword,
    email_confirm: true,
    user_metadata: { full_name: data.fullName },
  });

  if (createError || !createdUser?.user) {
    console.error("Failed to create checkout account:", createError);
    await markAttempt(attemptId, { status: "failed" });
    return NextResponse.json({ error: "Failed to start checkout" }, { status: 500 });
  }

  // The auth.users -> users_profile mirror trigger should already have
  // created this row; fall back to creating it manually so the rest of the
  // app (which assumes a users_profile row always exists) never breaks.
  await prisma.users_profile
    .upsert({
      where: { id: createdUser.user.id },
      update: {},
      create: {
        id: createdUser.user.id,
        email: data.email,
        name: data.fullName,
        phone: data.phone,
      },
    })
    .catch((error) => {
      console.error("Failed to ensure users_profile row for checkout account:", error);
    });

  // Sign the browser into the new account so the unmodified authenticated
  // checkout flow works from here with zero further changes.
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: randomPassword,
  });

  if (signInError) {
    console.error("Failed to sign in newly created checkout account:", signInError);
    await markAttempt(attemptId, { status: "failed" });
    return NextResponse.json({ error: "Failed to start checkout" }, { status: 500 });
  }

  await markAttempt(attemptId, { status: "account_created", user_id: createdUser.user.id });

  // Best-effort — lets them set a real password to log back in later.
  // Not blocking: checkout continues even if this fails to send.
  try {
    await supabase.auth.resetPasswordForEmail(data.email);
  } catch (error) {
    console.error("Failed to send checkout password-setup email:", error);
  }

  return NextResponse.json({ status: "ok" });
}
