-- Add sessions_per_week to subscription_plans, so dynamically-priced plans
-- created from the sessions/week + billing-cycle pricing calculator can
-- record the weekly cadence they were generated from.

ALTER TABLE "public"."subscription_plans" ADD COLUMN "sessions_per_week" INTEGER;
