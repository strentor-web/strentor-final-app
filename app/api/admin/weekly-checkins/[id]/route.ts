import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validateServerRole } from "@/lib/server-role-validation";
import prisma from "@/utils/prisma/prismaClient";

const payloadSchema = z.object({
  coachReviewStatus: z.enum(["PENDING", "REVIEWED"]),
  adminNotes: z.string().max(4000).optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await validateServerRole(["ADMIN", "FITNESS_TRAINER_ADMIN", "FITNESS_TRAINER"]);

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

  const checkin = await prisma.weekly_checkins.update({
    where: { id },
    data: {
      coach_review_status: parsed.data.coachReviewStatus,
      admin_notes: parsed.data.adminNotes,
    },
  });

  return NextResponse.json({ id: checkin.id, coachReviewStatus: checkin.coach_review_status });
}
