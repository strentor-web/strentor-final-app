import { NextRequest, NextResponse } from "next/server";
import { checkAdminAccess } from "@/utils/user";
import prisma from "@/utils/prisma/prismaClient";
import { logPricingChange, invalidateCachedPlansForOverride } from "@/utils/pricingOverrides";

async function requireFullAdmin() {
  const admin = await checkAdminAccess();
  if (admin.role !== "ADMIN") {
    throw new Error("This action requires the ADMIN role, not just admin panel access");
  }
  return admin;
}

// Reverts an override to the state captured in a specific prior audit log
// entry's "before" snapshot — pass { auditLogId } to pick which entry to
// roll back to; defaults to the most recent entry for this override if
// omitted.
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

  let auditLogId: string | undefined;
  try {
    const body = await request.json();
    auditLogId = typeof body?.auditLogId === "string" ? body.auditLogId : undefined;
  } catch {
    // No body — roll back to the most recent entry.
  }

  const targetEntry = auditLogId
    ? await prisma.pricing_audit_log.findFirst({ where: { id: auditLogId, override_id: id } })
    : await prisma.pricing_audit_log.findFirst({
        where: { override_id: id },
        orderBy: { changed_at: "desc" },
      });

  if (!targetEntry || !targetEntry.before) {
    return NextResponse.json({ error: "No prior state to roll back to" }, { status: 400 });
  }

  const before = targetEntry.before as Record<string, unknown>;

  const rolledBack = await prisma.pricing_overrides.update({
    where: { id },
    data: {
      scope_country: (before.scope_country as string | null) ?? null,
      scope_city: (before.scope_city as string | null) ?? null,
      scope_segment: (before.scope_segment as string | null) ?? null,
      tier_override: (before.tier_override as number | null) ?? null,
      multiplier_override: before.multiplier_override as any,
      min_price_usd: before.min_price_usd as any,
      max_price_usd: before.max_price_usd as any,
      is_excluded: (before.is_excluded as boolean) ?? false,
      is_active: (before.is_active as boolean) ?? true,
      label: (before.label as string | null) ?? null,
      starts_at: before.starts_at ? new Date(before.starts_at as string) : null,
      ends_at: before.ends_at ? new Date(before.ends_at as string) : null,
    },
  });

  await invalidateCachedPlansForOverride(id);

  await logPricingChange({
    overrideId: id,
    action: "ROLLBACK",
    before: existing,
    after: rolledBack,
    changedBy: admin.userId,
    notes: `Rolled back to state from audit log entry ${targetEntry.id}`,
  });

  return NextResponse.json({ override: rolledBack });
}
