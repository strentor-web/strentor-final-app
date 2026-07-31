import { test, expect } from "@playwright/test";

// Every admin pricing/payments/corporate page must be unreachable without a
// session — checked here for the pages this pricing-system pass added.
// This exercises the real Supabase Auth check (NEXT_PUBLIC_SUPABASE_URL,
// over HTTPS) rather than Prisma, so it runs without a live DATABASE_URL.
const PROTECTED_PATHS = ["/admin/pricing", "/admin/payments/refunds", "/admin/corporate"];

for (const path of PROTECTED_PATHS) {
  test(`unauthenticated visit to ${path} redirects to sign-in`, async ({ page }) => {
    await page.goto(path);
    await expect(page).toHaveURL(/\/sign-in/);
  });
}
