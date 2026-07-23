-- Tracks one-time Lifetime Membership purchases (Razorpay Orders API, not
-- a recurring Subscription/Plan). On verified payment, application code
-- creates a real subscription_plans row (billing_cycle = 0 sentinel) and
-- an ACTIVE, never-expiring user_subscriptions row — this table exists
-- purely to track the order/payment lifecycle, mirroring
-- starter_kit_purchases.

CREATE TABLE IF NOT EXISTS "public"."lifetime_membership_purchases" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "plan_id" UUID NOT NULL,
    "sessions_per_week" INTEGER NOT NULL,
    "plan_type" "public"."PlanType" NOT NULL,
    "razorpay_order_id" TEXT NOT NULL,
    "razorpay_payment_id" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lifetime_membership_purchases_pkey" PRIMARY KEY ("id")
);
