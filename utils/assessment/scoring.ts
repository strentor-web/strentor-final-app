// Deterministic, rule-based readiness scoring + pathway recommendation.
// Mirrors App Builder Requirement Document section 9.1 (pathway logic
// table) and 9.2 (pseudocode) exactly. Never touched by generative AI —
// "Important builder instruction" in the source doc is explicit about this.

export interface ScoredQuestionOption {
  value: string;
  label: string;
  points: number;
}

export interface ScoredQuestion {
  key: string;
  label: string;
  options: ScoredQuestionOption[];
}

// Six questions, 0-10 points each, max 60 — calibrated so the doc's
// score thresholds (45 / 35 / 25 out of an implied ~60) land at sensible
// readiness levels (beginner-but-consistent still clears "Start Strong").
export const SCORED_QUESTIONS: ScoredQuestion[] = [
  {
    key: "training_experience",
    label: "Current training experience",
    options: [
      { value: "beginner", label: "Beginner", points: 4 },
      { value: "restarting", label: "Restarting after a break", points: 6 },
      { value: "intermediate", label: "Intermediate", points: 8 },
      { value: "experienced", label: "Experienced", points: 10 },
    ],
  },
  {
    key: "daily_energy",
    label: "Typical daily energy level",
    options: [
      { value: "low", label: "Low", points: 3 },
      { value: "variable", label: "Variable", points: 6 },
      { value: "moderate", label: "Moderate", points: 8 },
      { value: "high", label: "High", points: 10 },
    ],
  },
  {
    key: "routine_consistency",
    label: "How consistent is your daily/weekly routine right now?",
    options: [
      { value: "difficult", label: "Difficult right now", points: 3 },
      { value: "average", label: "Average", points: 7 },
      { value: "strong", label: "Strong", points: 10 },
    ],
  },
  {
    key: "safety_confidence",
    label: "How confident are you that you could start training safely?",
    options: [
      { value: "not_confident", label: "Not confident", points: 3 },
      { value: "somewhat", label: "Somewhat confident", points: 7 },
      { value: "very", label: "Very confident", points: 10 },
    ],
  },
  {
    key: "support_system",
    label: "Do you have caregiver, family, or community support available?",
    options: [
      { value: "no", label: "No", points: 4 },
      { value: "sometimes", label: "Sometimes", points: 7 },
      { value: "yes", label: "Yes", points: 10 },
    ],
  },
  {
    key: "time_commitment",
    label: "Can you commit to training 2-4x per week?",
    options: [
      { value: "no", label: "No", points: 0 },
      { value: "maybe", label: "Maybe", points: 5 },
      { value: "yes", label: "Yes", points: 10 },
    ],
  },
];

// Red flag categories per doc section 6.2. Selecting anything other than
// "none" gates the pathway to CONSULT_PROFESSIONAL regardless of score.
export const RED_FLAG_NONE_VALUE = "none";

export const RED_FLAG_OPTIONS: { value: string; label: string }[] = [
  { value: "sharp_pain", label: "Sharp or electric pain" },
  { value: "numbness_weakness", label: "New numbness or unusual weakness" },
  { value: "neurological", label: "New neurological symptoms" },
  { value: "dizziness_fainting", label: "Dizziness or fainting" },
  { value: "chest_pain_breathlessness", label: "Chest pain or severe breathlessness" },
  { value: "severe_fatigue", label: "Severe or abnormal fatigue / post-activity crash" },
  { value: "wound_pressure_sore", label: "Open wound or pressure sore" },
  { value: "recurring_pain", label: "Recurring pain during movement" },
  { value: RED_FLAG_NONE_VALUE, label: "None of these" },
];

export type PathwayResult =
  | "START_STRONG"
  | "START_STRONG_CAUTION"
  | "BUILD_STRENGTH"
  | "LIVE_LIMITLESS"
  | "CORPORATE_INCLUSIVE_WELLNESS"
  | "CONSULT_PROFESSIONAL";

