import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkAdminAccess } from "@/utils/user";
import prisma from "@/utils/prisma/prismaClient";
import { razorpayGateway } from "@/lib/payments/razorpayGateway";
import { paypalGateway } from "@/lib/payments/paypalGateway";

async function requireFullAdmin() {
  const admin = await checkAdminAccess();
  if (admin.role !== "ADMIN") {
    throw new Error("This action requires the ADMIN role, not just admin panel access");
  }
  return admin;
}

// Refunds for one-time purchases only (Starter Kit, Lifetime Membership) —
// these are the only records that store a concrete provider payment/capture
// id. Recurring subscriptions have no per-charge payment record anywhere in
// the schema (only aggregate counters like paid_count/current_start), so a
// specific recurring charge can't be looked up and refunded here; that
// would need a new per-payment ledger table, out of scope for this pass.
const payloadSchema = z.object({
  source: z.enum(["starter_kit", "lifetime"]),
  id: z.string().uuid(),
  amount: z.number().positive().optional(), // omit for a full refund
  reason: z.string().trim().max(500).optional(),
});

export async function POST(request: NextRequest) {
  let admin;
  try {
    admin = await requireFullAdmin();
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid submission" }, { status: 400 });
  }
  const { source, id, amount, reason } = parsed.data;

  let userId: string;
  let paymentId: string | null;
  let provider: "razorpay" | "paypal";

  if (source === "starter_kit") {
    const purchase = await prisma.starter_kit_purchases.findUnique({ where: { id } });
    if (!purchase) return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
    if (purchase.status === "REFUNDED") {
      return NextResponse.json({ error: "Already refunded" }, { status: 409 });
    }
    userId = purchase.user_id;
    paymentId = purchase.razorpay_payment_id;
    provider = "razorpay"; // starter_kit_purchases is Razorpay-only today, no payment_provider column
  } else {
    const purchase = await prisma.lifetime_membership_purchases.findUnique({ where: { id } });
    if (!purchase) return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
    if (purchase.status === "REFUNDED") {
      return NextResponse.json({ error: "Already refunded" }, { status: 409 });
    }
    userId = purchase.user_id;
    paymentId = purchase.provider_payment_id;
    provider = purchase.payment_provider === "paypal" ? "paypal" : "razorpay";
  }

  if (!paymentId) {
    return NextResponse.json({ error: "No captured payment recorded on this purchase yet" }, { status: 400 });
  }

  const gateway = provider === "paypal" ? paypalGateway : razorpayGateway;

  let refund;
  try {
    refund = await gateway.refundPayment({ paymentId, amount, reason });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Refund failed at the payment provider" },
      { status: 502 }
    );
  }

  if (source === "starter_kit") {
    await prisma.starter_kit_purchases.update({ where: { id }, data: { status: "REFUNDED" } });
  } else {
    await prisma.lifetime_membership_purchases.update({ where: { id }, data: { status: "REFUNDED" } });
  }

  await prisma.admin_notes.create({
    data: {
      user_id: userId,
      related_type: source,
      related_id: id,
      note: `Refund issued via ${provider} (${refund.id}, status: ${refund.status})${
        amount !== undefined ? `, amount: ${amount}` : " (full)"
      }.${reason ? ` Reason: ${reason}` : ""}`,
      visibility: "internal",
      created_by_id: admin.userId,
    },
  });

  return NextResponse.json({ refund });
}
