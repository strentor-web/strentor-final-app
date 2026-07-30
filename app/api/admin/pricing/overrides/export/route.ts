import { NextResponse } from "next/server";
import { checkAdminAccess } from "@/utils/user";
import prisma from "@/utils/prisma/prismaClient";
import { stringifyCsv } from "@/utils/csv";

const COLUMNS = [
  "id",
  "scopeCountry",
  "scopeCity",
  "scopeSegment",
  "tierOverride",
  "multiplierOverride",
  "minPriceUsd",
  "maxPriceUsd",
  "isExcluded",
  "label",
  "startsAt",
  "endsAt",
  "isActive",
] as const;

export async function GET() {
  await checkAdminAccess();

  const overrides = await prisma.pricing_overrides.findMany({ orderBy: { created_at: "desc" } });

  const rows: string[][] = [
    [...COLUMNS],
    ...overrides.map((o) => [
      o.id,
      o.scope_country ?? "",
      o.scope_city ?? "",
      o.scope_segment ?? "",
      o.tier_override?.toString() ?? "",
      o.multiplier_override?.toString() ?? "",
      o.min_price_usd?.toString() ?? "",
      o.max_price_usd?.toString() ?? "",
      o.is_excluded ? "true" : "false",
      o.label ?? "",
      o.starts_at?.toISOString() ?? "",
      o.ends_at?.toISOString() ?? "",
      o.is_active ? "true" : "false",
    ]),
  ];

  const csv = stringifyCsv(rows);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="pricing-overrides-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
