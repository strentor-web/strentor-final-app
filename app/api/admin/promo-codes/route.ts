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

const payloadSchema = z
  .object({
    code: z.string().trim().min(3).max(40),
    type: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
    value: z.number().positive(),
    scopeCountry: z.string().trim().length(2).toUpperCase().optional(),
    scopeProduct: z.enum(["recurring", "lifetime", "starter_kit"]).optional(),
    startsAt: z.string().datetime().optional(),
    endsAt: z.string().datetime().optional(),
    redemptionLimit: z.number().int().positive().optional(),
    perCustomerLimit: z.number().int().positive().default(1),
    label: z.string().trim().max(200).optional(),
  })
  .refine((data) => data.type !== "PERCENTAGE" || data.value <= 100, {
    message: "A percentage discount can't exceed 100",
    path: ["value"],
  });

export async function GET() {
  await checkAdminAccess();

  const promoCodes = await prisma.promo_codes.findMany({
    orderBy: { created_at: "desc" },
    include: { _count: { select: { promo_code_redemptions: true } } },
  });

  return NextResponse.json({ promoCodes });
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
  const code = data.code.toUpperCase();

  const existing = await prisma.promo_codes.findUnique({ where: { code } });
  if (existing) {
    return NextResponse.json({ error: "A promo code with this code already exists" }, { status: 409 });
  }

  const promoCode = await prisma.promo_codes.create({
    data: {
      code,
      type: data.type,
      value: data.value,
      scope_country: data.scopeCountry ?? null,
      scope_product: data.scopeProduct ?? null,
      starts_at: data.startsAt ? new Date(data.startsAt) : null,
      ends_at: data.endsAt ? new Date(data.endsAt) : null,
      redemption_limit: data.redemptionLimit ?? null,
      per_customer_limit: data.perCustomerLimit,
      label: data.label ?? null,
      created_by: admin.userId,
    },
  });

  return NextResponse.json({ promoCode });
}
