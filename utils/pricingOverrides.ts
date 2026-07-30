// Server-only. Resolves admin-controlled pricing overrides (see
// prisma schema `pricing_overrides`) on top of the static PPP tier system
// in utils/pppPricing.ts. Every real charge (Razorpay + PayPal, recurring
// + Lifetime) goes through getEffectivePricing()/isCountryExcluded()
// instead of calling getPppMultiplier() directly, so an admin override
// actually changes what customers pay — not just what the admin UI shows.
//
// Static-table pricing (used for marketing-page display) is intentionally
// NOT override-aware — those pages already carry a "not a live/final
// price" disclaimer, and re-fetching overrides on every render would add
// a network round-trip for a number that's only ever provisional until
// checkout recomputes it authoritatively.

import prisma from "@/utils/prisma/prismaClient";
import {
  getPppMultiplier,
  getSegmentMultiplier,
  getPppTier,
  TIER_MULTIPLIERS,
  normalizeCity,
  PppTier,
} from "@/utils/pppPricing";

interface ActiveOverride {
  id: string;
  scope_country: string | null;
  scope_city: string | null;
  scope_segment: string | null;
  tier_override: number | null;
  multiplier_override: unknown; // Prisma Decimal
  min_price_usd: unknown;
  max_price_usd: unknown;
  is_excluded: boolean;
}

async function findCandidateOverrides(countryCode: string | null, city: string | null, segment: string | null) {
  const country = countryCode?.toUpperCase() ?? null;
  const normalizedCity = city ? normalizeCity(city) : null;
  const now = new Date();

  return prisma.pricing_overrides.findMany({
    where: {
      is_active: true,
      AND: [
        { OR: [{ starts_at: null }, { starts_at: { lte: now } }] },
        { OR: [{ ends_at: null }, { ends_at: { gte: now } }] },
        { OR: [{ scope_country: null }, { scope_country: country ?? undefined }] },
        { OR: [{ scope_city: null }, { scope_city: normalizedCity ?? undefined }] },
        { OR: [{ scope_segment: null }, { scope_segment: segment ?? undefined }] },
      ],
    },
  });
}

function specificity(o: ActiveOverride): number {
  return (o.scope_country ? 1 : 0) + (o.scope_city ? 2 : 0) + (o.scope_segment ? 1 : 0);
}

// Most-specific-first: city+segment > city > country+segment > country >
// global. Ties (shouldn't normally happen — two active overrides at the
// exact same scope) are broken by whichever was updated most recently.
async function findBestOverride(
  countryCode: string | null,
  city: string | null,
  segment: string | null
): Promise<ActiveOverride | null> {
  const candidates = await findCandidateOverrides(countryCode, city, segment);
  if (candidates.length === 0) return null;

  return candidates.reduce((best, current) =>
    specificity(current) > specificity(best) ||
    (specificity(current) === specificity(best) && current.updated_at > best.updated_at)
      ? current
      : best
  );
}

export async function isCountryExcluded(countryCode: string | null): Promise<boolean> {
  const override = await findBestOverride(countryCode, null, null);
  return !!override?.is_excluded;
}

export interface EffectivePricing {
  multiplier: number;
  tier: PppTier;
  overrideId: string | null;
  minUsd: number | null;
  maxUsd: number | null;
}

// Resolves the multiplier a real charge should use — override first
// (multiplier_override takes precedence over tier_override, which takes
// precedence over the static tier), falling back to the same static
// country/city tier * segment multiplier used everywhere else.
export async function getEffectivePricing(
  countryCode: string | null,
  city: string | null,
  segment: string | null
): Promise<EffectivePricing> {
  const staticTier = getPppTier(countryCode, city);
  const staticMultiplier = getPppMultiplier(countryCode, city) * getSegmentMultiplier(segment);

  const override = await findBestOverride(countryCode, city, segment);
  if (!override) {
    return { multiplier: staticMultiplier, tier: staticTier, overrideId: null, minUsd: null, maxUsd: null };
  }

  let multiplier = staticMultiplier;
  let tier = staticTier;

  if (override.multiplier_override !== null && override.multiplier_override !== undefined) {
    multiplier = Number(override.multiplier_override);
  } else if (override.tier_override !== null && override.tier_override !== undefined) {
    tier = override.tier_override as PppTier;
    multiplier = TIER_MULTIPLIERS[tier] * getSegmentMultiplier(segment);
  }

  return {
    multiplier,
    tier,
    overrideId: override.id,
    minUsd: override.min_price_usd !== null && override.min_price_usd !== undefined ? Number(override.min_price_usd) : null,
    maxUsd: override.max_price_usd !== null && override.max_price_usd !== undefined ? Number(override.max_price_usd) : null,
  };
}

export function clampUsd(amount: number, pricing: EffectivePricing): number {
  let clamped = amount;
  if (pricing.minUsd !== null) clamped = Math.max(clamped, pricing.minUsd);
  if (pricing.maxUsd !== null) clamped = Math.min(clamped, pricing.maxUsd);
  return clamped;
}

// subscription_plans rows are found-or-created keyed partly on
// pricing_override_id (see app/api/subscriptions/ensure-plan/route.ts and
// its PayPal/Lifetime counterparts) and are never mutated in place once
// created — Razorpay/PayPal Plan objects are immutable once created too, so
// existing subscribers always keep their contracted price regardless of
// what happens here. But an admin PATCHing/rolling-back an override *in
// place* (same id, different multiplier/tier/min/max) doesn't change that
// id, so the old cached plan row would otherwise keep matching and serving
// its stale pre-edit price to brand-new customers as well. Deactivating
// those cached rows forces the next request for that combo to recompute
// and create a fresh plan at the corrected price — existing subscriptions
// are untouched since they reference the row by id, not by is_active.
export async function invalidateCachedPlansForOverride(overrideId: string): Promise<void> {
  await prisma.subscription_plans.updateMany({
    where: { pricing_override_id: overrideId, is_active: true },
    data: { is_active: false },
  });
}

// Records every pricing_overrides change to pricing_audit_log — called by
// every admin write (create/update/delete/rollback) so overrides stay
// fully auditable and reversible.
export async function logPricingChange(params: {
  overrideId: string | null;
  action: "CREATE" | "UPDATE" | "DELETE" | "ROLLBACK";
  before: unknown;
  after: unknown;
  changedBy: string | null;
  notes?: string;
}) {
  await prisma.pricing_audit_log.create({
    data: {
      override_id: params.overrideId,
      action: params.action,
      before: params.before === null || params.before === undefined ? undefined : (params.before as object),
      after: params.after === null || params.after === undefined ? undefined : (params.after as object),
      changed_by: params.changedBy,
      notes: params.notes,
    },
  });
}
