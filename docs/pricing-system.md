# Pricing system

STRENTOR's pricing is a single server-side-validated engine used by every checkout path (Razorpay + PayPal, recurring + one-time). This doc covers the architecture as it exists today, how to operate it, and what it deliberately does not do yet.

## 1. Architecture overview

Every price is derived from one canonical USD base, run through a chain of multipliers, and only ever computed authoritatively on the server:

```
RATE_PER_SESSION_USD / LIFETIME_PRICES_USD   (utils/pricing/sessionPricing.ts)
        × PPP tier multiplier                 (utils/pppPricing.ts — country, optionally refined by city)
        × customer segment multiplier         (utils/pppPricing.ts)
        × admin override (if any)             (utils/pricingOverrides.ts — replaces or scales the multiplier)
        − promo code discount (if any)        (utils/pricing/promoCodes.ts)
        → clamped to override min/max         (utils/pricingOverrides.clampUsd)
        → converted to display currency       (utils/pppPricing.getCurrencyForCountry / convertFromUsd)
```

The client computes the same chain for **immediate display** (so the price updates as you change country/sessions/billing cycle without a network round trip), but the client-computed number is never trusted — the 4 payment routes below independently recompute it server-side before creating any order/subscription, and price/discount fields are never accepted as input from the client.

### The 4 payment routes (the only places money amounts are computed)

| Route | Provider | Product |
|---|---|---|
| `app/api/subscriptions/ensure-plan/route.ts` | Razorpay | Recurring (Fitness) |
| `app/api/paypal/subscriptions/ensure-plan/route.ts` | PayPal | Recurring (Fitness) |
| `app/api/lifetime/create-order/route.ts` | Razorpay | Lifetime Membership |
| `app/api/paypal/lifetime/create-order/route.ts` | PayPal | Lifetime Membership |

Razorpay only ever serves India (settles in INR); PayPal serves every other country (settles in USD, even when the display currency is AED for the UAE).

### Product catalog (what's actually live)

This is a **session-count-based subscription** business, not a per-unit/per-session marketplace: Starter Kit, Flagship Transformation, Elite Mentorship, and Membership are the real offer ladder (`app/programs/*`), priced by sessions-per-week × billing cycle × training mode (Trainer-Led vs. Self-Paced). A from-scratch spec describing a different catalog (pay-per-session, pay-per-review, "Self-Paced Complete"/"1:1 Complete" packages) was deliberately **not** implemented — the methodology it asked for (tax-readiness, promo codes, country selector, provider abstraction, corporate billing, admin tooling, tests) was applied to the real catalog instead of replacing it.

### `subscription_plans`: find-or-create, never mutate

Razorpay/PayPal Plan objects are immutable once created — a customer's price must never silently change after checkout. `subscription_plans` rows are found-or-created keyed on `{category, billing_cycle, sessions_per_week, plan_type, pricing_tier, pricing_segment, pricing_override_id, promo_code_id}`. The resolver **only ever `.create()`s** new variant rows; it never `.update()`s an existing row's price. `user_subscriptions.plan_id` points at one of these rows by id, so an existing subscriber's price is protected even if an admin later edits the override that originally produced it (see the cache-invalidation note below).

## 2. Tier methodology

`utils/pppPricing.ts` — a 5-band purchasing-power-parity table, hand-curated (not a live PPP/FX/inflation feed):

| Tier | Band | Multiplier | Examples |
|---|---|---|---|
| 1 | Premium | 1.15× | CH, LU, NO, QA, AE, SG, IS |
| 2 | Standard | 1.00× | US, CA, GB, DE, FR, JP, KR... (also the default for unlisted countries) |
| 3 | Mid | 0.75× | ES, IT, PL, CN, TR... |
| 4 | Lower | 0.50× | MX, BR, IN, ID, VN... |
| 5 | Emerging | 0.30× | PK, BD, NG, KE... |

City overrides (`CITY_TIER_OVERRIDES`) refine ~20 countries' major metros (e.g. `US|new york` → Tier 1 even though the US baseline is Tier 2). Unlisted cities fall back to the country tier; unlisted countries fall back to Tier 2. Customer segment multipliers (`SEGMENT_MULTIPLIERS`) layer on top (Student 0.85×, Executive 1.15×, Veteran 0.8×, Paralympian 0.7×...). Four segments (`*_SPONSORED`) are deliberately **not** self-serve priced — they route to a contact form instead of checkout.

