// STRENTOR AI coaching ladder — Phase 1 (pricing display + feature-gating
// scaffolding only). Real AI conversations, adaptive-workout generation,
// and payment (Razorpay plan IDs) are Phase 2 — this config is the single
// source of truth both the pricing page and the future feature-gating
// checks read from.

export interface AiCoachingFeatureFlags {
  aiConversationsPerMonth: number | "unlimited";
  adaptiveWorkouts: boolean;
  habitTracking: boolean;
  progressTracking: boolean;
  weeklyReports: boolean;
  monthlyCoachReview: boolean;
  weeklyCoachReview: boolean;
  videoFormFeedback: boolean;
  priorityAdjustments: boolean;
  fullHumanCoaching: boolean;
}

export interface AiCoachingTier {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  description: string;
  features: AiCoachingFeatureFlags;
  /** Lower tiers self-serve to sign-up; higher tiers need a discovery call
   *  since they involve real coach capacity, not just AI usage. */
  ctaType: "self_serve" | "discovery_call";
}

export const aiCoachingTiers: AiCoachingTier[] = [
  {
    id: "ai_starter",
    name: "STRENTOR AI Starter",
    price: "₹499/month",
    priceValue: 499,
    description: "Basic workouts, mindset exercises, habit tracking and limited AI conversations",
    features: {
      aiConversationsPerMonth: 20,
      adaptiveWorkouts: false,
      habitTracking: true,
      progressTracking: false,
      weeklyReports: false,
      monthlyCoachReview: false,
      weeklyCoachReview: false,
      videoFormFeedback: false,
      priorityAdjustments: false,
      fullHumanCoaching: false,
    },
    ctaType: "self_serve",
  },
  {
    id: "ai_coach",
    name: "STRENTOR AI Coach",
    price: "₹1,499/month",
    priceValue: 1499,
    description: "Full personalization, adaptive workouts, unlimited coaching conversations, progress tracking and weekly reports",
    features: {
      aiConversationsPerMonth: "unlimited",
      adaptiveWorkouts: true,
      habitTracking: true,
      progressTracking: true,
      weeklyReports: true,
      monthlyCoachReview: false,
      weeklyCoachReview: false,
      videoFormFeedback: false,
      priorityAdjustments: false,
      fullHumanCoaching: false,
    },
    ctaType: "self_serve",
  },
  {
    id: "ai_human_review",
    name: "AI + Human Review",
    price: "₹4,999/month",
    priceValue: 4999,
    description: "Everything above plus one detailed monthly review by a STRENTOR coach",
    features: {
      aiConversationsPerMonth: "unlimited",
      adaptiveWorkouts: true,
      habitTracking: true,
      progressTracking: true,
      weeklyReports: true,
      monthlyCoachReview: true,
      weeklyCoachReview: false,
      videoFormFeedback: false,
      priorityAdjustments: false,
      fullHumanCoaching: false,
    },
    ctaType: "self_serve",
  },
  {
    id: "ai_human_accountability",
    name: "AI + Human Accountability",
    price: "₹9,999/month",
    priceValue: 9999,
    description: "Weekly coach review, video-form feedback and priority adjustments",
    features: {
      aiConversationsPerMonth: "unlimited",
      adaptiveWorkouts: true,
      habitTracking: true,
      progressTracking: true,
      weeklyReports: true,
      monthlyCoachReview: true,
      weeklyCoachReview: true,
      videoFormFeedback: true,
      priorityAdjustments: true,
      fullHumanCoaching: false,
    },
    ctaType: "discovery_call",
  },
  {
    id: "full_transformation",
    name: "Full 1:1 Transformation",
    price: "₹24,999/month",
    priceValue: 24999,
    description: "Human-led premium fitness, mindset and transformation coaching with AI support",
    features: {
      aiConversationsPerMonth: "unlimited",
      adaptiveWorkouts: true,
      habitTracking: true,
      progressTracking: true,
      weeklyReports: true,
      monthlyCoachReview: true,
      weeklyCoachReview: true,
      videoFormFeedback: true,
      priorityAdjustments: true,
      fullHumanCoaching: true,
    },
    ctaType: "discovery_call",
  },
];
