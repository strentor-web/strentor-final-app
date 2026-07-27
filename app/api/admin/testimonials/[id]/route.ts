import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validateServerRole } from "@/lib/server-role-validation";
import prisma from "@/utils/prisma/prismaClient";

const payloadSchema = z.union([
  z.object({ approvalStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]) }),
  z.object({ markCashbackPaid: z.literal(true) }),
]);

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

  if ("markCashbackPaid" in parsed.data) {
    // Only payable once the review has actually been approved as genuine.
    const existing = await prisma.testimonials.findUnique({ where: { id } });
    if (!existing || existing.approval_status !== "APPROVED") {
      return NextResponse.json({ error: "Cashback can only be marked paid on an approved review" }, { status: 400 });
    }
    const testimonial = await prisma.testimonials.update({
      where: { id },
      data: { cashback_paid_at: new Date() },
    });
    return NextResponse.json({ id: testimonial.id, cashbackPaidAt: testimonial.cashback_paid_at });
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
