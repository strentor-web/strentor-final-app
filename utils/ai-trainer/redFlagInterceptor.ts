// Deterministic safety gate for the AI trainer (Phase 2). Runs BEFORE any
// message reaches the LLM. If a red-flag symptom is detected, the AI never
// sees the message — the conversation is short-circuited with a fixed
// safety response, same category values used by the assessment and
// trackers (see utils/assessment/scoring.ts RED_FLAG_OPTIONS), so a flag
// raised in chat shows up identically in the admin safety queue.
//
// Deliberately keyword/phrase-based, not AI-judged: catching "chest pain"
// must not depend on a model's mood that day. Matches specific red-flag
// phrasing (sharp/electric pain, chest pain, numbness, dizziness,
// breathlessness, wounds, neurological symptoms) — NOT generic mentions
// of "pain" or "tired", which are normal, expected fitness-coaching
// conversation and must not trip the interceptor.

export type RedFlagCategory =
  | "sharp_pain"
  | "numbness_weakness"
  | "neurological"
  | "dizziness_fainting"
  | "chest_pain_breathlessness"
  | "severe_fatigue"
  | "wound_pressure_sore"
  | "recurring_pain";

const RED_FLAG_PATTERNS: Record<RedFlagCategory, RegExp[]> = {
  sharp_pain: [/\bsharp pain\b/i, /\bshooting pain\b/i, /\bstabbing pain\b/i, /\belectric(?:al)? (?:pain|shock)\b/i],
  numbness_weakness: [/\bnumb(?:ness)?\b/i, /\bcan'?t feel (?:my|it)\b/i, /\b(?:sudden|new|unusual) weakness\b/i, /\b(?:arm|leg|hand|foot) feels weak\b/i],
  neurological: [/\btingling\b/i, /\bpins and needles\b/i, /\bloss of coordination\b/i, /\bslurred speech\b/i, /\b(?:vision loss|blurred vision)\b/i],
  dizziness_fainting: [/\bdizz(?:y|iness)\b/i, /\blight ?headed\b/i, /\bfaint(?:ed|ing)?\b/i, /\bpassed out\b/i, /\bblacked out\b/i],
  chest_pain_breathlessness: [/\bchest (?:pain|tightness|pressure)\b/i, /\bcan'?t breathe\b/i, /\bshort(?:ness)? of breath\b/i, /\bbreathless\b/i],
  severe_fatigue: [/\bextremely exhausted\b/i, /\bcrash(?:ed)? after\b/i, /\bcan'?t get out of bed\b/i, /\bsevere fatigue\b/i, /\bcompletely wiped out\b/i],
  wound_pressure_sore: [/\bpressure sore\b/i, /\bopen wound\b/i, /\bskin breakdown\b/i, /\bbed ?sore\b/i, /\bwound (?:won'?t|wont) heal\b/i],
  recurring_pain: [/\bkeeps hurting\b/i, /\bpain (?:every time|comes back)\b/i, /\brecurring pain\b/i, /\bpain (?:won'?t|wont) go away\b/i],
};

export interface RedFlagInterceptResult {
  intercepted: boolean;
  matchedCategories: RedFlagCategory[];
}

export function interceptRedFlags(message: string): RedFlagInterceptResult {
  const matchedCategories: RedFlagCategory[] = [];

  for (const [category, patterns] of Object.entries(RED_FLAG_PATTERNS) as [RedFlagCategory, RegExp[]][]) {
    if (patterns.some((pattern) => pattern.test(message))) {
      matchedCategories.push(category);
    }
  }

  return { intercepted: matchedCategories.length > 0, matchedCategories };
}

export const RED_FLAG_SAFETY_RESPONSE =
  "Pause this activity. Your message mentions something that may need professional guidance or coach review before continuing. " +
  "This isn't something I can advise on — a STRENTOR coach has been notified and will follow up. " +
  "If this feels urgent, please contact your local emergency services or medical provider now.";
