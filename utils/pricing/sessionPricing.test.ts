import { describe, it, expect } from "vitest";
import {
  calculateCyclePriceUSD,
  calculateCyclePriceUSDForTier,
  getLifetimePriceUSD,
  getLifetimePriceUSDForTier,
  calculateCyclePriceForCountry,
  getLifetimePriceForCountry,
} from "./sessionPricing";

describe("calculateCyclePriceUSD", () => {
  it("computes the Monthly (no discount) price", () => {
    const result = calculateCyclePriceUSD(3, 1, "ONLINE");
    expect(result).toEqual({ totalSessions: 12, originalAmount: 144, discountedAmount: 144 });
  });

  it("applies the Annual 30% cycle discount", () => {
    const result = calculateCyclePriceUSD(3, 12, "ONLINE");
    expect(result.totalSessions).toBe(144);
    expect(result.originalAmount).toBe(1728);
    expect(result.discountedAmount).toBe(1210); // round(1728 * 0.7) = round(1209.6)
  });

  it("uses the Self-Paced rate, half the Trainer-Led rate", () => {
    const result = calculateCyclePriceUSD(3, 1, "SELF_PACED");
    expect(result.originalAmount).toBe(72);
  });
});

describe("getLifetimePriceUSD", () => {
  it("returns the fixed price point for defined sessions/week", () => {
    expect(getLifetimePriceUSD(3, "ONLINE")).toBe(3599);
    expect(getLifetimePriceUSD(5, "SELF_PACED")).toBe(2999);
  });

  it("returns undefined for a sessions/week not in the fixed table", () => {
    expect(getLifetimePriceUSD(6, "ONLINE")).toBeUndefined();
  });
});

describe("tier-adjusted USD pricing", () => {
  it("leaves the price unchanged at multiplier 1 (Standard tier)", () => {
    const result = calculateCyclePriceUSDForTier(3, 1, "ONLINE", 1.0);
    // roundToNiceUsd(144) = round(14.4)*10-1 = 139
    expect(result.discountedAmount).toBe(139);
  });

  it("scales down for a lower (Emerging) tier multiplier", () => {
    const result = calculateCyclePriceUSDForTier(3, 1, "ONLINE", 0.3);
    // roundToNiceUsd(144*0.3=43.2) = round(4.32)*10-1 = 39
    expect(result.discountedAmount).toBe(39);
  });

  it("scales the Lifetime price by the same tier multiplier", () => {
    expect(getLifetimePriceUSDForTier(3, "ONLINE", 1.0)).toBe(3599);
    // roundToNiceUsd(3599*1.15=4138.85) — amount >= 1000, so the ...99 rule
    // applies: round(41.3885)*100-1 = 4099
    expect(getLifetimePriceUSDForTier(3, "ONLINE", 1.15)).toBe(4099);
  });

  it("returns undefined when the underlying Lifetime price is undefined", () => {
    expect(getLifetimePriceUSDForTier(6, "ONLINE", 1.0)).toBeUndefined();
  });
});

describe("country-aware pricing (full PPP tier -> currency chain)", () => {
  it("computes an India (Tier 4, INR) cycle price end to end", () => {
    const result = calculateCyclePriceForCountry(3, 1, "ONLINE", "IN");
    expect(result.currency).toBe("INR");
    expect(result.totalSessions).toBe(12);
    expect(result.originalAmount).toBe(11952); // round(144 * 83)
    // roundNicely(69 * 83 = 5727) — amount >= 1000, so the ...99 rule
    // applies: round(57.27)*100-1 = 5699
    expect(result.discountedAmount).toBe(5699);
  });

  it("computes a USD-settled country (US) cycle price with no currency conversion", () => {
    const result = calculateCyclePriceForCountry(3, 1, "ONLINE", "US");
    expect(result.currency).toBe("USD");
    expect(result.discountedAmount).toBe(139); // same as multiplier-1 case above
  });

  it("applies a segment multiplier on top of the country tier", () => {
    const withoutSegment = calculateCyclePriceForCountry(3, 1, "ONLINE", "US");
    const withStudent = calculateCyclePriceForCountry(3, 1, "ONLINE", "US", null, "STUDENT");
    expect(withStudent.discountedAmount).toBeLessThan(withoutSegment.discountedAmount);
  });

  it("computes a Lifetime price for a Tier 1 (Premium, AED) country", () => {
    const result = getLifetimePriceForCountry(3, "ONLINE", "AE");
    // usdAmount = 4099 (see "scales the Lifetime price" above), converted
    // to AED (×3.6725 = 15053.58) and re-rounded: round(150.5358)*100-1 = 15099
    expect(result).toEqual({ amount: 15099, currency: "AED" });
  });

  it("returns undefined for an unsupported sessions/week combination", () => {
    expect(getLifetimePriceForCountry(6, "ONLINE", "US")).toBeUndefined();
  });
});
