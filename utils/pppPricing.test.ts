import { describe, it, expect } from "vitest";
import {
  getPppTier,
  getPppMultiplier,
  getSegmentMultiplier,
  isSponsoredSegment,
  isKnownSegment,
  getCurrencyForCountry,
  roundNicely,
  convertFromUsd,
  usdToAed,
  normalizeCity,
  isKnownCountryCode,
} from "./pppPricing";

describe("getPppTier", () => {
  it("resolves known country tiers", () => {
    expect(getPppTier("CH")).toBe(1);
    expect(getPppTier("US")).toBe(2);
    expect(getPppTier("IN")).toBe(4);
    expect(getPppTier("PK")).toBe(5);
  });

  it("falls back to the default (standard) tier for unknown countries", () => {
    expect(getPppTier("ZZ")).toBe(2);
    expect(getPppTier(null)).toBe(2);
    expect(getPppTier(undefined)).toBe(2);
  });

  it("is case-insensitive on country code", () => {
    expect(getPppTier("in")).toBe(4);
  });

  it("applies a city override on top of the country tier", () => {
    expect(getPppTier("US", "New York")).toBe(1);
    expect(getPppTier("IN", "Mumbai")).toBe(3);
  });

  it("normalizes city spacing/case before matching an override", () => {
    expect(getPppTier("US", "  new    YORK  ")).toBe(1);
  });

  it("falls back to the country tier for an unlisted city", () => {
    expect(getPppTier("IN", "Some Random Town")).toBe(4);
  });
});

describe("getPppMultiplier", () => {
  it("matches TIER_MULTIPLIERS for each band", () => {
    expect(getPppMultiplier("CH")).toBeCloseTo(1.15);
    expect(getPppMultiplier("US")).toBeCloseTo(1.0);
    expect(getPppMultiplier("IN")).toBeCloseTo(0.5);
    expect(getPppMultiplier("PK")).toBeCloseTo(0.3);
  });
});

describe("segment multipliers", () => {
  it("applies known segment multipliers", () => {
    expect(getSegmentMultiplier("STUDENT")).toBeCloseTo(0.85);
    expect(getSegmentMultiplier("EXECUTIVE")).toBeCloseTo(1.15);
    expect(getSegmentMultiplier("PARALYMPIAN")).toBeCloseTo(0.7);
  });

  it("returns 1 for null/unknown segments", () => {
    expect(getSegmentMultiplier(null)).toBe(1);
    expect(getSegmentMultiplier(undefined)).toBe(1);
    expect(getSegmentMultiplier("NOT_A_REAL_SEGMENT")).toBe(1);
  });

  it("flags the four sponsored segments and none of the self-serve ones", () => {
    expect(isSponsoredSegment("CORPORATE_SPONSORED")).toBe(true);
    expect(isSponsoredSegment("GOVERNMENT_SPONSORED")).toBe(true);
    expect(isSponsoredSegment("NGO_SPONSORED")).toBe(true);
    expect(isSponsoredSegment("INSURANCE_SPONSORED")).toBe(true);
    expect(isSponsoredSegment("INDIVIDUAL")).toBe(false);
    expect(isSponsoredSegment(null)).toBe(false);
  });

  it("recognizes known segments", () => {
    expect(isKnownSegment("STUDENT")).toBe(true);
    expect(isKnownSegment("NOT_A_SEGMENT")).toBe(false);
  });
});

describe("getCurrencyForCountry", () => {
  it("returns INR for India and AED for UAE", () => {
    expect(getCurrencyForCountry("IN")).toBe("INR");
    expect(getCurrencyForCountry("AE")).toBe("AED");
  });

  it("returns USD for every other country, including Singapore", () => {
    expect(getCurrencyForCountry("US")).toBe("USD");
    // SG deliberately does NOT map to SGD for real checkout — PayPal
    // actually settles Singapore customers in USD (see file comment).
    expect(getCurrencyForCountry("SG")).toBe("USD");
    expect(getCurrencyForCountry(null)).toBe("USD");
  });
});

describe("roundNicely", () => {
  it("rounds small amounts to the nearest whole number, minimum 1", () => {
    expect(roundNicely(5)).toBe(5);
    expect(roundNicely(0)).toBe(1);
    expect(roundNicely(49)).toBe(49);
  });

  it("rounds amounts under 1,000 to a single trailing 9", () => {
    expect(roundNicely(799)).toBe(799);
    expect(roundNicely(743)).toBe(739);
  });

  it("rounds amounts of 1,000+ to a ...99 ending, growing to ...999/...9999 near a round number", () => {
    expect(roundNicely(1799)).toBe(1799);
    expect(roundNicely(5727)).toBe(5699);
    expect(roundNicely(1134)).toBe(1099);
    expect(roundNicely(15054)).toBe(15099);
  });

  it("never collides two amounts under 1,000 apart at the 1,000+ tier", () => {
    // A ~15% segment discount (e.g. Student) on a four-figure price should
    // still read as a different, lower number after rounding.
    expect(roundNicely(2430)).not.toBe(roundNicely(2430 * 0.85));
  });
});

describe("currency conversion", () => {
  it("converts USD to another currency using the static FX table", () => {
    expect(convertFromUsd(100, "INR")).toBeCloseTo(8300);
    expect(convertFromUsd(100, "USD")).toBe(100);
  });

  it("converts USD to AED using the real hard-pegged rate", () => {
    expect(usdToAed(100)).toBe(367);
  });
});

describe("normalizeCity / isKnownCountryCode", () => {
  it("normalizes whitespace and case", () => {
    expect(normalizeCity("  New   York ")).toBe("new york");
  });

  it("distinguishes known vs unknown country codes", () => {
    expect(isKnownCountryCode("IN")).toBe(true);
    expect(isKnownCountryCode("ZZ")).toBe(false);
    expect(isKnownCountryCode(null)).toBe(false);
  });
});
