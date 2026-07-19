import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/utils/prisma/prismaClient";
import { sendIntakeNotification } from "@/utils/email/resend";
import { RED_FLAG_OPTIONS, RED_FLAG_NONE_VALUE } from "@/utils/assessment/scoring";

const SAFETY_ADMIN_EMAIL = "fitassessment@strentor.com";
const validSymptomValues = new Set(RED_FLAG_OPTIONS.map((o) => o.value));

const payloadSchema = z.object({
  painLevel: z.number().int().min(0).max(10),
  fatigueLevel: z.number().int().min(0).max(10),
  energyLevel: z.number().int().min(0).max(10),
  moodLevel: z.number().int().min(0).max(10),
  sorenessLevel: z.number().int().min(0).max(10).optional(),
  symptoms: z.array(z.string()).refine((s) => s.every((v) => validSymptomValues.has(v))),
  notes: z.string().max(2000).optional(),
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

  const { painLevel, fatigueLevel, energyLevel, moodLevel, sorenessLevel, symptoms, notes } = parsed.data;
  const redFlagDetected = symptoms.some((s) => s !== RED_FLAG_NONE_VALUE);

  const log = await prisma.pain_fatigue_logs.create({
    data: {
      user_id: user.id,
      pain_level: painLevel,
      fatigue_level: fatigueLevel,
      energy_level: energyLevel,
      mood_level: moodLevel,
      soreness_level: sorenessLevel,
      symptoms,
      notes,
      red_flag_detected: redFlagDetected,
    },
  });

  if (redFlagDetected) {
    const symptomLabels = symptoms
      .filter((s) => s !== RED_FLAG_NONE_VALUE)
      .map((s) => RED_FLAG_OPTIONS.find((o) => o.value === s)?.label || s);

    await prisma.safety_flags.create({
      data: {
        user_id: user.id,
        source_type: "pain_fatigue_log",
        source_id: log.id,
        symptom_type: symptomLabels.join(", "),
        severity: "HIGH",
        message: "Do not progress this movement automatically. Recurring or new symptoms logged — pause and review.",
        status: "OPEN",
        human_review_required: true,
      },
    });

    const userData = await prisma.users_profile.findUnique({ where: { id: user.id }, select: { name: true, email: true } });
    try {
      await sendIntakeNotification({
        to: SAFETY_ADMIN_EMAIL,
        subject: `[Safety Flag] Body check red flag — ${userData?.name ?? user.id}`,
        html: `<div style="font-family: Arial, sans-serif; max-width: 640px; color:#111;">
          <h2 style="color:#B42318;">Red flag on body check (pain/fatigue log)</h2>
          <p><strong>${escapeHtml(userData?.name ?? "")}</strong> (${escapeHtml(userData?.email ?? "")}) reported: ${escapeHtml(symptomLabels.join(", "))}</p>
          <p>Pain ${painLevel}/10, Fatigue ${fatigueLevel}/10. human_review_required = true.</p>
        </div>`,
      });
    } catch (error) {
      console.error("Failed to send pain/fatigue safety flag email:", error);
    }
  }

  return NextResponse.json({ id: log.id, redFlagDetected });
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (!user?.id || userError) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const logs = await prisma.pain_fatigue_logs.findMany({
    where: { user_id: user.id },
    orderBy: { created_at: "desc" },
    take: 10,
  });

  return NextResponse.json({ logs });
}
