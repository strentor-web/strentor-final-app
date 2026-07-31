-- Adds FLAGSHIP_TRANSFORMATION and ELITE_MENTORSHIP to SubscriptionCategory
-- so these two programs can have their own sessions-per-week priced
-- checkout, distinct from the generic FITNESS category.

ALTER TYPE "SubscriptionCategory" ADD VALUE IF NOT EXISTS 'FLAGSHIP_TRANSFORMATION';
ALTER TYPE "SubscriptionCategory" ADD VALUE IF NOT EXISTS 'ELITE_MENTORSHIP';
