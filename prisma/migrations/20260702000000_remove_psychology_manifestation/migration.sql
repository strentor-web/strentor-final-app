-- Remove PSYCHOLOGY_TRAINER / MANIFESTATION_TRAINER from Role and
-- PSYCHOLOGY / MANIFESTATION from SubscriptionCategory.
-- Postgres cannot drop enum values in place, so each enum is recreated
-- without the removed values and columns are migrated to the new type.

BEGIN;

-- Guard: abort if any existing row still references a value being removed,
-- since the USING cast below would otherwise fail (or silently truncate data).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM "public"."users_profile"
    WHERE "role" IN ('PSYCHOLOGY_TRAINER', 'MANIFESTATION_TRAINER')
  ) THEN
    RAISE EXCEPTION 'Cannot drop Role enum values: users_profile rows still reference PSYCHOLOGY_TRAINER or MANIFESTATION_TRAINER';
  END IF;

  IF EXISTS (
    SELECT 1 FROM "public"."subscription_plans"
    WHERE "category" IN ('PSYCHOLOGY', 'MANIFESTATION')
  ) THEN
    RAISE EXCEPTION 'Cannot drop SubscriptionCategory enum values: subscription_plans rows still reference PSYCHOLOGY or MANIFESTATION';
  END IF;

  IF EXISTS (
    SELECT 1 FROM "public"."trainer_clients"
    WHERE "category" IN ('PSYCHOLOGY', 'MANIFESTATION')
  ) THEN
    RAISE EXCEPTION 'Cannot drop SubscriptionCategory enum values: trainer_clients rows still reference PSYCHOLOGY or MANIFESTATION';
  END IF;
END $$;

-- Role
-- Built dynamically from whatever values actually exist today, minus the
-- two being removed — this migration originally hardcoded the target list
-- (CLIENT, TRAINER, FITNESS_TRAINER, FITNESS_TRAINER_ADMIN, ADMIN), which
-- went stale once later work added CORPORATE_ADMIN / CORPORATE_EMPLOYEE
-- (and other values) directly against the database, ahead of when this
-- migration was ever successfully applied. A dynamic rebuild is correct
-- regardless of what else has been added out of order.
DO $$
DECLARE
  new_values text;
BEGIN
  SELECT string_agg(quote_literal(enumlabel), ', ' ORDER BY enumsortorder)
    INTO new_values
    FROM pg_enum
    WHERE enumtypid = '"public"."Role"'::regtype
      AND enumlabel NOT IN ('PSYCHOLOGY_TRAINER', 'MANIFESTATION_TRAINER');

  EXECUTE format('CREATE TYPE "public"."Role_new" AS ENUM (%s)', new_values);
END $$;

ALTER TABLE "public"."users_profile" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "public"."users_profile" ALTER COLUMN "role" TYPE "public"."Role_new" USING ("role"::text::"public"."Role_new");
ALTER TABLE "public"."users_profile" ALTER COLUMN "role" SET DEFAULT 'CLIENT';
DROP TYPE "public"."Role";
ALTER TYPE "public"."Role_new" RENAME TO "Role";

-- SubscriptionCategory — same dynamic approach, for the same reason
-- (FLAGSHIP_TRANSFORMATION / ELITE_MENTORSHIP already exist in the real
-- database even though the migration that's supposed to add them hasn't
-- been recorded as applied yet).
DO $$
DECLARE
  new_values text;
BEGIN
  SELECT string_agg(quote_literal(enumlabel), ', ' ORDER BY enumsortorder)
    INTO new_values
    FROM pg_enum
    WHERE enumtypid = '"public"."SubscriptionCategory"'::regtype
      AND enumlabel NOT IN ('PSYCHOLOGY', 'MANIFESTATION');

  EXECUTE format('CREATE TYPE "public"."SubscriptionCategory_new" AS ENUM (%s)', new_values);
END $$;

ALTER TABLE "public"."subscription_plans" ALTER COLUMN "category" TYPE "public"."SubscriptionCategory_new" USING ("category"::text::"public"."SubscriptionCategory_new");
ALTER TABLE "public"."trainer_clients" ALTER COLUMN "category" TYPE "public"."SubscriptionCategory_new" USING ("category"::text::"public"."SubscriptionCategory_new");
DROP TYPE "public"."SubscriptionCategory";
ALTER TYPE "public"."SubscriptionCategory_new" RENAME TO "SubscriptionCategory";

COMMIT;
