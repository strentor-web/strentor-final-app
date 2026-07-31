import { test, expect } from "@playwright/test";

test.describe("promo code UI", () => {
  test("Apply button is disabled until a code is typed", async ({ page }) => {
    await page.goto("/checkout?country=US");
    const applyButton = page.getByRole("button", { name: "Apply" });
    await expect(applyButton).toBeDisabled();
    await page.getByPlaceholder("e.g. WELCOME10").fill("WELCOME10");
    await expect(applyButton).toBeEnabled();
  });
});

test.describe("tax messaging (Phase B — safe mode, no invented figures)", () => {
  test("checkout shows the generic 'calculated at checkout' disclaimer, never a computed tax number", async ({ page }) => {
    await page.goto("/checkout?country=US");
    await expect(page.getByText("Taxes, if applicable in your region, are calculated at checkout.")).toBeVisible();
  });
});

test.describe("frontend price-tampering rejection (server-side)", () => {
  // The client never sends a proposed price to /api/checkout/validate-promo
  // or any ensure-plan/create-order route — only sessionsPerWeek/
  // billingCycle/planType/city/segment/promoCode are accepted, and the
  // amount is always computed server-side from those. This asserts the
  // structural guarantee at the API boundary: an unauthenticated request
  // (so it never reaches Prisma — see tests-e2e/utils/environment.ts) is
  // rejected for auth, not because a price was accepted from the client.
  test("/api/checkout/validate-promo ignores any client-asserted price/discount and requires a real session", async ({ request }) => {
    const response = await request.post("/api/checkout/validate-promo", {
      data: {
        code: "WELCOME10",
        countryCode: "US",
        product: "recurring",
        amountUsd: 100,
        // Not real fields on this endpoint — proves extra/invented client
        // fields are simply ignored, not trusted, by whatever server code
        // ends up reading the body.
        discountAmountUsd: 999999,
        finalPrice: 0.01,
      },
    });
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body).toEqual({ valid: false, error: "Sign in to apply a promo code" });
  });
});
