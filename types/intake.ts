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

// Pathways that go through the full personal-coaching intake (Adaptive Training
// Profile, Health & Safety, Nutrition, Goals, Additional Context).
export const PERSONAL_TRACK_PATHWAYS: EnquiryPathway[] = [
  "personal",
  "family",
  "sponsored_support",
  "referred_candidate",
];

export interface ContactDetails {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  socialPlatform?: string;
  socialUrl?: string;
}

export type PrimaryTrainingContext =
  | "wheelchair_user"
  | "limited_walking"
  | "general_fitness"
  | "other_consideration";

export interface AdaptiveTrainingProfile {
  primaryContext?: PrimaryTrainingContext;
  wheelchairDetails: string[];
  spinaBifidaDetails: string[];
  wheelchairConsiderations: string[];
  limitedWalkingDetails: string[];
  generalFitnessDetails: string[];
  otherDescription?: string;
}

export type HealthCategory =
  | "kidney_renal"
  | "diabetes_metabolic"
  | "heart_bp"
  | "respiratory"
  | "neurological"
  | "bone_joint_pain"
  | "digestive"
  | "recent_surgery"
  | "none_known"
  | "other";

export interface HealthSafetyScreening {
  categories: HealthCategory[];
  kidneyDetails: string[];
  diabetesDetails: string[];
  heartDetails: string[];
  neurologicalDetails: string[];
  boneJointDetails: string[];
  otherHealthDescription?: string;
  urgentFlags: string[];
}

export interface NutritionContext {
  baseOptions: string[];
  renalOptions: string[];
  diabetesOptions: string[];
}

export interface CoachingGoals {
  goals: string[];
  confidenceLevel?: string;
  consistency?: string;
  additionalContext?: string;
}

export interface CorporateDetails {
  organizationName: string;
  role: string;
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
  adaptiveTrainingProfile?: AdaptiveTrainingProfile;
  healthSafety?: HealthSafetyScreening;
  nutrition?: NutritionContext;
  goals?: CoachingGoals;
  corporate?: CorporateDetails;
  referral?: ReferralDetails;
  sponsor?: SponsorDetails;
  general?: GeneralEnquiryDetails;
  region?: string;
  plan?: string;
  sourcePage?: string;
}
