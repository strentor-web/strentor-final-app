import { NextRequest, NextResponse } from "next/server";
import { checkAdminAccess } from "@/utils/user";
import prisma from "@/utils/prisma/prismaClient";

// Looks up refundable one-time purchases (Starter Kit, Lifetime Membership)
// by customer email — the natural thing support/admin staff have on hand
// when a refund is requested. No FK relation exists between the purchase
// tables and users_profile, so this joins them manually in two queries.
export async function GET(request: NextRequest) {
  await checkAdminAccess();

  const email = request.nextUrl.searchParams.get("email")?.trim();
  if (!email || email.length < 3) {
    return NextResponse.json({ error: "Provide at least 3 characters of an email to search" }, { status: 400 });
  }

  const users = await prisma.users_profile.findMany({
    where: { email: { contains: email, mode: "insensitive" } },
    select: { id: true, email: true, name: true },
    take: 20,
  });
  const userIds = users.map((u) => u.id);
  const userById = new Map(users.map((u) => [u.id, u]));

  if (userIds.length === 0) {
    return NextResponse.json({ purchases: [] });
  }

  const [starterKit, lifetime] = await Promise.all([
    prisma.starter_kit_purchases.findMany({
      where: { user_id: { in: userIds } },
      orderBy: { created_at: "desc" },
      take: 50,
    }),
    prisma.lifetime_membership_purchases.findMany({
      where: { user_id: { in: userIds } },
      orderBy: { created_at: "desc" },
      take: 50,
    }),
  ]);

  const purchases = [
    ...starterKit.map((p) => ({
      source: "starter_kit" as const,
      id: p.id,
      user: userById.get(p.user_id) ?? null,
      provider: "razorpay" as const,
      paymentId: p.razorpay_payment_id,
      amount: p.amount.toString(),
      currency: "INR",
      status: p.status,
      createdAt: p.created_at.toISOString(),
    })),
    ...lifetime.map((p) => ({
      source: "lifetime" as const,
      id: p.id,
      user: userById.get(p.user_id) ?? null,
      provider: (p.payment_provider === "paypal" ? "paypal" : "razorpay") as "razorpay" | "paypal",
      paymentId: p.provider_payment_id,
      amount: p.amount.toString(),
      currency: p.currency,
      status: p.status,
      createdAt: p.created_at.toISOString(),
    })),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return NextResponse.json({ purchases });
}
