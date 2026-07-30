import { describe, it, expect } from "vitest";
import { payloadSchema } from "./overridePayload";

describe("pricing override payload validation (shared by the manual form and CSV import)", () => {
  it("accepts a minimal global override", () => {
    expect(payloadSchema.safeParse({}).success).toBe(true);
  });

  it("accepts a fully-specified override", () => {
    const result = payloadSchema.safeParse({
      scopeCountry: "in",
      scopeCity: "Mumbai",
      scopeSegment: "STUDENT",
      tierOverride: 3,
      minPriceUsd: 5,
      maxPriceUsd: 50,
      label: "Test",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.scopeCountry).toBe("IN"); // uppercased
    }
  });

  it("rejects a city-scoped override with no country", () => {
    const result = payloadSchema.safeParse({ scopeCity: "Mumbai" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["scopeCity"]);
    }
  });

  it("rejects minPriceUsd greater than maxPriceUsd", () => {
    const result = payloadSchema.safeParse({ minPriceUsd: 100, maxPriceUsd: 10 });
    expect(result.success).toBe(false);
  });

  it("rejects an out-of-range tier", () => {
    expect(payloadSchema.safeParse({ tierOverride: 6 }).success).toBe(false);
    expect(payloadSchema.safeParse({ tierOverride: 0 }).success).toBe(false);
  });

  it("rejects an unknown customer segment", () => {
    expect(payloadSchema.safeParse({ scopeSegment: "NOT_REAL" }).success).toBe(false);
  });
});
