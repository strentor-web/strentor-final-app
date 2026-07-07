-- Re-add sessions_per_week to subscription_plans for the rebuilt
-- /settings/subscription page, which now provisions Razorpay plans
-- dynamically per sessions-per-week + billing-cycle combination.
-- Uses IF NOT EXISTS since the column may already be present if the
-- original add migration (20260706070000) was applied and never reverted
-- at the database level.

ALTER TABLE "public"."subscription_plans" ADD COLUMN IF NOT EXISTS "sessions_per_week" INTEGER;
