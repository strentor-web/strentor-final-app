import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validateServerRole } from "@/lib/server-role-validation";
import prisma from "@/utils/prisma/prismaClient";

const payloadSchema = z.object({
  seatPriceAmount: z.number().positive().nullable().optional(),
  seatPriceCurrency: z.string().trim().length(3).toUpperCase().nullable().optional(),
  contractStartsAt: z.string().datetime().nullable().optional(),
  contractEndsAt: z.string().datetime().nullable().optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await validateServerRole(["ADMIN", "FITNESS_TRAINER_ADMIN"]);
  const { id } = await params;

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
  const data = parsed.data;

  const group = await prisma.corporate_groups.update({
    where: { id },
    data: {
      ...(data.seatPriceAmount !== undefined && { seat_price_amount: data.seatPriceAmount }),
      ...(data.seatPriceCurrency !== undefined && { seat_price_currency: data.seatPriceCurrency }),
      ...(data.contractStartsAt !== undefined && {
        contract_starts_at: data.contractStartsAt ? new Date(data.contractStartsAt) : null,
      }),
      ...(data.contractEndsAt !== undefined && {
        contract_ends_at: data.contractEndsAt ? new Date(data.contractEndsAt) : null,
      }),
    },
  });

  return NextResponse.json({
    id: group.id,
    seatPriceAmount: group.seat_price_amount?.toString() ?? null,
    seatPriceCurrency: group.seat_price_currency,
    contractStartsAt: group.contract_starts_at?.toISOString() ?? null,
    contractEndsAt: group.contract_ends_at?.toISOString() ?? null,
  });
}
