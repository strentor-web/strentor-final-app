#!/bin/sh
# One-time migration-history reconciliation, run before every build.
#
# Production drifted from the tracked migration history: several features
# were built directly against the database (manual SQL) while the deploy
# pipeline never actually ran "prisma migrate deploy" (it only ran
# "prisma generate" — see package.json history). Each line below tells
# Prisma the real status of one specific migration so "prisma migrate
# deploy" can get past it instead of erroring on a false mismatch.
#
# Safe to leave in place indefinitely: resolving a migration that's
# already in the target state just errors harmlessly, swallowed by the
# `|| true` below — it does not re-run or undo anything.

resolve() {
  npx prisma migrate resolve "$1" "$2" || true
}

resolve --rolled-back 20260702000000_remove_psychology_manifestation
resolve --applied 20260719120000_add_academy_assessment_safety
resolve --applied 20260719130000_add_academy_trackers
resolve --applied 20260719140000_add_academy_coaching_testimonials
resolve --applied 20260719150000_add_academy_corporate_mentorship
resolve --applied 20260730120000_add_promo_codes_and_tax_fields
resolve --applied 20260802121500_add_trainer_session_notes
# This one failed partway through (its foreign key already existed) — the
# migration file itself was fixed to guard that line, so clear the failed
# attempt instead of marking it applied, so it actually retries.
resolve --rolled-back 20260727100000_add_corporate_roles
