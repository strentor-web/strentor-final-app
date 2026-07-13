-- Tracks one-time purchases of the 7-Day Wheelchair Strength Starter Kit
-- (a fixed low-friction entry product, distinct from the recurring
-- subscription_plans/user_subscriptions model used elsewhere).

CREATE TABLE IF NOT EXISTS "public"."starter_kit_purchases" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "razorpay_order_id" TEXT NOT NULL,
    "razorpay_payment_id" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "starter_kit_purchases_pkey" PRIMARY KEY ("id")
);
