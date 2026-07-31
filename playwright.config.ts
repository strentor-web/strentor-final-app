import { defineConfig, devices } from "@playwright/test";
import path from "path";

// Sandbox-only fallbacks — mirrors the dummy DATABASE_URL/DIRECT_URL used
// elsewhere in this repo's build/typecheck steps when no live database is
// configured (see docs/pricing-system.md "Known limitations"). A real CI
// or staging run should already have these set, in which case these
// defaults are never used. NEXT_PUBLIC_SUPABASE_URL/ANON_KEY are expected
// to already point at a real Supabase project (auth + PostgREST run over
// HTTPS, independent of the direct-Postgres DATABASE_URL Prisma needs) —
// that's what lets the DB-independent specs in this suite (auth gating,
// promo-code auth check) run for real even without a live DATABASE_URL.
const DUMMY_DB_URL = "postgresql://user:pass@localhost:5432/db";
const PORT = process.env.PLAYWRIGHT_PORT ?? "3100";

export default defineConfig({
  testDir: "./tests-e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Pre-installed Chromium in this environment — see CLAUDE session
        // notes / repo README for why `playwright install` should not be
        // run (PLAYWRIGHT_BROWSERS_PATH is already set and populated).
        launchOptions: {
          executablePath:
            process.env.PLAYWRIGHT_CHROMIUM_PATH ??
            path.join("/opt/pw-browsers/chromium-1194/chrome-linux/chrome"),
        },
      },
    },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: `npm run dev -- -p ${PORT}`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
        env: {
          DATABASE_URL: process.env.DATABASE_URL ?? DUMMY_DB_URL,
          DIRECT_URL: process.env.DIRECT_URL ?? DUMMY_DB_URL,
        },
      },
});
