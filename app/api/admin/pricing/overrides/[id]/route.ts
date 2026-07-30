import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkAdminAccess } from "@/utils/user";
import prisma from "@/utils/prisma/prismaClient";
import { logPricingChange, invalidateCachedPlansForOverride } from "@/utils/pricingOverrides";
import { CUSTOMER_SEGMENTS } from "@/utils/pppPricing";

async function requireFullAdmin() {
  const admin = await checkAdminAccess();
  if (admin.role !== "ADMIN") {
    throw new Error("This action requires the ADMIN role, not just admin panel access");
  }
  return admin;
}

const patchSchema = z.object({
  scopeCountry: z.string().trim().length(2).toUpperCase().nullable().optional(),
  scopeCity: z.string().trim().min(1).max(120).nullable().optional(),
  scopeSegment: z.enum(CUSTOMER_SEGMENTS).nullable().optional(),
  tierOverride: z.number().int().min(1).max(5).nullable().optional(),
  multiplierOverride: z.number().positive().max(10).nullable().optional(),
  minPriceUsd: z.number().nonnegative().nullable().optional(),
  maxPriceUsd: z.number().positive().nullable().optional(),
  isExcluded: z.boolean().optional(),
  isActive: z.boolean().optional(),
  label: z.string().trim().max(200).nullable().optional(),
  startsAt: z.string().datetime().nullable().optional(),
  endsAt: z.string().datetime().nullable().optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let admin;
  try {
    admin = await requireFullAdmin();
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Forbidden" }, { status: 403 });
  }

  const existing = await prisma.pricing_overrides.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Override not found" }, { status: 404 });
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

  const updated = await prisma.pricing_overrides.update({
    where: { id },
    data: {
      ...(data.scopeCountry !== undefined && { scope_country: data.scopeCountry }),
      ...(data.scopeCity !== undefined && {
        scope_city: data.scopeCity ? data.scopeCity.toLowerCase().trim() : null,
      }),
      ...(data.scopeSegment !== undefined && { scope_segment: data.scopeSegment }),
      ...(data.tierOverride !== undefined && { tier_override: data.tierOverride }),
      ...(data.multiplierOverride !== undefined && { multiplier_override: data.multiplierOverride }),
      ...(data.minPriceUsd !== undefined && { min_price_usd: data.minPriceUsd }),
      ...(data.maxPriceUsd !== undefined && { max_price_usd: data.maxPriceUsd }),
      ...(data.isExcluded !== undefined && { is_excluded: data.isExcluded }),
      ...(data.isActive !== undefined && { is_active: data.isActive }),
      ...(data.label !== undefined && { label: data.label }),
      ...(data.startsAt !== undefined && { starts_at: data.startsAt ? new Date(data.startsAt) : null }),
      ...(data.endsAt !== undefined && { ends_at: data.endsAt ? new Date(data.endsAt) : null }),
    },
  });

  await invalidateCachedPlansForOverride(id);

  await logPricingChange({
    overrideId: id,
    action: "UPDATE",
    before: existing,
    after: updated,
    changedBy: admin.userId,
  });

  return NextResponse.json({ override: updated });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let admin;
  try {
    admin = await requireFullAdmin();
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Forbidden" }, { status: 403 });
  }

  const existing = await prisma.pricing_overrides.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Override not found" }, { status: 404 });
  }

  // Soft delete — deactivate rather than remove, so the audit trail and
  // rollback capability stay intact.
  const updated = await prisma.pricing_overrides.update({
    where: { id },
    data: { is_active: false },
  });

  await invalidateCachedPlansForOverride(id);

  await logPricingChange({
    overrideId: id,
    action: "DELETE",
    before: existing,
    after: updated,
    changedBy: admin.userId,
  });

  return NextResponse.json({ status: "ok" });
}
