-- Admin pricing overrides, audit log, and cached live FX rates. See
-- utils/pppPricing.ts and utils/pricingOverrides.ts for how these are
-- consumed by the actual pricing engine.

CREATE TABLE IF NOT EXISTS "public"."pricing_overrides" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "scope_country" TEXT,
    "scope_city" TEXT,
    "scope_segment" TEXT,
    "tier_override" INTEGER,
    "multiplier_override" DECIMAL(6,3),
    "min_price_usd" DECIMAL(10,2),
    "max_price_usd" DECIMAL(10,2),
    "is_excluded" BOOLEAN NOT NULL DEFAULT false,
    "label" TEXT,
    "starts_at" TIMESTAMP(3),
    "ends_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pricing_overrides_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "PricingOverride_scope_idx"
    ON "public"."pricing_overrides" ("scope_country", "scope_city", "scope_segment");

CREATE TABLE IF NOT EXISTS "public"."pricing_audit_log" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "override_id" UUID,
    "action" TEXT NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "changed_by" UUID,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "pricing_audit_log_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "PricingAuditLog_overrideId_idx"
    ON "public"."pricing_audit_log" ("override_id");

-- Third discriminator (alongside pricing_tier / pricing_segment) so a
-- subscription_plans row created while a promotional override was active
-- is never confused with (or reused by) a row priced without it.
ALTER TABLE "public"."subscription_plans"
  ADD COLUMN IF NOT EXISTS "pricing_override_id" UUID;

CREATE TABLE IF NOT EXISTS "public"."fx_rate_cache" (
    "currency" TEXT NOT NULL,
    "rate_to_usd" DECIMAL(12,6) NOT NULL,
    "fetched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT NOT NULL DEFAULT 'frankfurter.app',

    CONSTRAINT "fx_rate_cache_pkey" PRIMARY KEY ("currency")
);
