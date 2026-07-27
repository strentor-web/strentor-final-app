import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validateServerRole } from "@/lib/server-role-validation";
import prisma from "@/utils/prisma/prismaClient";

const payloadSchema = z.object({
  status: z.enum(["converted", "paid"]),
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

  const existing = await prisma.referrals.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Referral not found" }, { status: 404 });
  }

  if (parsed.data.status === "converted" && existing.status !== "pending") {
    return NextResponse.json({ error: "Only a pending referral can be marked converted" }, { status: 400 });
  }
  if (parsed.data.status === "paid" && existing.status !== "converted") {
    return NextResponse.json({ error: "Only a converted referral can be marked paid" }, { status: 400 });
  }

  const referral = await prisma.referrals.update({
    where: { id },
    data: {
      status: parsed.data.status,
      converted_at: parsed.data.status === "converted" ? new Date() : existing.converted_at,
      cashback_paid_at: parsed.data.status === "paid" ? new Date() : existing.cashback_paid_at,
    },
  });

  return NextResponse.json({ id: referral.id, status: referral.status });
}
