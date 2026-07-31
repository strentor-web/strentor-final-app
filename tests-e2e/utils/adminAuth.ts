import type { Page } from "@playwright/test";
import { testAdminCredentials } from "./environment";

// Signs in through the real /sign-in form using TEST_ADMIN_EMAIL/PASSWORD
// (a seeded ADMIN-role account on whatever environment the suite is
// pointed at). Only called from specs already gated by
// `testAdminCredentials` being present.
export async function signInAsAdmin(page: Page): Promise<void> {
  if (!testAdminCredentials) {
    throw new Error("signInAsAdmin called without TEST_ADMIN_EMAIL/TEST_ADMIN_PASSWORD set");
  }
  await page.goto("/sign-in");
  await page.locator("#email").fill(testAdminCredentials.email);
  await page.locator("#password").fill(testAdminCredentials.password);
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/sign-in"), { timeout: 15_000 });
}
