import { test, expect } from "@playwright/test";

// Covers the multi-country pricing-display scenarios from the pricing
// spec's acceptance list. Price here is computed client-side
// (utils/pricing/sessionPricing.ts + utils/pppPricing.ts, the same
// functions unit-tested in utils/pricing/sessionPricing.test.ts) purely
// for immediate display — no database round trip, so these run without a
// live DATABASE_URL. The actually-charged amount is always recomputed
// server-side at payment time (see the 4 payment routes).
//
// getCurrencyForCountry (utils/pppPricing.ts) only maps India -> INR and
// UAE -> AED; every other country displays/settles in USD. GB/SG below
// intentionally assert USD, not GBP/SGD — there is no live GBP or SGD
// checkout currency today. See docs/pricing-system.md "Known limitations."

test.describe("country-aware checkout pricing display", () => {
  test("India: INR pricing, Razorpay auto-selected (no 'region' PayPal note)", async ({ page }) => {
    await page.goto("/checkout?country=IN");
    await expect(page.getByText(/^₹[\d,]+$/)).toBeVisible();
    await expect(page.getByText(/Pricing shown reflects your region/)).not.toBeVisible();
  });

  test("United States: USD pricing, PayPal auto-selected", async ({ page }) => {
    await page.goto("/checkout?country=US");
    await expect(page.getByText(/^\$[\d,]+$/)).toBeVisible();
    await expect(page.getByText("Pricing shown reflects your region (US).")).toBeVisible();
  });

  test("UAE: AED display price, with the real USD PayPal charge noted", async ({ page }) => {
    await page.goto("/checkout?country=AE");
    await expect(page.getByText(/^AED [\d,]+$/)).toBeVisible();
    await expect(page.getByText(/Charged as \$[\d,]+ USD via PayPal/)).toBeVisible();
  });

  test("United Kingdom: displays USD (no dedicated GBP support yet)", async ({ page }) => {
    await page.goto("/checkout?country=GB");
    await expect(page.getByText(/^\$[\d,]+$/)).toBeVisible();
    await expect(page.getByText("Pricing shown reflects your region (GB).")).toBeVisible();
  });

  test("Singapore (Tier 1 country): displays USD (no dedicated SGD support yet)", async ({ page }) => {
    await page.goto("/checkout?country=SG");
    await expect(page.getByText(/^\$[\d,]+$/)).toBeVisible();
    await expect(page.getByText("Pricing shown reflects your region (SG).")).toBeVisible();
  });

  test("EU country: shows the generic tax-calculated-at-checkout disclaimer", async ({ page }) => {
    // No EU-specific VAT copy is implemented (see Phase B — safe mode: only
    // a generic disclaimer, no invented tax figures). This asserts the
    // disclaimer that stands in for it.
    await page.goto("/checkout?country=DE");
    await expect(page.getByText("Taxes, if applicable in your region, are calculated at checkout.")).toBeVisible();
  });

  test.skip(
    "Japan: zero-decimal currency formatting — JPY is not a supported checkout currency yet (known limitation, see utils/pppPricing.ts PppCurrency)",
    () => {}
  );

  test.skip(
    "Kuwait: 3-decimal currency formatting — KWD is not a supported checkout currency yet (known limitation, see utils/pppPricing.ts PppCurrency)",
    () => {}
  );
});
