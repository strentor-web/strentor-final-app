// Shared gating helpers so specs that genuinely need infrastructure this
// sandbox doesn't have (a real DIRECT Postgres connection for Prisma, or a
// seeded admin test account) skip with a clear reason instead of failing
// noisily or — worse — being quietly wrong. Real CI/staging runs with
// these configured will exercise the full scenario; see
// docs/pricing-system.md.

// Prisma needs a real DIRECT_URL (a direct Postgres connection — Supabase's
// PostgREST/Auth HTTPS API, which NEXT_PUBLIC_SUPABASE_URL points at, is a
// separate path and works fine without this). Treat the dummy placeholder
// used by playwright.config.ts's webServer fallback as "not live."
export const hasLiveDatabase = Boolean(
  process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("user:pass@localhost")
);

export const testAdminCredentials =
  process.env.TEST_ADMIN_EMAIL && process.env.TEST_ADMIN_PASSWORD
    ? { email: process.env.TEST_ADMIN_EMAIL, password: process.env.TEST_ADMIN_PASSWORD }
    : null;
