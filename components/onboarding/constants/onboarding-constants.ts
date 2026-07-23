export const ONBOARDING_FORM_KEYS = {
  1: ["name", "email", "country", "phone"] as const,
  2: ["weight", "height", "dateOfBirth", "gender", "activityLevel"] as const,
  3: ["neck", "waist", "hips"] as const,
  4: ["medicalConditionAffectsTraining", "medicalClearance", "safetyAcknowledged"] as const,
  5: [] as const, // Review step - no new fields
} as const;

export const ONBOARDING_STEPS = [
  { id: 1, title: 'Basic Information', description: 'Tell us about yourself' },
  { id: 2, title: 'Body Metrics', description: 'Your fitness baseline' },
  { id: 3, title: 'Body Measurements', description: 'Optional measurements' },
  { id: 4, title: 'Safety Check', description: 'Help your coach train you safely' },
  { id: 5, title: 'Review & Complete', description: 'Confirm your details' }
] as const;