import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    promo_codes: { findUnique: vi.fn() },
    promo_code_redemptions: { count: vi.fn(), create: vi.fn() },
  },
}));

vi.mock("@/utils/prisma/prismaClient", () => ({ default: mockPrisma }));

const { validatePromoCode, recordPromoRedemption } = await import("./promoCodes");

function basePromo(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: "promo-1",
    code: "SAVE20",
    type: "PERCENTAGE",
    value: 20,
    scope_country: null,
    scope_product: null,
    starts_at: null,
    ends_at: null,
    redemption_limit: null,
    per_customer_limit: 1,
    is_active: true,
    ...overrides,
  };
}

beforeEach(() => {
  vi.resetAllMocks();
  mockPrisma.promo_code_redemptions.count.mockResolvedValue(0);
});

describe("validatePromoCode", () => {
  it("rejects an empty code without hitting the database", async () => {
    const result = await validatePromoCode({ code: "  ", countryCode: "US", product: "recurring", amountUsd: 100, email: "a@b.com" });
    expect(result).toEqual({ valid: false, error: "Enter a promo code" });
    expect(mockPrisma.promo_codes.findUnique).not.toHaveBeenCalled();
  });

  it("rejects an unknown code", async () => {
    mockPrisma.promo_codes.findUnique.mockResolvedValue(null);
    const result = await validatePromoCode({ code: "NOPE", countryCode: "US", product: "recurring", amountUsd: 100, email: "a@b.com" });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Invalid promo code");
  });

  it("rejects a deactivated code", async () => {
    mockPrisma.promo_codes.findUnique.mockResolvedValue(basePromo({ is_active: false }));
    const result = await validatePromoCode({ code: "SAVE20", countryCode: "US", product: "recurring", amountUsd: 100, email: "a@b.com" });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Invalid promo code");
  });

  it("rejects a not-yet-started code", async () => {
    mockPrisma.promo_codes.findUnique.mockResolvedValue(basePromo({ starts_at: new Date(Date.now() + 86400000) }));
    const result = await validatePromoCode({ code: "SAVE20", countryCode: "US", product: "recurring", amountUsd: 100, email: "a@b.com" });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("This promo code isn't active yet");
  });

  it("rejects an expired code", async () => {
    mockPrisma.promo_codes.findUnique.mockResolvedValue(basePromo({ ends_at: new Date(Date.now() - 86400000) }));
    const result = await validatePromoCode({ code: "SAVE20", countryCode: "US", product: "recurring", amountUsd: 100, email: "a@b.com" });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("This promo code has expired");
  });

  it("rejects a country-scoped code used from the wrong country", async () => {
    mockPrisma.promo_codes.findUnique.mockResolvedValue(basePromo({ scope_country: "IN" }));
    const result = await validatePromoCode({ code: "SAVE20", countryCode: "US", product: "recurring", amountUsd: 100, email: "a@b.com" });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("This promo code isn't valid in your region");
  });

  it("rejects a product-scoped code used on the wrong product", async () => {
    mockPrisma.promo_codes.findUnique.mockResolvedValue(basePromo({ scope_product: "lifetime" }));
    const result = await validatePromoCode({ code: "SAVE20", countryCode: "US", product: "recurring", amountUsd: 100, email: "a@b.com" });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("This promo code doesn't apply to this product");
  });

  it("rejects a code that has hit its global redemption limit", async () => {
    mockPrisma.promo_codes.findUnique.mockResolvedValue(basePromo({ redemption_limit: 5 }));
    mockPrisma.promo_code_redemptions.count.mockResolvedValueOnce(5);
    const result = await validatePromoCode({ code: "SAVE20", countryCode: "US", product: "recurring", amountUsd: 100, email: "a@b.com" });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("This promo code has reached its redemption limit");
  });

  it("rejects a customer who has already used the code up to their per-customer limit", async () => {
    // redemption_limit is null on basePromo(), so the only count() call
    // validatePromoCode makes here is the per-customer check.
    mockPrisma.promo_codes.findUnique.mockResolvedValue(basePromo());
    mockPrisma.promo_code_redemptions.count.mockResolvedValueOnce(1);
    const result = await validatePromoCode({ code: "SAVE20", countryCode: "US", product: "recurring", amountUsd: 100, email: "a@b.com" });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("You've already used this promo code");
  });

  it("computes a percentage discount", async () => {
    mockPrisma.promo_codes.findUnique.mockResolvedValue(basePromo({ type: "PERCENTAGE", value: 20 }));
    const result = await validatePromoCode({ code: "SAVE20", countryCode: "US", product: "recurring", amountUsd: 100, email: "a@b.com" });
    expect(result).toMatchObject({ valid: true, promoCodeId: "promo-1", discountAmountUsd: 20, discountedAmountUsd: 80 });
  });

  it("clamps a fixed-amount discount so it never exceeds the base price", async () => {
    mockPrisma.promo_codes.findUnique.mockResolvedValue(basePromo({ type: "FIXED_AMOUNT", value: 500 }));
    const result = await validatePromoCode({ code: "SAVE20", countryCode: "US", product: "recurring", amountUsd: 100, email: "a@b.com" });
    expect(result).toMatchObject({ valid: true, discountAmountUsd: 100, discountedAmountUsd: 0 });
  });
});

describe("recordPromoRedemption", () => {
  it("lowercases the email and writes a redemption row", async () => {
    await recordPromoRedemption({
      promoCodeId: "promo-1",
      userId: "user-1",
      email: "A@Example.COM",
      orderReference: "order-1",
      amountDiscounted: 20,
    });
    expect(mockPrisma.promo_code_redemptions.create).toHaveBeenCalledWith({
      data: {
        promo_code_id: "promo-1",
        user_id: "user-1",
        email: "a@example.com",
        order_reference: "order-1",
        amount_discounted: 20,
      },
    });
  });
});
