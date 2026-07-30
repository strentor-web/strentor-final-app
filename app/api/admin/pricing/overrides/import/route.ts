import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma/prismaClient";
import { logPricingChange } from "@/utils/pricingOverrides";
import { parseCsv } from "@/utils/csv";
import { payloadSchema, requireFullAdmin } from "@/utils/pricing/overridePayload";

// Bulk-creates pricing_overrides rows from a CSV (same shape produced by
// GET .../export). Every row becomes a brand-new override — this never
// updates an existing row in place, for the same reason the single-row
// PATCH route calls invalidateCachedPlansForOverride(): an in-place price
// change on a row already cached into subscription_plans would silently
// serve the stale price to new signups. Re-importing an edited export is
// therefore "add a new override," not "edit the old one" — the old row
// should be deactivated separately if it's being superseded.
function stripLeadingApostrophe(v: string): string {
  return v.startsWith("'") ? v.slice(1) : v;
}

export async function POST(request: NextRequest) {
  let admin;
  try {
    admin = await requireFullAdmin();
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Forbidden" }, { status: 403 });
  }

  const text = await request.text();
  if (!text.trim()) {
    return NextResponse.json({ error: "Empty CSV" }, { status: 400 });
  }

  const rows = parseCsv(text);
  if (rows.length < 2) {
    return NextResponse.json({ error: "CSV has no data rows" }, { status: 400 });
  }

  const header = rows[0].map((h) => h.trim());
  const dataRows = rows.slice(1);

  const results: { row: number; status: "created" | "error"; error?: string; id?: string }[] = [];

  for (let i = 0; i < dataRows.length; i++) {
    const cells = dataRows[i];
    const record: Record<string, string> = {};
    header.forEach((col, idx) => {
      record[col] = stripLeadingApostrophe((cells[idx] ?? "").trim());
    });

    const candidate = {
      scopeCountry: record.scopeCountry || undefined,
      scopeCity: record.scopeCity || undefined,
      scopeSegment: record.scopeSegment || undefined,
      tierOverride: record.tierOverride ? Number(record.tierOverride) : undefined,
      multiplierOverride: record.multiplierOverride ? Number(record.multiplierOverride) : undefined,
      minPriceUsd: record.minPriceUsd ? Number(record.minPriceUsd) : undefined,
      maxPriceUsd: record.maxPriceUsd ? Number(record.maxPriceUsd) : undefined,
      isExcluded: record.isExcluded ? record.isExcluded.toLowerCase() === "true" : undefined,
      label: record.label || undefined,
      startsAt: record.startsAt ? new Date(record.startsAt).toISOString() : undefined,
      endsAt: record.endsAt ? new Date(record.endsAt).toISOString() : undefined,
    };

    const parsed = payloadSchema.safeParse(candidate);
    if (!parsed.success) {
      results.push({ row: i + 2, status: "error", error: parsed.error.issues[0]?.message ?? "Invalid row" });
      continue;
    }
    const data = parsed.data;

    try {
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
        notes: "Created via CSV import",
      });

      results.push({ row: i + 2, status: "created", id: override.id });
    } catch (error) {
      results.push({ row: i + 2, status: "error", error: error instanceof Error ? error.message : "Failed to create" });
    }
  }

  const created = results.filter((r) => r.status === "created").length;
  return NextResponse.json({ created, failed: results.length - created, results });
}
