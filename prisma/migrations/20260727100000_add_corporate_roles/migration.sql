-- Corporate admin/employee login feature: adds two new Role values and
-- links users_profile to corporate_groups so a corporate account's admin
-- and employees can both log in and see role-appropriate data.
--
-- NOTE: adding these Role enum values here does NOT automatically make the
-- Supabase custom_access_token_hook or the auth.users -> users_profile
-- creation trigger aware of them, since those functions are managed
-- directly in the Supabase SQL Editor, outside this repo's migrations.
-- See the delivery note that accompanies this file for what to check.

ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'CORPORATE_ADMIN';
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'CORPORATE_EMPLOYEE';

ALTER TABLE "public"."users_profile" ADD COLUMN IF NOT EXISTS "corporate_group_id" UUID;

ALTER TABLE "public"."users_profile"
  ADD CONSTRAINT "UsersProfile_corporateGroupId_fkey"
  FOREIGN KEY ("corporate_group_id") REFERENCES "public"."corporate_groups"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "UsersProfile_corporateGroupId_idx" ON "public"."users_profile"("corporate_group_id");

-- Confirmed bookings for a corporate account's workshops/pilot programs —
-- distinct from corporate_inquiries (inbound-lead stage, unconfirmed).
-- STRENTOR staff or a CORPORATE_ADMIN log a booking here once scheduled;
-- it then shows up on both the corporate admin dashboard and each
-- corporate employee's "Company Workshops" page.
CREATE TABLE IF NOT EXISTS "public"."corporate_program_bookings" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "corporate_group_id" UUID NOT NULL,
  "program_option" TEXT NOT NULL,
  "scheduled_date" TIMESTAMP(3),
  "status" TEXT NOT NULL DEFAULT 'scheduled',
  "notes" TEXT,
  "created_by_id" UUID,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "corporate_program_bookings_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CorporateProgramBooking_corporateGroupId_fkey" FOREIGN KEY ("corporate_group_id") REFERENCES "public"."corporate_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "CorporateProgramBooking_corporateGroupId_idx" ON "public"."corporate_program_bookings"("corporate_group_id");

-- Manually-logged invoice records for a corporate account, shown on the
-- corporate admin dashboard's billing tab. Not tied to an automated
-- payment gateway — STRENTOR staff enter these after invoicing a
-- corporate client directly, same as the existing corporate_groups
-- create-only flow.
CREATE TABLE IF NOT EXISTS "public"."corporate_invoices" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "corporate_group_id" UUID NOT NULL,
  "description" TEXT NOT NULL,
  "amount" DECIMAL(12,2) NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'INR',
  "status" TEXT NOT NULL DEFAULT 'pending',
  "issued_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "due_at" TIMESTAMP(3),
  "paid_at" TIMESTAMP(3),
  "created_by_id" UUID,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "corporate_invoices_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CorporateInvoice_corporateGroupId_fkey" FOREIGN KEY ("corporate_group_id") REFERENCES "public"."corporate_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "CorporateInvoice_corporateGroupId_idx" ON "public"."corporate_invoices"("corporate_group_id");
