import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/utils/prisma/prismaClient";
import { createClient } from "@/utils/supabase/server";
import { sendWebinarRegistrationConfirmation } from "@/utils/email/resend";

// Public, unauthenticated endpoint backing the webinar registration form.
// Same rate-limit + honeypot + duplicate-submission pattern as
// /api/intake/submit and /api/site-testimonials/submit.
const payloadSchema = z.object({
  fullName: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(50).optional(),
  sourcePage: z.string().max(200).optional(),
  // Honeypot — real visitors never see or fill this field.
  website: z.string().max(0).optional().or(z.literal("")),
});

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 8;
const DUPLICATE_WINDOW_MS = 60 * 1000;
const MAX_TRACKED_ENTRIES = 5000;

const rateLimitHits = new Map<string, number[]>();
const recentSubmissions = new Map<string, number>();

function pruneMap(map: Map<string, unknown>) {
  if (map.size <= MAX_TRACKED_ENTRIES) return;
  const keys = map.keys();
  for (let i = 0; i < map.size - MAX_TRACKED_ENTRIES; i++) {
    const next = keys.next();
    if (next.done) break;
    map.delete(next.value);
  }
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (rateLimitHits.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  hits.push(now);
  rateLimitHits.set(ip, hits);
  pruneMap(rateLimitHits);
  return hits.length > RATE_LIMIT_MAX_REQUESTS;
}

function isDuplicateSubmission(key: string): boolean {
  const now = Date.now();
  const last = recentSubmissions.get(key);
  recentSubmissions.set(key, now);
  pruneMap(recentSubmissions);
  return last !== undefined && now - last < DUPLICATE_WINDOW_MS;
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: webinarId } = await params;

  const clientIp = getClientIp(request);
  if (isRateLimited(clientIp)) {
    return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  const { fullName, email, phone, sourcePage, website } = parsed.data;

  if (website) {
    return NextResponse.json({ success: true });
  }

  const duplicateKey = `${clientIp}:${email.toLowerCase()}:${webinarId}`;
  if (isDuplicateSubmission(duplicateKey)) {
    return NextResponse.json({ success: true });
  }

  const webinar = await prisma.webinars.findUnique({ where: { id: webinarId } });
  if (!webinar || webinar.status !== "PUBLISHED") {
    return NextResponse.json({ error: "This webinar isn't open for registration" }, { status: 404 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const existing = await prisma.webinar_registrations.findUnique({
    where: { webinar_id_email: { webinar_id: webinarId, email } },
  });
  if (existing) {
    if (existing.status === "CANCELLED") {
      await prisma.webinar_registrations.update({
        where: { id: existing.id },
        data: { status: "REGISTERED", full_name: fullName, phone, user_id: user?.id ?? existing.user_id },
      });
    }
    // Already registered (or just reactivated) — confirmation was already
    // sent the first time, so don't resend, just report success.
    return NextResponse.json({ success: true });
  }

  const registration = await prisma.webinar_registrations.create({
    data: {
      webinar_id: webinarId,
      user_id: user?.id,
      full_name: fullName,
      email,
      phone,
      source_page: sourcePage,
    },
  });

  try {
    await sendWebinarRegistrationConfirmation({
      to: email,
      name: fullName,
      webinarTitle: webinar.title,
      startsAt: webinar.starts_at,
      joinUrl: webinar.join_url,
    });
  } catch (error) {
    // Non-blocking — the registration is already saved, the confirmation
    // email is a nice-to-have, not the source of truth.
    console.error("Failed to send webinar registration confirmation:", error);
  }

  return NextResponse.json({ success: true, id: registration.id });
}
