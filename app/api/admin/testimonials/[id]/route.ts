import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validateServerRole } from "@/lib/server-role-validation";
import prisma from "@/utils/prisma/prismaClient";

const payloadSchema = z.object({
  approvalStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await validateServerRole(["ADMIN", "FITNESS_TRAINER_ADMIN"]);

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

  const testimonial = await prisma.testimonials.update({
    where: { id },
    data: {
      approval_status: parsed.data.approvalStatus,
      published_at: parsed.data.approvalStatus === "APPROVED" ? new Date() : null,
    },
  });

  return NextResponse.json({ id: testimonial.id, approvalStatus: testimonial.approval_status });
}
