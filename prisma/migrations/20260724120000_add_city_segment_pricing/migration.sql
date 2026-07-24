-- Adds city/region and customer-segment tracking, both used as inputs to
-- the PPP pricing formula (see utils/pppPricing.ts) and recorded here for
-- reporting/support. Free text, not validated against a fixed list except
-- customer_segment being one of a known set in application code.

ALTER TABLE "public"."checkout_attempts"
  ADD COLUMN IF NOT EXISTS "city" TEXT,
  ADD COLUMN IF NOT EXISTS "customer_segment" TEXT;

ALTER TABLE "public"."lifetime_membership_purchases"
  ADD COLUMN IF NOT EXISTS "city" TEXT,
  ADD COLUMN IF NOT EXISTS "customer_segment" TEXT;

ALTER TABLE "public"."user_subscriptions"
  ADD COLUMN IF NOT EXISTS "city" TEXT,
  ADD COLUMN IF NOT EXISTS "customer_segment" TEXT;

-- pricing_segment discriminates subscription_plans rows the same way
-- pricing_tier already does: a recurring Plan's billed amount is fixed at
-- creation time (Razorpay/PayPal), so two different customer segments
-- must never share one Plan/row.
ALTER TABLE "public"."subscription_plans"
  ADD COLUMN IF NOT EXISTS "pricing_segment" TEXT;
