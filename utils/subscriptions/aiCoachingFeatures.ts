import { aiCoachingTiers, type AiCoachingFeatureFlags, type AiCoachingTier } from "@/config/aiCoachingTiers";

/**
 * Looks up an AI coaching tier by its stable id (e.g. "ai_coach").
 * Once Phase 2 wires real subscription_plans rows for the AI_COACHING
 * category, a plan's `features` JSON should mirror this same shape so
 * callers can switch to reading it from the DB without changing shape.
 */
export function getAiCoachingTier(tierId: string): AiCoachingTier | undefined {
  return aiCoachingTiers.find((tier) => tier.id === tierId);
}

/** No active AI coaching subscription = no features unlocked. */
export const NO_AI_COACHING_ACCESS: AiCoachingFeatureFlags = {
  aiConversationsPerMonth: 0,
  adaptiveWorkouts: false,
  habitTracking: false,
  progressTracking: false,
  weeklyReports: false,
  monthlyCoachReview: false,
  weeklyCoachReview: false,
  videoFormFeedback: false,
  priorityAdjustments: false,
  fullHumanCoaching: false,
};

export function getAiCoachingFeatures(tierId: string | null | undefined): AiCoachingFeatureFlags {
  if (!tierId) return NO_AI_COACHING_ACCESS;
  return getAiCoachingTier(tierId)?.features ?? NO_AI_COACHING_ACCESS;
}

export function hasAiCoachingFeature(
  tierId: string | null | undefined,
  feature: keyof Omit<AiCoachingFeatureFlags, "aiConversationsPerMonth">
): boolean {
  return getAiCoachingFeatures(tierId)[feature] === true;
}
