import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/utils/prisma/prismaClient";
import { sendIntakeNotification } from "@/utils/email/resend";

const SAFETY_ADMIN_EMAIL = "fitassessment@strentor.com";
const COACH_ADMIN_EMAIL = "fitassessment@strentor.com";

function startOfWeek(date: Date): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay();
  const diff = (day + 6) % 7; // Monday-start week
  d.setUTCDate(d.getUTCDate() - diff);
  return d.toISOString().slice(0, 10);
}

const payloadSchema = z.object({
  wins: z.string().max(2000).optional(),
  barriers: z.string().max(2000).optional(),
  painSummary: z.string().max(500).optional(),
  energySummary: z.string().max(500).optional(),
  moodSummary: z.string().max(500).optional(),
  habitConsistency: z.string().max(500).optional(),
  supportNeeded: z.boolean(),
  supportNeededDetails: z.string().max(2000).optional(),
  redFlagDetected: z.boolean(),
});

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (!user?.id || userError) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

  const weekStart = startOfWeek(new Date());
  const data = parsed.data;

  const checkin = await prisma.weekly_checkins.upsert({
    where: { user_id_week_start: { user_id: user.id, week_start: new Date(weekStart) } },
    create: {
      user_id: user.id,
      week_start: new Date(weekStart),
      wins: data.wins,
      barriers: data.barriers,
      pain_summary: data.painSummary,
      energy_summary: data.energySummary,
      mood_summary: data.moodSummary,
      habit_consistency: data.habitConsistency,
      support_needed: data.supportNeeded,
      support_needed_details: data.supportNeededDetails,
      red_flag_detected: data.redFlagDetected,
    },
    update: {
      wins: data.wins,
      barriers: data.barriers,
      pain_summary: data.painSummary,
      energy_summary: data.energySummary,
      mood_summary: data.moodSummary,
      habit_consistency: data.habitConsistency,
      support_needed: data.supportNeeded,
      support_needed_details: data.supportNeededDetails,
      red_flag_detected: data.redFlagDetected,
    },
  });

  if (data.redFlagDetected) {
    await prisma.safety_flags.create({
      data: {
        user_id: user.id,
        source_type: "weekly_checkin",
        source_id: checkin.id,
        symptom_type: "reported in weekly reflection",
        severity: "HIGH",
        message: "Weekly check-in flagged a safety concern. Pause automatic progression pending coach review.",
        status: "OPEN",
        human_review_required: true,
      },
    });
  }

  if (data.redFlagDetected || data.supportNeeded) {
    const userData = await prisma.users_profile.findUnique({ where: { id: user.id }, select: { name: true, email: true } });
    try {
      await sendIntakeNotification({
        to: data.redFlagDetected ? SAFETY_ADMIN_EMAIL : COACH_ADMIN_EMAIL,
        subject: data.redFlagDetected
          ? `[Safety Flag] Weekly check-in — ${userData?.name ?? user.id}`
          : `[Support Requested] Weekly check-in — ${userData?.name ?? user.id}`,
        html: `<div style="font-family: Arial, sans-serif; max-width: 640px; color:#111;">
          <h2 style="color:${data.redFlagDetected ? "#B42318" : "#C9A96A"};">${data.redFlagDetected ? "Safety concern" : "Support requested"} on weekly check-in</h2>
          <p><strong>${escapeHtml(userData?.name ?? "")}</strong> (${escapeHtml(userData?.email ?? "")})</p>
          ${data.barriers ? `<p>Barriers: ${escapeHtml(data.barriers)}</p>` : ""}
          ${data.supportNeededDetails ? `<p>Support requested: ${escapeHtml(data.supportNeededDetails)}</p>` : ""}
        </div>`,
      });
    } catch (error) {
      console.error("Failed to send weekly check-in notification email:", error);
    }
  }

  return NextResponse.json({ id: checkin.id, weekStart });
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (!user?.id || userError) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const checkins = await prisma.weekly_checkins.findMany({
    where: { user_id: user.id },
    orderBy: { week_start: "desc" },
    take: 8,
  });

  const currentWeekStart = startOfWeek(new Date());
  const currentWeek = checkins.find((c) => c.week_start.toISOString().slice(0, 10) === currentWeekStart);

  return NextResponse.json({ checkins, currentWeekStart, currentWeekCompleted: !!currentWeek });
}
