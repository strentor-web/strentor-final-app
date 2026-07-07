-- Revert of the dynamic sessions/week pricing calculator's payment integration.
-- Drops sessions_per_week again. Uses IF EXISTS since this is safe to run
-- whether or not the prior "add" migration was ever applied to this database.

ALTER TABLE "public"."subscription_plans" DROP COLUMN IF EXISTS "sessions_per_week";
