import { test, expect } from "@playwright/test";

// "Country change before checkout" scenario: a visitor explicitly changes
// their billing country via the visible selector (Phase C), and the price
// + payment provider recompute immediately, with the choice persisted so a
// reload doesn't silently revert it.

test("changing the billing country updates currency, provider note, and persists across reload", async ({ page }) => {
  await page.goto("/checkout"); // no ?country= — starts from browser-locale best-effort detection

  // The country dropdown trigger shows either the placeholder or whatever
  // country was already best-effort detected — open it and search
  // explicitly rather than asserting its initial label.
  await page.getByText("Billing country").waitFor();
  const countryButton = page
    .locator("label", { hasText: "Billing country" })
    .locator("xpath=following-sibling::div[1]//button")
    .first();
  await countryButton.click();

  await page.getByPlaceholder("Search country...").fill("United States");
  // The option's accessible name is prefixed with the flag's alt text (e.g.
  // "us United States"), so match on visible text content instead — anchored
  // to avoid also matching "United States Minor Outlying Islands".
  await page.getByRole("option").filter({ hasText: /^United States$/ }).click();

  await expect(page.getByText(/^\$[\d,]+$/)).toBeVisible();
  await expect(page.getByText("Pricing shown reflects your region (US).")).toBeVisible();

  // useLocalStorage (hooks/useLocalStorage.ts) JSON-serializes values.
  const stored = await page.evaluate(() => localStorage.getItem("strentor_country"));
  expect(stored).toBe(JSON.stringify("US"));

  await page.reload();
  await expect(page.getByText("Pricing shown reflects your region (US).")).toBeVisible();

  // Switching to India should flip the provider back to Razorpay (INR,
  // no "region" PayPal note) since the toggle hasn't been manually touched.
  await countryButton.click();
  await page.getByPlaceholder("Search country...").fill("India");
  await page.getByRole("option").filter({ hasText: /^India$/ }).click();

  await expect(page.getByText(/^₹[\d,]+$/)).toBeVisible();
  await expect(page.getByText(/Pricing shown reflects your region/)).not.toBeVisible();
});