### Adding a country or city

Add an entry to `COUNTRY_TIERS` or `CITY_TIER_OVERRIDES` in `utils/pppPricing.ts`. No schema/migration needed — these are static TypeScript tables, not database-driven.

### Currency support (known limitation)

`getCurrencyForCountry()` only maps **India → INR** and **UAE → AED**; every other country displays and settles in USD. There is no live GBP, SGD, JPY, or KWD checkout currency today, despite those countries having their own PPP tier. This means Japan's zero-decimal formatting and Kuwait's 3-decimal formatting are not applicable — see `tests-e2e/country-pricing.spec.ts` for the explicit, documented test skips.

## 3. Admin overrides

`pricing_overrides` (admin console at `/admin/pricing`) lets an admin override the static tier system per scope (country / city / customer segment, most-specific wins) without redeploying code:

- **`multiplier_override`** — replaces the computed multiplier directly (takes precedence).
- **`tier_override`** — pins to a specific tier (1–5); multiplier is recomputed from that tier × segment.
- **`min_price_usd` / `max_price_usd`** — a floor/ceiling clamp applied after everything else, including promo discounts.
- **`is_excluded`** — blocks checkout entirely for that scope (routes to a "not available in your region" message).
- **`starts_at` / `ends_at`** — time-bounded; the resolver (`findCandidateOverrides` in `utils/pricingOverrides.ts`) already skips overrides that haven't started yet or have ended. The admin UI shows a **Scheduled** badge for an active override with a future `starts_at`.

Every create/update/delete/rollback is logged to `pricing_audit_log` (before/after JSON snapshots) and reversible via the rollback button.

**Cache invalidation:** editing or rolling back an override in place mutates the same `pricing_overrides.id`. Because `subscription_plans` rows are keyed partly on `pricing_override_id`, a stale cached row would otherwise keep serving its pre-edit price to brand-new customers (not just existing subscribers, who are separately protected). `PATCH`/`DELETE`/rollback call `invalidateCachedPlansForOverride()`, which deactivates (`is_active: false`) only the `subscription_plans` rows cached under that override id — existing `user_subscriptions` rows are untouched since they reference a row by id, not by `is_active`.

### CSV import/export

`GET /api/admin/pricing/overrides/export` / `POST .../import` let an admin bulk-edit overrides outside the one-row-at-a-time console. Export escapes any value that would be interpreted as a spreadsheet formula (`=`, `+`, `-`, `@` prefix → CSV-injection protection). Import validates every row through the same zod schema as the manual form and **always creates new rows** — it never edits a row in place, for the same stale-cache reason as above. Each imported row is logged to `pricing_audit_log` with `"Created via CSV import"`.

## 4. Promo codes

`promo_codes` / `promo_code_redemptions` — a purchaser-facing discount, distinct from the `referrals`/`testimonials` cashback systems (which pay the *referrer/reviewer*, not the purchaser).

- **Type:** `PERCENTAGE` or `FIXED_AMOUNT`. A fixed-amount discount is clamped so it can never exceed the base price (never a negative charge).
- **Scope:** optional `scope_country` (ISO-2) and `scope_product` (`recurring` | `lifetime` | `starter_kit`).
- **Limits:** optional global `redemption_limit` and a `per_customer_limit` (default 1, checked by email).
- **Validation** (`utils/pricing/promoCodes.ts`, server-only) runs inside all 4 payment routes, after `getEffectivePricing()` and before `clampUsd()` — so a promo can never undercut an admin-configured margin floor.
- **Redemption recording** happens at *payment confirmation* (the 4 `verify-payment`/`capture-order` routes), not at price-computation time, so an abandoned checkout never consumes a per-customer-limited code.

Admin CRUD: `GET/POST /api/admin/promo-codes`, `PATCH/DELETE /api/admin/promo-codes/[id]`. Checkout preview (never trusted as final price): `POST /api/checkout/validate-promo` (requires sign-in).

