-- Corporate B2B pricing extensions: per-seat contract pricing on
-- corporate_groups, and an optional itemized breakdown on corporate_invoices.

ALTER TABLE "corporate_groups"
  ADD COLUMN IF NOT EXISTS "seat_price_amount" DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS "seat_price_currency" TEXT,
  ADD COLUMN IF NOT EXISTS "contract_starts_at" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "contract_ends_at" TIMESTAMP(3);

ALTER TABLE "corporate_invoices"
  ADD COLUMN IF NOT EXISTS "line_items" JSONB;
