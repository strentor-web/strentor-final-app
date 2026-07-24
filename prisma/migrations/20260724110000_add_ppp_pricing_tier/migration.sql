-- Adds a PPP pricing tier to subscription_plans, needed so PayPal recurring
-- plans for the same sessions/week + billing cycle + training mode combo
-- are never shared across customers in different PPP tiers (a PayPal
-- recurring subscription's billed amount is fixed at Plan-creation time on
-- PayPal's side, so tier must be part of what makes a row reusable).
-- NULL for existing Razorpay/INR rows, which have no PPP tier.

ALTER TABLE "public"."subscription_plans"
  ADD COLUMN IF NOT EXISTS "pricing_tier" INTEGER;