## 5. Tax (safe temporary mode)

**No tax is calculated anywhere in this system.** `tax_mode` (`INCLUSIVE` | `EXCLUSIVE` | `NOT_CALCULATED`, default `NOT_CALCULATED`) and `tax_amount` exist as schema fields on every amount-charged table (`subscription_plans`, `starter_kit_purchases`, `lifetime_membership_purchases`) so a real tax provider can be wired in later without another migration — but nothing populates `tax_amount` today. Checkout shows a plain, honest disclaimer instead of an invented number:

> "Taxes, if applicable in your region, are calculated at checkout."

Do not add estimated/illustrative tax figures without a real, authoritative rate source (a VATSense/Avalara/TaxJar-style provider, or your own compliance research) — this was an explicit decision to avoid fabricating numbers with real financial/compliance consequences.

## 6. Country/currency selection

`hooks/useCountryTier.ts` — precedence: URL `?country=` param → saved choice (`localStorage: strentor_country`) → best-effort browser-locale region subtag. **Never IP geolocation.** `components/checkout/CountryCurrencySelector.tsx` makes this an explicit, visible control on `/checkout` (wrapping the existing `components/ui/country-dropdown.tsx`), disabled once checkout moves past the form stage — a customer can always see and directly change their billing country, and the price never silently changes mid-checkout.

## 7. Payment provider abstraction

`lib/payments/types.ts` defines a `PaymentGateway` interface (`createCheckoutSession`, `createSubscription`, `cancelSubscription`, `refundPayment`, `verifyWebhook`), implemented by `lib/payments/razorpayGateway.ts` and `lib/payments/paypalGateway.ts`.

**Scope decision:** the already-working, production pricing-computation routes (the 4 routes in §1, plus verify/cancel routes) were **not** force-migrated through this interface. They contain detailed, SDK-response-shape-specific error handling, and there's no live payment sandbox in this environment to verify behavioral equivalence after a refactor — regression risk with no functional gain. The abstraction exists for **genuinely new capabilities**: today, refunds (`app/api/admin/payments/refund/route.ts` + the `/admin/payments/refunds` console), and as the intended target for gradual migration later.

PayPal webhook verification (`paypalGateway.verifyWebhook`) is implemented against PayPal's real `/v1/notifications/verify-webhook-signature` API, but **no PayPal webhook route exists yet** in this codebase (only `app/api/webhooks/razorpay/route.ts` does) — it's unexercised until one is built.

### Refund console

`/admin/payments/refunds` — search a customer by email, refund a **Starter Kit or Lifetime Membership** purchase through the matching gateway. Recurring subscription refunds are **not supported** — there is no per-charge payment ledger anywhere in the schema (only aggregate counters like `paid_count`/`current_start` on `user_subscriptions`), so a specific recurring charge can't be looked up. Adding that would need a new per-payment ledger table; out of scope for this pass.

## 8. Corporate (B2B) billing

`corporate_groups` now carries `seat_price_amount` / `seat_price_currency` / `contract_starts_at` / `contract_ends_at` (reusing the existing `member_limit` as the seat cap), and `corporate_invoices` carries an optional `line_items` JSON breakdown. Admin UI: the **Billing** panel on `/admin/corporate` (per-group contract-terms editor + itemized invoice creation). `GET/POST /api/admin/corporate-groups/[id]/invoices`, `PATCH /api/admin/corporate-groups/[id]`.

**Out of scope / future work:** bulk employee enrollment, seat-usage reporting, org-funded self-serve upgrades, and any actual corporate billing automation (invoices are still admin-created, not auto-generated from usage).

## 9. Running the tests

```bash
npm test              # Vitest — unit + mocked-Prisma integration tests (no DB needed)
npm run test:watch    # Vitest, watch mode
npm run test:coverage # Vitest with coverage
npm run test:e2e      # Playwright — see below
```

**Vitest** (`vitest.config.mts`) covers pure logic (tier resolution, rounding, currency conversion, promo validation, override precedence/clamping) plus `utils/pricingOverrides.ts` and `utils/pricing/promoCodes.ts` with `utils/prisma/prismaClient` mocked via `vi.mock` — no live database needed, ever. 73 tests, all passing.

