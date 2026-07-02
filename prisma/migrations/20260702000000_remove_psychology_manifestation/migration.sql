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
CREATE TYPE "public"."Role_new" AS ENUM ('CLIENT', 'TRAINER', 'FITNESS_TRAINER', 'FITNESS_TRAINER_ADMIN', 'ADMIN');
ALTER TABLE "public"."users_profile" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "public"."users_profile" ALTER COLUMN "role" TYPE "public"."Role_new" USING ("role"::text::"public"."Role_new");
ALTER TABLE "public"."users_profile" ALTER COLUMN "role" SET DEFAULT 'CLIENT';
DROP TYPE "public"."Role";
ALTER TYPE "public"."Role_new" RENAME TO "Role";

-- SubscriptionCategory
CREATE TYPE "public"."SubscriptionCategory_new" AS ENUM ('FITNESS', 'ALL_IN_ONE');
ALTER TABLE "public"."subscription_plans" ALTER COLUMN "category" TYPE "public"."SubscriptionCategory_new" USING ("category"::text::"public"."SubscriptionCategory_new");
ALTER TABLE "public"."trainer_clients" ALTER COLUMN "category" TYPE "public"."SubscriptionCategory_new" USING ("category"::text::"public"."SubscriptionCategory_new");
DROP TYPE "public"."SubscriptionCategory";
ALTER TYPE "public"."SubscriptionCategory_new" RENAME TO "SubscriptionCategory";

COMMIT;
