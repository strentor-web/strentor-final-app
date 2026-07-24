import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkAdminAccess } from "@/utils/user";
import prisma from "@/utils/prisma/prismaClient";
import { logPricingChange } from "@/utils/pricingOverrides";
import { CUSTOMER_SEGMENTS } from "@/utils/pppPricing";

async function requireFullAdmin() {
  const admin = await checkAdminAccess();
  if (admin.role !== "ADMIN") {
    throw new Error("This action requires the ADMIN role, not just admin panel access");
  }
  return admin;
}

const payloadSchema = z
  .object({
    scopeCountry: z.string().trim().length(2).toUpperCase().optional(),
    scopeCity: z.string().trim().min(1).max(120).optional(),
    scopeSegment: z.enum(CUSTOMER_SEGMENTS).optional(),
    tierOverride: z.number().int().min(1).max(5).optional(),
    multiplierOverride: z.number().positive().max(10).optional(),
    minPriceUsd: z.number().nonnegative().optional(),
    maxPriceUsd: z.number().positive().optional(),
    isExcluded: z.boolean().optional(),
    label: z.string().trim().max(200).optional(),
    startsAt: z.string().datetime().optional(),
    endsAt: z.string().datetime().optional(),
  })
  .refine((data) => !data.scopeCity || data.scopeCountry, {
    message: "A city-scoped override must also specify a country",
    path: ["scopeCity"],
  })
  .refine((data) => !(data.minPriceUsd && data.maxPriceUsd) || data.minPriceUsd <= data.maxPriceUsd, {
    message: "minPriceUsd must be less than or equal to maxPriceUsd",
    path: ["minPriceUsd"],
  });

export async function GET() {
  await checkAdminAccess();

  const overrides = await prisma.pricing_overrides.findMany({
    orderBy: { created_at: "desc" },
  });

  return NextResponse.json({ overrides });
}

export async function POST(request: NextRequest) {
  let admin;
  try {
    admin = await requireFullAdmin();
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid submission" }, { status: 400 });
  }
  const data = parsed.data;

  const override = await prisma.pricing_overrides.create({
    data: {
      scope_country: data.scopeCountry ?? null,
      scope_city: data.scopeCity ? data.scopeCity.toLowerCase().trim() : null,
      scope_segment: data.scopeSegment ?? null,
      tier_override: data.tierOverride ?? null,
      multiplier_override: data.multiplierOverride ?? null,
      min_price_usd: data.minPriceUsd ?? null,
      max_price_usd: data.maxPriceUsd ?? null,
      is_excluded: data.isExcluded ?? false,
      label: data.label ?? null,
      starts_at: data.startsAt ? new Date(data.startsAt) : null,
      ends_at: data.endsAt ? new Date(data.endsAt) : null,
      created_by: admin.userId,
    },
  });

  await logPricingChange({
    overrideId: override.id,
    action: "CREATE",
    before: null,
    after: override,
    changedBy: admin.userId,
  });

  return NextResponse.json({ override });
}
