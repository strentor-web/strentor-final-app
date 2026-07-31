import { test, expect } from "@playwright/test";
import { hasLiveDatabase, testAdminCredentials } from "./utils/environment";
import { signInAsAdmin } from "./utils/adminAuth";

test.describe("admin schedules a future price change", () => {
  test.skip(
    !hasLiveDatabase || !testAdminCredentials,
    "Requires a live DATABASE_URL and a seeded ADMIN account " +
      "(TEST_ADMIN_EMAIL/TEST_ADMIN_PASSWORD) — not available in this sandbox. " +
      "Run against a real dev/staging environment to exercise this scenario."
  );

  test("an override with a future starts_at shows a Scheduled badge in the admin console", async ({ page }) => {
    await signInAsAdmin(page);

    const label = `E2E scheduled test ${Date.now()}`;
    const startsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days out

    const createResponse = await page.request.post("/api/admin/pricing/overrides", {
      data: {
        scopeCountry: "US",
        multiplierOverride: 0.95,
        label,
        startsAt,
      },
    });
    expect(createResponse.ok()).toBeTruthy();

    await page.goto("/admin/pricing");
    const row = page.locator("tr", { hasText: label });
    await expect(row).toBeVisible();
    await expect(row.getByText("Scheduled")).toBeVisible();
  });
});
