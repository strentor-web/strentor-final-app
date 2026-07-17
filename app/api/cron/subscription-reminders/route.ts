import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma/prismaClient";
import { sendSubscriptionRenewalReminder } from "@/utils/email/resend";

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

async function alreadySent(subscriptionId: string, reminderType: "3_DAY" | "1_DAY", chargeIso: string) {
  // Dedup against the same upcoming charge across daily cron runs.
  const match = await prisma.subscription_events.findFirst({
    where: {
      subscription_id: subscriptionId,
      event_type: "renewal_reminder_sent",
      metadata: {
        path: ["reminder_type"],
        equals: reminderType,
      },
    },
  });
  if (!match) return false;

  const metadata = match.metadata as { next_charge_at?: string } | null;
  return metadata?.next_charge_at === chargeIso;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const oneDayFromNow = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);

  const dueSubscriptions = await prisma.user_subscriptions.findMany({
    where: {
      status: "ACTIVE",
      payment_status: "COMPLETED",
      cancel_at_cycle_end: false,
      next_charge_at: { not: null },
    },
    include: {
      subscription_plans: true,
      users_profile: true,
    },
  });

  let sent = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const sub of dueSubscriptions) {
    if (!sub.next_charge_at || !sub.users_profile?.email) continue;

    let reminderType: "3_DAY" | "1_DAY" | null = null;
    if (isSameDay(sub.next_charge_at, threeDaysFromNow)) reminderType = "3_DAY";
    else if (isSameDay(sub.next_charge_at, oneDayFromNow)) reminderType = "1_DAY";
    if (!reminderType) continue;

    const chargeIso = sub.next_charge_at.toISOString();
    if (await alreadySent(sub.id, reminderType, chargeIso)) {
      skipped++;
      continue;
    }

    try {
      await sendSubscriptionRenewalReminder({
        to: sub.users_profile.email,
        name: sub.users_profile.name,
        planName: sub.subscription_plans.name,
        amount: Number(sub.subscription_plans.price),
        chargeDate: sub.next_charge_at,
        daysUntilCharge: reminderType === "3_DAY" ? 3 : 1,
      });

      await prisma.subscription_events.create({
        data: {
          user_id: sub.user_id,
          subscription_id: sub.id,
          subscription_plan_id: sub.plan_id,
          event_type: "renewal_reminder_sent",
          metadata: { reminder_type: reminderType, next_charge_at: chargeIso },
        },
      });

      sent++;
    } catch (error) {
      errors.push(
        `subscription ${sub.id}: ${error instanceof Error ? error.message : "unknown error"}`
      );
    }
  }

  return NextResponse.json({
    success: true,
    checked: dueSubscriptions.length,
    sent,
    skipped,
    errors,
    timestamp: now.toISOString(),
  });
}
