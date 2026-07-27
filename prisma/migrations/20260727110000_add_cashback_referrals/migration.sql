-- Cashback for testimonial reviews (text/video) and a client referral
-- program. Both are tracked as "owed" here and paid manually by STRENTOR
-- staff (UPI) — there is no payout/banking API integrated in this
-- codebase, so this is a ledger, not an automated payment system.

ALTER TABLE "public"."testimonials" ADD COLUMN IF NOT EXISTS "review_type" TEXT NOT NULL DEFAULT 'TEXT';
ALTER TABLE "public"."testimonials" ADD COLUMN IF NOT EXISTS "cashback_amount" INTEGER;
ALTER TABLE "public"."testimonials" ADD COLUMN IF NOT EXISTS "cashback_paid_at" TIMESTAMP(3);

ALTER TABLE "public"."users_profile" ADD COLUMN IF NOT EXISTS "referral_code" TEXT;
ALTER TABLE "public"."users_profile" ADD COLUMN IF NOT EXISTS "payout_upi_id" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "UsersProfile_referralCode_key" ON "public"."users_profile"("referral_code");

CREATE TABLE IF NOT EXISTS "public"."referrals" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "referrer_id" UUID NOT NULL,
  "referral_code" TEXT NOT NULL,
  "referred_name" TEXT NOT NULL,
  "referred_email" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "intake_submission_id" UUID,
  "cashback_amount" INTEGER NOT NULL DEFAULT 2000,
  "converted_at" TIMESTAMP(3),
  "cashback_paid_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "referrals_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Referral_referrerId_fkey" FOREIGN KEY ("referrer_id") REFERENCES "public"."users_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "Referral_referrerId_idx" ON "public"."referrals"("referrer_id");
CREATE INDEX IF NOT EXISTS "Referral_status_idx" ON "public"."referrals"("status");