**Playwright** (`playwright.config.ts`) points at this environment's pre-installed Chromium and auto-starts `next dev`. Two tiers:
- Specs that need no live database (client-computed pricing display, the country selector, promo-input UI, the tax disclaimer, `/api/checkout/validate-promo`'s auth check, and admin-page auth gating — these use Supabase Auth over HTTPS, a separate path from Prisma's direct Postgres connection) run for real, anywhere, including this sandbox.
- Specs needing a live `DATABASE_URL` and/or a seeded admin account (`TEST_ADMIN_EMAIL`/`TEST_ADMIN_PASSWORD`) self-skip with a printed reason via `tests-e2e/utils/environment.ts`. One scenario (existing subscriber retains price after an override change) additionally needs a live Razorpay/PayPal sandbox to create a real subscription and is documented as always-skipped here, with its underlying guarantee covered instead by a Vitest unit test.

Run in this sandbox: 13 passed, 4 skipped as documented, 0 unexpectedly failing.

## 10. Required environment variables

| Variable | Used by |
|---|---|
| `DATABASE_URL`, `DIRECT_URL` | Prisma (direct Postgres) |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Auth + PostgREST |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` | Razorpay checkout + webhook verification |
| `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_API_BASE` (optional, defaults to live) | PayPal checkout |
| `PAYPAL_WEBHOOK_ID` | `paypalGateway.verifyWebhook` (unused until a PayPal webhook route exists) |
| `TEST_ADMIN_EMAIL`, `TEST_ADMIN_PASSWORD` | Playwright admin-gated specs only |
| `PLAYWRIGHT_BASE_URL`, `PLAYWRIGHT_PORT`, `PLAYWRIGHT_CHROMIUM_PATH` | Playwright config overrides (all optional) |

## 11. Implemented / Configurable / Known limitations / Future work

**Implemented:** 5-tier PPP pricing with city overrides and customer segments; server-side-only price computation across all 4 payment routes; admin overrides with audit log, rollback, scheduled (future-dated) publishing, and CSV import/export; promo codes (percentage/fixed, scoped, rate-limited); tax-ready schema fields with honest "calculated at checkout" messaging; a visible country/currency selector; a `PaymentGateway` abstraction backing a new refund console; corporate seat pricing + contract dates + itemized invoicing; a Vitest unit/integration suite; a Playwright E2E suite.

**Configurable without a code change:** country/city tier assignments and segment multipliers (still require editing `utils/pppPricing.ts` and redeploying — not database-driven); admin overrides (fully dynamic, no deploy needed); promo codes (fully dynamic).

**Known limitations:**
- Only India (INR) and UAE (AED) have a dedicated checkout currency — every other country, including GB/SG/JP/KW, displays and settles in USD.
- No real tax calculation exists anywhere — `tax_mode`/`tax_amount` are schema-ready, unpopulated fields.
- No per-charge ledger for recurring subscriptions — the refund console only supports one-time purchases (Starter Kit, Lifetime Membership).
- Full ISO-3166 coverage relies on the Tier-2 default fallback rather than an explicit row per country.
- The 4 payment routes call Prisma/the Razorpay SDK directly rather than through `lib/payments/*Gateway.ts` — a deliberate scope boundary, not an oversight (see §7).
- PayPal webhook verification is implemented but has no route to call it yet.
- E2E coverage for "existing subscriber retains price after an override change" and full price-tampering-at-the-database-layer verification requires a live payment-provider sandbox this environment doesn't have; the closest safe proxy (an unauthenticated request with invented price fields) and a unit test covering the actual cache-invalidation guarantee are used instead.

**Recommended next steps:** seed a real GBP/SGD (and if needed JPY/KWD) checkout currency if those markets grow; integrate a real tax provider once the business has an authoritative rate source and compliance sign-off; add a per-payment ledger table if recurring-subscription refunds become a real support need; gradually migrate the 4 payment routes onto `PaymentGateway` once a payment sandbox is available to verify behavioral equivalence; run the full Playwright suite (including the DB/admin-gated specs) against a real staging environment with `DATABASE_URL` + `TEST_ADMIN_EMAIL`/`TEST_ADMIN_PASSWORD` set.
