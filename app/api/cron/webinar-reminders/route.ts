import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma/prismaClient";
import { sendWebinarReminder } from "@/utils/email/resend";

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

// Bucketed to the nearest hour, since this cron needs to run more often
// than the once-daily cadence the other cron routes use (see vercel.json
// scheduling note in the implementation plan).
function withinWindow(target: Date, hoursFromNow: number, now: Date) {
  const windowStart = new Date(now.getTime() + (hoursFromNow - 0.5) * 60 * 60 * 1000);
  const windowEnd = new Date(now.getTime() + (hoursFromNow + 0.5) * 60 * 60 * 1000);
  return target >= windowStart && target < windowEnd;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  const dueRegistrations = await prisma.webinar_registrations.findMany({
    where: {
      status: "REGISTERED",
      webinar: {
        status: "PUBLISHED",
        starts_at: { gte: now },
      },
    },
    include: { webinar: true },
  });

  let sent = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const reg of dueRegistrations) {
    let reminderType: "24h" | "1h" | null = null;
    if (!reg.reminder_24h_sent_at && withinWindow(reg.webinar.starts_at, 24, now)) {
      reminderType = "24h";
    } else if (!reg.reminder_1h_sent_at && withinWindow(reg.webinar.starts_at, 1, now)) {
      reminderType = "1h";
    }

    if (!reminderType) {
      skipped++;
      continue;
    }

    try {
      await sendWebinarReminder({
        to: reg.email,
        name: reg.full_name,
        webinarTitle: reg.webinar.title,
        startsAt: reg.webinar.starts_at,
        joinUrl: reg.webinar.join_url,
        hoursUntil: reminderType === "24h" ? 24 : 1,
      });

      await prisma.webinar_registrations.update({
        where: { id: reg.id },
        data:
          reminderType === "24h"
            ? { reminder_24h_sent_at: now }
            : { reminder_1h_sent_at: now },
      });

      sent++;
    } catch (error) {
      errors.push(`registration ${reg.id}: ${error instanceof Error ? error.message : "unknown error"}`);
    }
  }

  return NextResponse.json({
    success: true,
    checked: dueRegistrations.length,
    sent,
    skipped,
    errors,
    timestamp: now.toISOString(),
  });
}
