import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkAdminAccess } from "@/utils/user";
import prisma from "@/utils/prisma/prismaClient";

async function requireFullAdmin() {
  const admin = await checkAdminAccess();
  if (admin.role !== "ADMIN") {
    throw new Error("This action requires the ADMIN role, not just admin panel access");
  }
  return admin;
}

const patchSchema = z.object({
  isActive: z.boolean().optional(),
  endsAt: z.string().datetime().nullable().optional(),
  redemptionLimit: z.number().int().positive().nullable().optional(),
  label: z.string().trim().max(200).nullable().optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    await requireFullAdmin();
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Forbidden" }, { status: 403 });
  }

  const existing = await prisma.promo_codes.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Promo code not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid submission" }, { status: 400 });
  }
  const data = parsed.data;

  const updated = await prisma.promo_codes.update({
    where: { id },
    data: {
      ...(data.isActive !== undefined && { is_active: data.isActive }),
      ...(data.endsAt !== undefined && { ends_at: data.endsAt ? new Date(data.endsAt) : null }),
      ...(data.redemptionLimit !== undefined && { redemption_limit: data.redemptionLimit }),
      ...(data.label !== undefined && { label: data.label }),
    },
  });

  return NextResponse.json({ promoCode: updated });
}

// Deactivate rather than delete, so redemption history stays intact and
// attributable.
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    await requireFullAdmin();
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Forbidden" }, { status: 403 });
  }

  const existing = await prisma.promo_codes.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Promo code not found" }, { status: 404 });
  }

  await prisma.promo_codes.update({ where: { id }, data: { is_active: false } });

  return NextResponse.json({ status: "ok" });
}
