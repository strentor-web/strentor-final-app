-- Safety Check step added to onboarding for Fitness subscribers — persisted
-- regardless of answer so a coach can see the check was done, not only when
-- something was flagged (that also creates a safety_flags row separately).
ALTER TABLE "public"."users_profile"
  ADD COLUMN IF NOT EXISTS "safety_medical_condition" TEXT,
  ADD COLUMN IF NOT EXISTS "safety_medical_clearance" TEXT,
  ADD COLUMN IF NOT EXISTS "safety_red_flags" JSONB,
  ADD COLUMN IF NOT EXISTS "safety_notes" TEXT,
  ADD COLUMN IF NOT EXISTS "safety_check_completed_at" TIMESTAMP(3);
