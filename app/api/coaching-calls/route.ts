import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/utils/prisma/prismaClient";
import { sendIntakeNotification } from "@/utils/email/resend";

const COACH_ADMIN_EMAIL = "fitassessment@strentor.com";

const payloadSchema = z.object({
  callType: z.string().max(50).default("discovery"),
  eventUri: z.string().max(500).optional(),
});

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Records a coaching_calls row once Calendly confirms a booking (see
// components/forms/CalendlyEmbedModal.tsx onScheduled callback). This is
// intentionally best-effort logging, not the payment/auth flow.
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
    body = {};
  }

  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  const { callType, eventUri } = parsed.data;

  const call = await prisma.coaching_calls.create({
    data: {
      user_id: user.id,
      call_type: callType,
      status: "scheduled",
      booking_time: new Date(),
      notes: eventUri ? `Calendly event: ${eventUri}` : undefined,
    },
  });

  const userData = await prisma.users_profile.findUnique({ where: { id: user.id }, select: { name: true, email: true } });
  try {
    await sendIntakeNotification({
      to: COACH_ADMIN_EMAIL,
      subject: `[Discovery Call Booked] ${userData?.name ?? user.id}`,
      html: `<div style="font-family: Arial, sans-serif; max-width: 640px; color:#111;">
        <h2 style="color:#C9A96A;">Discovery call booked</h2>
        <p><strong>${escapeHtml(userData?.name ?? "")}</strong> (${escapeHtml(userData?.email ?? "")}) booked a ${escapeHtml(callType)} call.</p>
      </div>`,
    });
  } catch (error) {
    console.error("Failed to send discovery call notification email:", error);
  }

  return NextResponse.json({ id: call.id });
}
