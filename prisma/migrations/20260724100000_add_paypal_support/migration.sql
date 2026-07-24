-- Adds PayPal as a second payment provider alongside Razorpay.
-- Razorpay stays the default/primary for Indian customers (INR); PayPal is
-- for non-Indian customers (USD). Existing rows are unaffected — all new
-- columns default to the Razorpay/INR values that were implicitly true for
-- every row created before this migration.

-- subscription_plans: track which currency a plan's price is denominated
-- in, and (optionally) the PayPal Plan ID backing a PayPal-priced row.
ALTER TABLE "public"."subscription_plans"
  ADD COLUMN IF NOT EXISTS "currency" TEXT NOT NULL DEFAULT 'INR',
  ADD COLUMN IF NOT EXISTS "paypal_plan_id" TEXT;

-- user_subscriptions: parallel PayPal subscription id column, additive
-- only (razorpay_subscription_id is untouched).
ALTER TABLE "public"."user_subscriptions"
  ADD COLUMN IF NOT EXISTS "paypal_subscription_id" TEXT;

-- lifetime_membership_purchases: generalize the Razorpay-only order/payment
-- id columns into provider-agnostic ones, and record which provider/currency
-- each purchase used.
ALTER TABLE "public"."lifetime_membership_purchases"
  RENAME COLUMN "razorpay_order_id" TO "provider_order_id";

ALTER TABLE "public"."lifetime_membership_purchases"
  RENAME COLUMN "razorpay_payment_id" TO "provider_payment_id";

ALTER TABLE "public"."lifetime_membership_purchases"
  ADD COLUMN IF NOT EXISTS "payment_provider" TEXT NOT NULL DEFAULT 'razorpay',
  ADD COLUMN IF NOT EXISTS "currency" TEXT NOT NULL DEFAULT 'INR';
