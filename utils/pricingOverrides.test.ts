import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    pricing_overrides: { findMany: vi.fn() },
    subscription_plans: { updateMany: vi.fn() },
    pricing_audit_log: { create: vi.fn() },
  },
}));

vi.mock("@/utils/prisma/prismaClient", () => ({ default: mockPrisma }));

const { getEffectivePricing, clampUsd, isCountryExcluded, invalidateCachedPlansForOverride, logPricingChange } =
  await import("./pricingOverrides");

function override(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: "override-1",
    scope_country: null,
    scope_city: null,
    scope_segment: null,
    tier_override: null,
    multiplier_override: null,
    min_price_usd: null,
    max_price_usd: null,
    is_excluded: false,
    updated_at: new Date("2026-01-01"),
    ...overrides,
  };
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe("getEffectivePricing", () => {
  it("falls back to the static tier/multiplier when no override matches", async () => {
    mockPrisma.pricing_overrides.findMany.mockResolvedValue([]);
    const result = await getEffectivePricing("IN", null, null);
    expect(result).toEqual({ multiplier: 0.5, tier: 4, overrideId: null, minUsd: null, maxUsd: null });
  });

  it("applies a multiplier_override, leaving the reported tier at the static value", async () => {
    mockPrisma.pricing_overrides.findMany.mockResolvedValue([override({ scope_country: "IN", multiplier_override: 0.9 })]);
    const result = await getEffectivePricing("IN", null, null);
    expect(result.multiplier).toBe(0.9);
    expect(result.tier).toBe(4); // static IN tier, unchanged by a multiplier override
    expect(result.overrideId).toBe("override-1");
  });

  it("applies a tier_override, recomputing the multiplier from the new tier", async () => {
    mockPrisma.pricing_overrides.findMany.mockResolvedValue([override({ scope_country: "IN", tier_override: 2 })]);
    const result = await getEffectivePricing("IN", null, null);
    expect(result.tier).toBe(2);
    expect(result.multiplier).toBeCloseTo(1.0);
  });

  it("carries min/max price floors/ceilings through from the override", async () => {
    mockPrisma.pricing_overrides.findMany.mockResolvedValue([
      override({ scope_country: "US", min_price_usd: 10, max_price_usd: 500 }),
    ]);
    const result = await getEffectivePricing("US", null, null);
    expect(result.minUsd).toBe(10);
    expect(result.maxUsd).toBe(500);
  });

  it("prefers the most specific override when several candidates match", async () => {
    mockPrisma.pricing_overrides.findMany.mockResolvedValue([
      override({ id: "country-only", scope_country: "US", multiplier_override: 0.5, updated_at: new Date("2026-01-01") }),
      override({ id: "country-and-city", scope_country: "US", scope_city: "new york", multiplier_override: 0.7, updated_at: new Date("2026-01-01") }),
    ]);
    const result = await getEffectivePricing("US", "New York", null);
    expect(result.overrideId).toBe("country-and-city");
    expect(result.multiplier).toBe(0.7);
  });
});

describe("clampUsd", () => {
  it("passes an amount through when no floor/ceiling is set", () => {
    expect(clampUsd(42, { multiplier: 1, tier: 2, overrideId: null, minUsd: null, maxUsd: null })).toBe(42);
  });

  it("raises an amount below the floor", () => {
    expect(clampUsd(5, { multiplier: 1, tier: 2, overrideId: "x", minUsd: 10, maxUsd: null })).toBe(10);
  });

  it("caps an amount above the ceiling", () => {
    expect(clampUsd(1000, { multiplier: 1, tier: 2, overrideId: "x", minUsd: null, maxUsd: 500 })).toBe(500);
  });
});

describe("isCountryExcluded", () => {
  it("is false when no override matches", async () => {
    mockPrisma.pricing_overrides.findMany.mockResolvedValue([]);
    expect(await isCountryExcluded("US")).toBe(false);
  });

  it("is true when the matching override is marked excluded", async () => {
    mockPrisma.pricing_overrides.findMany.mockResolvedValue([override({ scope_country: "KP", is_excluded: true })]);
    expect(await isCountryExcluded("KP")).toBe(true);
  });
});

describe("invalidateCachedPlansForOverride", () => {
  it("deactivates only the active subscription_plans rows cached under that override", async () => {
    await invalidateCachedPlansForOverride("override-1");
    expect(mockPrisma.subscription_plans.updateMany).toHaveBeenCalledWith({
      where: { pricing_override_id: "override-1", is_active: true },
      data: { is_active: false },
    });
  });
});

describe("logPricingChange", () => {
  it("writes an audit log row, omitting null before/after", async () => {
    await logPricingChange({ overrideId: "override-1", action: "CREATE", before: null, after: { a: 1 }, changedBy: "admin-1" });
    expect(mockPrisma.pricing_audit_log.create).toHaveBeenCalledWith({
      data: {
        override_id: "override-1",
        action: "CREATE",
        before: undefined,
        after: { a: 1 },
        changed_by: "admin-1",
        notes: undefined,
      },
    });
  });
});
