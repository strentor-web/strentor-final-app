-- Abandoned-checkout capture: written the moment /checkout collects contact
-- details, independent of whether account/order/payment ever completes.
CREATE TABLE IF NOT EXISTS "public"."checkout_attempts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "sessions_per_week" INTEGER NOT NULL,
    "plan_type" "public"."PlanType" NOT NULL,
    "tier" TEXT NOT NULL,
    "billing_cycle" INTEGER,
    "payment_provider" TEXT NOT NULL DEFAULT 'razorpay',
    "status" TEXT NOT NULL DEFAULT 'started',
    "user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checkout_attempts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "CheckoutAttempt_email_idx" ON "public"."checkout_attempts"("email");
CREATE INDEX IF NOT EXISTS "CheckoutAttempt_status_idx" ON "public"."checkout_attempts"("status");

-- Server-side mirror of the onboarding wizard's localStorage autosave.
CREATE TABLE IF NOT EXISTS "public"."onboarding_drafts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "form_data" JSONB NOT NULL,
    "last_step" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "onboarding_drafts_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "onboarding_drafts_user_id_key" ON "public"."onboarding_drafts"("user_id");