export interface AssessmentAnswers {
  scored: Record<string, string>;
  redFlags: string[];
  corporateInterest: boolean;
  eliteInterest: boolean;
}

export interface ScoringResult {
  totalScore: number;
  redFlagExists: boolean;
  pathway: PathwayResult;
  reason: string;
  ctaType: string;
  automaticProgressionAllowed: boolean;
  showCorporateCta: boolean;
  showEliteCta: boolean;
}

export function scoreAssessment(answers: AssessmentAnswers): ScoringResult {
  let totalScore = 0;
  for (const question of SCORED_QUESTIONS) {
    const chosen = answers.scored[question.key];
    const option = question.options.find((o) => o.value === chosen);
    totalScore += option?.points ?? 0;
  }

  const redFlagExists = answers.redFlags.some((flag) => flag !== RED_FLAG_NONE_VALUE);

  let pathway: PathwayResult;
  let reason: string;
  let ctaType: string;
  let automaticProgressionAllowed = true;

  if (redFlagExists) {
    pathway = "CONSULT_PROFESSIONAL";
    reason =
      "Your response suggests it may be safer to get professional guidance or coach review before continuing. This pathway is a starting guide, not a medical clearance.";
    ctaType = "consult_professional";
    automaticProgressionAllowed = false;
  } else if (totalScore >= 45) {
    pathway = "BUILD_STRENGTH";
    reason =
      "Your readiness score reflects solid training experience, consistency, and support with no safety concerns flagged.";
    ctaType = "start_structured_program";
  } else if (totalScore >= 35) {
    pathway = "START_STRONG";
    reason = "You're ready to begin with the 7-Day Wheelchair Strength Starter Kit.";
    ctaType = "start_starter_kit";
  } else if (totalScore >= 25) {
    pathway = "START_STRONG_CAUTION";
    reason =
      "You're ready to begin cautiously. We recommend starting with the Starter Kit alongside a discovery call so a coach can guide your first steps.";
    ctaType = "start_starter_kit_with_discovery_call";
  } else {
    pathway = "CONSULT_PROFESSIONAL";
    reason =
      "Your readiness score suggests it's safer to get professional guidance or a coach review before starting structured training.";
    ctaType = "consult_professional";
    automaticProgressionAllowed = false;
  }

  return {
    totalScore,
    redFlagExists,
    pathway,
    reason,
    ctaType,
    automaticProgressionAllowed,
    showCorporateCta: answers.corporateInterest,
    showEliteCta: answers.eliteInterest && !redFlagExists,
  };
}

// Where each pathway/CTA sends the user — the explicit "connect the right
// button to the right page" requirement. Kept alongside the scoring logic
// so the mapping can never drift from the pathway that produced it.
export const PATHWAY_DESTINATION: Record<PathwayResult, { href: string; label: string }> = {
  START_STRONG: { href: "/programs/starter-kit", label: "Start the 7-Day Starter Kit" },
  START_STRONG_CAUTION: { href: "/programs/starter-kit", label: "Start the 7-Day Starter Kit" },
  BUILD_STRENGTH: { href: "/programs", label: "Explore the 12-Week Program" },
  LIVE_LIMITLESS: { href: "/programs/elite-mentorship", label: "Explore Elite Mentorship" },
  CORPORATE_INCLUSIVE_WELLNESS: { href: "/partner-with-us", label: "Explore Corporate Wellness" },
  CONSULT_PROFESSIONAL: { href: "/medical-disclaimer", label: "Read Safety Guidance" },
};

export const PATHWAY_LABELS: Record<PathwayResult, string> = {
  START_STRONG: "Start Strong",
  START_STRONG_CAUTION: "Start Strong (with caution)",
  BUILD_STRENGTH: "Build Strength",
  LIVE_LIMITLESS: "Live Limitless",
  CORPORATE_INCLUSIVE_WELLNESS: "Corporate Inclusive Wellness",
  CONSULT_PROFESSIONAL: "Consult Professional Before Starting",
};
