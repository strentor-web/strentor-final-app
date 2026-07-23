export type EnquiryPathway =
  | "personal"
  | "family"
  | "corporate"
  | "referral"
  | "sponsor"
  | "sponsored_support"
  | "referred_candidate"
  | "general";

export const PATHWAY_LABELS: Record<EnquiryPathway, string> = {
  personal: "Personal adaptive coaching enquiry",
  family: "Family or caregiver enquiry",
  corporate: "Corporate / CSR / NGO partnership",
  referral: "Professional referral",
  sponsor: "Pay It Forward sponsorship enquiry",
  sponsored_support: "Sponsored coaching support application",
  referred_candidate: "Referred candidate enquiry",
  general: "General enquiry",
};

// Pathways that go through the full STRENTOR Adaptive Strength Intake Form
// (coaching context, movement profile, health boundaries, recovery &
// nutrition, optional adaptive specialist notes, goals & identity).
export const PERSONAL_TRACK_PATHWAYS: EnquiryPathway[] = [
  "personal",
  "family",
  "sponsored_support",
  "referred_candidate",
];

export interface ContactDetails {
  fullName: string;
  age?: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  socialPlatform?: string;
  socialUrl?: string;
  // Extra fields from the STRENTOR Adaptive Strength Intake Form (Section 1)
  // — only collected on the personal-coaching track.
  preferredName?: string;
  height?: string;
  weight?: string;
  emergencyContact?: string;
  preferredContactMethod?: string[];
}

// Section 2 — Coaching context and goals
export interface CoachingContext {
  primaryFocus: string[];
  trainingExperience?: string;
  movementContext?: string;
  coachingFormat?: string;
  supportNeeded: string[];
  successVision?: string;
  biggestBarrier?: string;
}

// Section 3 — Movement, mobility, pain, and daily function
export interface MovementProfile {
  dailyMovement?: string;
  transferDifficulty?: string;
  shoulderNeckBackPain?: string;
  balanceFallConcern?: string;
  fatigueLevel?: string;
  painTriggersKnown?: string;
  assistiveDevice?: string;
  caregiverSupport?: string;
  painTriggerDescription?: string;
}

// Section 4 — Health boundaries and care-team guidance
export interface HealthBoundaries {
  medicalConditionAffectsTraining?: string;
  medicalClearance?: string;
  cardioMetabolicConcerns?: string;
  kidneyBladderConcerns?: string;
  woundSkinConcern?: string;
  medicationConsiderations?: string;
  allergyConsiderations?: string;
  careTeamRestrictions?: string;
}

// Section 5 — Recovery, nutrition, and lifestyle routine
export interface RecoveryNutritionProfile {
  sleepQuality?: string;
  mealPattern?: string;
  appetite?: string;
  hydrationInstructions?: string;
  dietInstructions?: string;
  supplementsUsed?: string;
  routineConsistency?: string;
  supplementsDescription?: string;
}

// Section 6 — Optional adaptive specialist notes
export interface AdaptiveSpecialistNotes {
  pressureInjuryHistory?: string;
  reducedSensation?: string;
  catheterBladderBowelRoutine?: string;
  dialysisCkdInstructions?: string;
  neurologicalShuntMonitoring?: string;
}

// Section 7 — Goals, identity, and coaching fit
export interface GoalsIdentity {
  topOutcomes?: string;
  whatToKnow?: string;
  coachingStyle?: string;
  whatNotToPush?: string;
}

export interface CorporateDetails {
  organizationName: string;
  role: string;
  /** Which Workshop & Pilot Program Options (INR) tier the enquiry is about — see config/partnerPricing.ts. */
  interestedOption?: string;
  organizationWebsite?: string;
  audienceSize?: string;
  programObjective?: string;
  budgetRange?: string;
  preferredFormat?: string;
  location?: string;
  timeline?: string;
  additionalContext?: string;
}

export interface ReferralDetails {
  referrerName: string;
  referrerRole: string;
  candidateName: string;
  candidateContact?: string;
  referralContext?: string;
  relevantInfo?: string;
  consentConfirmed: boolean;
  additionalContext?: string;
}

export interface SponsorDetails {
  sponsorshipObjective?: string;
  sponsorshipRange?: string;
  hasSpecificCandidate: boolean;
  candidateDetails?: string;
  sponsorType?: "individual" | "corporate";
  preferredFormat?: string;
  additionalContext?: string;
}

export interface GeneralEnquiryDetails {
  message: string;
}

export interface IntakeFormPayload {
  pathway: EnquiryPathway;
  contact: ContactDetails;
  coachingContext?: CoachingContext;
  movementProfile?: MovementProfile;
  healthBoundaries?: HealthBoundaries;
  recoveryNutrition?: RecoveryNutritionProfile;
  adaptiveSpecialistNotes?: AdaptiveSpecialistNotes;
  goalsIdentity?: GoalsIdentity;
  /** Typed e-signature (full name) for Section 8 — Consent and acknowledgement. */
  signatureName?: string;
  corporate?: CorporateDetails;
  referral?: ReferralDetails;
  sponsor?: SponsorDetails;
  general?: GeneralEnquiryDetails;
  region?: string;
  plan?: string;
  sourcePage?: string;
  consent: boolean;
  submittedAt: string;
}
