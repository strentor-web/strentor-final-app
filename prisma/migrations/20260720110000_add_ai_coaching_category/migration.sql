-- Adds AI_COACHING as a subscription category, in preparation for the
-- STRENTOR AI tier ladder (Phase 2 wires real subscription_plans rows
-- once Razorpay plan IDs and the AI conversation backend exist).

ALTER TYPE "public"."SubscriptionCategory" ADD VALUE 'AI_COACHING';
