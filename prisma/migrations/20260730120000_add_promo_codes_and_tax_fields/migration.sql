-- Promo/coupon codes (real checkout discounts, distinct from the
-- referrals/testimonials cashback systems which pay the referrer/reviewer
-- rather than discounting the purchaser) and tax-ready fields (safe mode —
-- no rate is calculated anywhere yet; see utils/pricing/tax.ts).

-- CreateEnum
CREATE TYPE "public"."PromoCodeType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT');

-- CreateEnum
CREATE TYPE "public"."TaxMode" AS ENUM ('INCLUSIVE', 'EXCLUSIVE', 'NOT_CALCULATED');

-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."promo_codes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" TEXT NOT NULL,
    "type" "public"."PromoCodeType" NOT NULL,
    "value" DECIMAL(10,3) NOT NULL,
    "scope_country" TEXT,
    "scope_product" TEXT,
    "starts_at" TIMESTAMP(3),
    "ends_at" TIMESTAMP(3),
    "redemption_limit" INTEGER,
    "per_customer_limit" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "label" TEXT,
    "created_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promo_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "promo_codes_code_key" ON "public"."promo_codes"("code");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "PromoCode_code_idx" ON "public"."promo_codes"("code");

-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."promo_code_redemptions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "promo_code_id" UUID NOT NULL,
    "user_id" UUID,
    "email" TEXT NOT NULL,
    "order_reference" TEXT NOT NULL,
    "amount_discounted" DECIMAL(10,2) NOT NULL,
    "redeemed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promo_code_redemptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "PromoCodeRedemption_promoCodeId_idx" ON "public"."promo_code_redemptions"("promo_code_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "PromoCodeRedemption_email_idx" ON "public"."promo_code_redemptions"("email");

-- AddForeignKey
ALTER TABLE "public"."promo_code_redemptions"
    ADD CONSTRAINT "PromoCodeRedemption_promoCodeId_fkey"
    FOREIGN KEY ("promo_code_id") REFERENCES "public"."promo_codes"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable: subscription_plans — promo_code_id joins pricing_tier /
-- pricing_segment / pricing_override_id as a discriminator on the
-- find-or-create lookup (see app/api/subscriptions/ensure-plan/route.ts);
-- tax_mode/tax_amount are placeholders, not populated by any calculation.
ALTER TABLE "public"."subscription_plans"
    ADD COLUMN IF NOT EXISTS "promo_code_id" UUID,
    ADD COLUMN IF NOT EXISTS "discount_amount" DECIMAL(10,2),
    ADD COLUMN IF NOT EXISTS "tax_mode" "public"."TaxMode" NOT NULL DEFAULT 'NOT_CALCULATED',
    ADD COLUMN IF NOT EXISTS "tax_amount" DECIMAL(10,2);

-- AlterTable: starter_kit_purchases
ALTER TABLE "public"."starter_kit_purchases"
    ADD COLUMN IF NOT EXISTS "promo_code_id" UUID,
    ADD COLUMN IF NOT EXISTS "discount_amount" DECIMAL(10,2),
    ADD COLUMN IF NOT EXISTS "tax_mode" "public"."TaxMode" NOT NULL DEFAULT 'NOT_CALCULATED',
    ADD COLUMN IF NOT EXISTS "tax_amount" DECIMAL(10,2);

-- AlterTable: lifetime_membership_purchases
ALTER TABLE "public"."lifetime_membership_purchases"
    ADD COLUMN IF NOT EXISTS "promo_code_id" UUID,
    ADD COLUMN IF NOT EXISTS "discount_amount" DECIMAL(10,2),
    ADD COLUMN IF NOT EXISTS "tax_mode" "public"."TaxMode" NOT NULL DEFAULT 'NOT_CALCULATED',
    ADD COLUMN IF NOT EXISTS "tax_amount" DECIMAL(10,2);

-- AlterTable: checkout_attempts — funnel tracking only (no amount field
-- exists on this table; the actual discount is recorded on whichever row
-- above the checkout ultimately produces).
ALTER TABLE "public"."checkout_attempts"
    ADD COLUMN IF NOT EXISTS "promo_code_id" UUID;
