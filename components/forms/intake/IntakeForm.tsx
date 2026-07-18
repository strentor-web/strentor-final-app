"use client"

import { useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import { ErrorSummary, LoadingState, SuccessMessage } from "@/components/forms/intake/IntakeFormFeedback"
import {
  AdaptiveTrainingProfile,
  ContactDetails,
  CoachingGoals,
  CorporateDetails,
  EnquiryPathway,
  GeneralEnquiryDetails,
  HealthCategory,
  HealthSafetyScreening,
  IntakeFormPayload,
  NutritionContext,
  PATHWAY_LABELS,
  PERSONAL_TRACK_PATHWAYS,
  PrimaryTrainingContext,
  ReferralDetails,
  SponsorDetails,
} from "@/types/intake"

const PATHWAY_ORDER: EnquiryPathway[] = [
  "personal",
  "family",
  "corporate",
  "referral",
  "sponsor",
  "sponsored_support",
  "referred_candidate",
  "general",
]

function CheckboxGroup({
  options,
  selected,
  onToggle,
}: {
  options: { value: string; label: string }[]
  selected: string[]
  onToggle: (value: string) => void
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 text-sm cursor-pointer hover:border-[#C9A96A]"
        >
          <Checkbox
            checked={selected.includes(option.value)}
            onCheckedChange={() => onToggle(option.value)}
          />
          <span className="text-card-foreground">{option.label}</span>
        </label>
      ))}
    </div>
  )
}

function toggleValue(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

const HEALTH_CATEGORY_OPTIONS: { value: HealthCategory; label: string }[] = [
  { value: "kidney_renal", label: "Kidney / renal health" },
  { value: "diabetes_metabolic", label: "Diabetes / metabolic health" },
  { value: "heart_bp", label: "Heart health / blood pressure" },
  { value: "respiratory", label: "Respiratory health" },
  { value: "neurological", label: "Neurological health" },
  { value: "bone_joint_pain", label: "Bone, joint, or pain concern" },
  { value: "digestive", label: "Digestive health / food tolerance" },
  { value: "recent_surgery", label: "Recent surgery / medical clearance" },
  { value: "none_known", label: "None known" },
  { value: "other", label: "Other" },
]

const emptyContact: ContactDetails = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  country: "",
}

const emptyTrainingProfile: AdaptiveTrainingProfile = {
  wheelchairDetails: [],
  spinaBifidaDetails: [],
  wheelchairConsiderations: [],
  limitedWalkingDetails: [],
  generalFitnessDetails: [],
}

const emptyHealthSafety: HealthSafetyScreening = {
  categories: [],
  kidneyDetails: [],
  diabetesDetails: [],
  heartDetails: [],
  respiratoryDetails: [],
  neurologicalDetails: [],
  boneJointDetails: [],
  digestiveDetails: [],
  recentSurgeryDetails: [],
  urgentFlags: [],
}

const emptyNutrition: NutritionContext = {
  baseOptions: [],
  renalOptions: [],
  diabetesOptions: [],
  dietType: [],
}

const emptyGoals: CoachingGoals = { goals: [] }

const emptyCorporate: CorporateDetails = { organizationName: "", role: "" }

const emptyReferral: ReferralDetails = {
  referrerName: "",
  referrerRole: "",
  candidateName: "",
  consentConfirmed: false,
}

const emptySponsor: SponsorDetails = { hasSpecificCandidate: false }

const emptyGeneral: GeneralEnquiryDetails = { message: "" }

interface IntakeFormProps {
  initialPathway?: EnquiryPathway
  region?: string
  plan?: string
  sourcePage?: string
  onPathwayChange?: (pathway: EnquiryPathway | undefined) => void
}

export function IntakeForm({ initialPathway, region, plan, sourcePage, onPathwayChange }: IntakeFormProps) {
  const [pathway, setPathwayState] = useState<EnquiryPathway | undefined>(initialPathway)
  const setPathway = (value: EnquiryPathway | undefined) => {
    setPathwayState(value)
    onPathwayChange?.(value)
  }
  // Skip the "what brings you here?" step when the page already told us —
  // e.g. arriving from /corporate shouldn't re-ask what's already known.
  const [stepIndex, setStepIndex] = useState(initialPathway ? 1 : 0)
  const [contact, setContact] = useState<ContactDetails>(emptyContact)
  const [training, setTraining] = useState<AdaptiveTrainingProfile>(emptyTrainingProfile)
  const [health, setHealth] = useState<HealthSafetyScreening>(emptyHealthSafety)
  const [nutrition, setNutrition] = useState<NutritionContext>(emptyNutrition)
  const [goals, setGoals] = useState<CoachingGoals>(emptyGoals)
  const [corporate, setCorporate] = useState<CorporateDetails>(emptyCorporate)
  const [referral, setReferral] = useState<ReferralDetails>(emptyReferral)
  const [sponsor, setSponsor] = useState<SponsorDetails>(emptySponsor)
  const [general, setGeneral] = useState<GeneralEnquiryDetails>(emptyGeneral)
  const [honeypot, setHoneypot] = useState("")
  const [consent, setConsent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const lastSubmissionRef = useRef(0)

  const steps = useMemo(() => {
    if (!pathway) return ["pathway"]
    if (pathway === "corporate") return ["pathway", "contact", "corporate", "review"]
    if (pathway === "referral") return ["pathway", "contact", "referral", "review"]
    if (pathway === "sponsor") return ["pathway", "contact", "sponsor", "review"]
    if (pathway === "general") return ["pathway", "contact", "general", "review"]
    if (PERSONAL_TRACK_PATHWAYS.includes(pathway)) {
      return ["pathway", "contact", "training", "health", "nutrition", "goals", "review"]
    }
    return ["pathway"]
  }, [pathway])

  const currentStep = steps[stepIndex]

  const goNext = () => setStepIndex((i) => Math.min(i + 1, steps.length - 1))
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0))

  const handleSelectPathway = (value: EnquiryPathway) => {
    setPathway(value)
    setStepIndex(1)
  }

  const contactValid =
    contact.fullName.trim() && contact.email.trim() && contact.phone.trim() && contact.city.trim() && contact.country.trim()

  const showKidney = health.categories.includes("kidney_renal")
  const showDiabetes = health.categories.includes("diabetes_metabolic")
  const showHeart = health.categories.includes("heart_bp")
  const showRespiratory = health.categories.includes("respiratory")
  const showNeuro = health.categories.includes("neurological")
  const showBoneJoint = health.categories.includes("bone_joint_pain")
  const showDigestive = health.categories.includes("digestive")
  const showRecentSurgery = health.categories.includes("recent_surgery")

  async function handleSubmit() {
    if (!pathway || !consent) return
    if (honeypot.trim().length > 0) {
      // Silently drop bot submissions without revealing the honeypot to the user.
      setSubmitted(true)
      return
    }
    // Guard against accidental double-clicks / double form-submits.
    const now = Date.now()
    if (isSubmitting || now - lastSubmissionRef.current < 5000) return
    lastSubmissionRef.current = now

    setSubmitError(null)
    setIsSubmitting(true)
    try {
      const payload: IntakeFormPayload = {
        pathway,
        contact,
        region,
        plan,
        sourcePage,
        consent,
        submittedAt: new Date().toISOString(),
      }
      if (PERSONAL_TRACK_PATHWAYS.includes(pathway)) {
        payload.adaptiveTrainingProfile = training
        payload.healthSafety = health
        payload.nutrition = nutrition
        payload.goals = goals
      } else if (pathway === "corporate") {
        payload.corporate = corporate
      } else if (pathway === "referral") {
        payload.referral = referral
      } else if (pathway === "sponsor") {
        payload.sponsor = sponsor
      } else if (pathway === "general") {
        payload.general = general
      }

      const res = await fetch("/api/intake/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.status === 429) {
        throw new Error("Too many submissions. Please wait a moment and try again.")
      }
      if (!res.ok) {
        throw new Error("Submission failed")
      }

      setSubmitted(true)
    } catch (error) {
      const message =
        error instanceof Error && error.message.includes("Too many submissions")
          ? error.message
          : "Something went wrong sending your enquiry. Please try again, or email hello@strentor.com directly."
      setSubmitError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return <SuccessMessage />
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      {/* Honeypot field — hidden from real users, bots often fill every field */}
      <input
        type="text"
        name="company_website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {currentStep === "pathway" && (
        <div>
          <h2 className="text-xl font-bold text-card-foreground">What brings you here?</h2>
          <p className="mt-1 text-sm text-muted-foreground">Choose the option that best describes your enquiry.</p>
          <div className="mt-6 grid gap-3">
            {PATHWAY_ORDER.map((value) => (
              <button
                key={value}
                onClick={() => handleSelectPathway(value)}
                className="rounded-lg border border-border bg-background p-4 text-left text-sm font-semibold text-foreground transition-colors hover:border-[#C9A96A] hover:bg-[#C9A96A]/5"
              >
                {PATHWAY_LABELS[value]}
              </button>
            ))}
          </div>
        </div>
      )}

      {currentStep === "contact" && (
        <div>
          <h2 className="text-xl font-bold text-card-foreground">Your contact details</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 text-left">
            <div className="sm:col-span-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" value={contact.fullName} onChange={(e) => setContact({ ...contact, fullName: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="phone">Phone / WhatsApp</Label>
              <Input id="phone" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" value={contact.city} onChange={(e) => setContact({ ...contact, city: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input id="country" value={contact.country} onChange={(e) => setContact({ ...contact, country: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="socialUrl">Social or professional profile (optional)</Label>
              <Input
                id="socialUrl"
                placeholder="https://..."
                value={contact.socialUrl || ""}
                onChange={(e) => setContact({ ...contact, socialUrl: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={goBack}>Back</Button>
            <Button disabled={!contactValid} onClick={goNext}>Continue</Button>
          </div>
        </div>
      )}

      {currentStep === "training" && (
        <div className="text-left">
          <h2 className="text-xl font-bold text-card-foreground">Adaptive Training Profile</h2>
          <p className="mt-1 text-sm text-muted-foreground">This helps us understand your training context.</p>

          <div className="mt-6">
            <Label>Primary training context</Label>
            <RadioGroup
              className="mt-3 grid gap-3 sm:grid-cols-2"
              value={training.primaryContext}
              onValueChange={(v) => setTraining({ ...training, primaryContext: v as PrimaryTrainingContext })}
            >
              {[
                { value: "wheelchair_user", label: "Wheelchair user" },
                { value: "limited_walking", label: "Limited walking or assisted mobility" },
                { value: "general_fitness", label: "General fitness and transformation" },
                { value: "other_consideration", label: "Other physical or health consideration" },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 rounded-lg border border-border bg-background p-3 text-sm cursor-pointer hover:border-[#C9A96A]">
                  <RadioGroupItem value={opt.value} />
                  <span>{opt.label}</span>
                </label>
              ))}
            </RadioGroup>
          </div>

          {training.primaryContext === "wheelchair_user" && (
            <div className="mt-6 space-y-6">
              <div>
                <Label>Wheelchair use details</Label>
                <div className="mt-3">
                  <CheckboxGroup
                    options={[
                      { value: "manual_wheelchair", label: "Manual wheelchair user" },
                      { value: "power_wheelchair", label: "Power wheelchair user" },
                      { value: "paraplegia", label: "Paraplegia" },
                      { value: "quadriplegia", label: "Quadriplegia / Tetraplegia" },
                      { value: "spina_bifida", label: "Spina Bifida" },
                      { value: "spinal_cord_injury", label: "Spinal cord injury" },
                      { value: "transfer_assistance", label: "Transfer assistance needed" },
                      { value: "upper_body_dominant", label: "Upper-body dominant training" },
                      { value: "pressure_sore_risk", label: "Pressure sore risk" },
                      { value: "shoulder_strain", label: "Shoulder strain from transfers or wheelchair use" },
                    ]}
                    selected={training.wheelchairDetails}
                    onToggle={(v) => setTraining({ ...training, wheelchairDetails: toggleValue(training.wheelchairDetails, v) })}
                  />
                </div>
              </div>

              {training.wheelchairDetails.includes("spina_bifida") && (
                <div>
                  <Label>Spina Bifida — additional details</Label>
                  <div className="mt-3">
                    <CheckboxGroup
                      options={[
                        { value: "hydrocephalus_shunt", label: "Hydrocephalus or shunt history" },
                        { value: "bladder_bowel_routine", label: "Bladder or bowel routine considerations" },
                        { value: "reduced_sensation", label: "Reduced sensation" },
                        { value: "latex_allergy", label: "Latex allergy" },
                        { value: "tethered_cord", label: "Tethered cord history" },
                        { value: "surgery_history", label: "Relevant surgery history" },
                        { value: "doctor_restrictions", label: "Doctor-advised restrictions" },
                      ]}
                      selected={training.spinaBifidaDetails}
                      onToggle={(v) => setTraining({ ...training, spinaBifidaDetails: toggleValue(training.spinaBifidaDetails, v) })}
                    />
                  </div>
                </div>
              )}

              <div>
                <Label>Wheelchair considerations</Label>
                <div className="mt-3">
                  <CheckboxGroup
                    options={[
                      { value: "transfer_ability", label: "Transfer ability" },
                      { value: "shoulder_pain", label: "Shoulder pain" },
                      { value: "propulsion_strain", label: "Propulsion strain" },
                      { value: "skin_pressure", label: "Skin pressure concerns" },
                      { value: "seating_concerns", label: "Seating concerns" },
                      { value: "assistance_required", label: "Assistance required" },
                      { value: "fistula_arm", label: "Fistula arm or access limitations" },
                    ]}
                    selected={training.wheelchairConsiderations}
                    onToggle={(v) => setTraining({ ...training, wheelchairConsiderations: toggleValue(training.wheelchairConsiderations, v) })}
                  />
                </div>
              </div>
            </div>
          )}

          {training.primaryContext === "limited_walking" && (
            <div className="mt-6">
              <Label>Details</Label>
              <div className="mt-3">
                <CheckboxGroup
                  options={[
                    { value: "cane_walker_crutches", label: "Uses cane, walker, or crutches" },
                    { value: "limited_distance", label: "Limited walking distance" },
                    { value: "balance_risk", label: "Balance risk" },
                    { value: "fall_risk", label: "Fall risk" },
                    { value: "cerebral_palsy", label: "Cerebral palsy" },
                    { value: "stroke_history", label: "Stroke history" },
                    { value: "multiple_sclerosis", label: "Multiple sclerosis" },
                    { value: "amputation", label: "Amputation" },
                    { value: "limb_difference", label: "Limb difference" },
                    { value: "arthritis", label: "Arthritis" },
                    { value: "joint_limitation", label: "Joint limitation" },
                  ]}
                  selected={training.limitedWalkingDetails}
                  onToggle={(v) => setTraining({ ...training, limitedWalkingDetails: toggleValue(training.limitedWalkingDetails, v) })}
                />
              </div>
            </div>
          )}

          {training.primaryContext === "general_fitness" && (
            <div className="mt-6">
              <Label>Details</Label>
              <div className="mt-3">
                <CheckboxGroup
                  options={[
                    { value: "beginner", label: "Beginner" },
                    { value: "returning_after_gap", label: "Returning after a long gap" },
                    { value: "currently_active", label: "Currently active" },
                    { value: "low_stamina", label: "Low stamina" },
                    { value: "high_fatigue", label: "High fatigue" },
                    { value: "chronic_pain", label: "Chronic pain" },
                    { value: "fat_loss_goal", label: "Fat-loss goal" },
                    { value: "muscle_gain_goal", label: "Muscle-gain goal" },
                  ]}
                  selected={training.generalFitnessDetails}
                  onToggle={(v) => setTraining({ ...training, generalFitnessDetails: toggleValue(training.generalFitnessDetails, v) })}
                />
              </div>
            </div>
          )}

          {training.primaryContext === "other_consideration" && (
            <div className="mt-6">
              <Label htmlFor="otherDescription">Tell us more</Label>
              <Textarea
                id="otherDescription"
                value={training.otherDescription || ""}
                onChange={(e) => setTraining({ ...training, otherDescription: e.target.value })}
              />
            </div>
          )}

          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={goBack}>Back</Button>
            <Button onClick={goNext}>Continue</Button>
          </div>
        </div>
      )}

      {currentStep === "health" && (
        <div className="text-left">
          <h2 className="text-xl font-bold text-card-foreground">Health &amp; Safety Screening</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This is not a diagnosis — it just helps us coach you safely. STRENTOR is fitness coaching, not medical care.
          </p>

          <div className="mt-6">
            <Label>Relevant health categories</Label>
            <div className="mt-3">
              <CheckboxGroup
                options={HEALTH_CATEGORY_OPTIONS}
                selected={health.categories}
                onToggle={(v) => setHealth({ ...health, categories: toggleValue(health.categories, v) as HealthCategory[] })}
              />
            </div>
          </div>

          {showKidney && (
            <div className="mt-6">
              <Label>Kidney / renal details</Label>
              <div className="mt-3">
                <CheckboxGroup
                  options={[
                    { value: "ckd", label: "Chronic Kidney Disease" },
                    { value: "dialysis", label: "Dialysis" },
                    { value: "transplant_history", label: "Kidney transplant history" },
                    { value: "fluid_restriction", label: "Fluid restriction" },
                    { value: "potassium_restriction", label: "Potassium restriction" },
                    { value: "phosphorus_restriction", label: "Phosphorus restriction" },
                    { value: "renal_diet_guidance", label: "Renal diet guidance" },
                    { value: "fistula_precautions", label: "Fistula or access precautions" },
                    { value: "dialysis_schedule", label: "Dialysis schedule" },
                    { value: "doctor_clearance_status", label: "Doctor clearance status" },
                    { value: "fatigue_after_dialysis", label: "Fatigue after dialysis" },
                    { value: "blood_pressure_concerns", label: "Blood pressure concerns" },
                    { value: "anaemia", label: "Anaemia" },
                    { value: "cramping", label: "Cramping" },
                    { value: "fluid_management_concerns", label: "Fluid-management concerns" },
                  ]}
                  selected={health.kidneyDetails}
                  onToggle={(v) => setHealth({ ...health, kidneyDetails: toggleValue(health.kidneyDetails, v) })}
                />
              </div>
            </div>
          )}

          {showDiabetes && (
            <div className="mt-6">
              <Label>Diabetes details</Label>
              <div className="mt-3">
                <CheckboxGroup
                  options={[
                    { value: "type1", label: "Type 1 diabetes" },
                    { value: "type2", label: "Type 2 diabetes" },
                    { value: "insulin", label: "Insulin use" },
                    { value: "medication", label: "Medication use" },
                    { value: "frequent_lows", label: "Frequent low blood sugar" },
                    { value: "frequent_highs", label: "Frequent high blood sugar" },
                    { value: "glucose_monitor", label: "Glucose monitor use" },
                    { value: "workout_glucose_risk", label: "Workout glucose risks" },
                    { value: "diabetic_neuropathy", label: "Neuropathy" },
                    { value: "foot_care_concerns", label: "Foot-care concerns" },
                  ]}
                  selected={health.diabetesDetails}
                  onToggle={(v) => setHealth({ ...health, diabetesDetails: toggleValue(health.diabetesDetails, v) })}
                />
              </div>
            </div>
          )}

          {showHeart && (
            <div className="mt-6">
              <Label>Heart / blood pressure details</Label>
              <div className="mt-3">
                <CheckboxGroup
                  options={[
                    { value: "hypertension", label: "Hypertension" },
                    { value: "heart_condition", label: "Heart condition" },
                    { value: "high_cholesterol", label: "High cholesterol" },
                    { value: "chest_pain_history", label: "Chest pain history" },
                    { value: "blood_thinner", label: "Blood thinner" },
                    { value: "cardiac_medication", label: "Cardiac medication" },
                    { value: "exercise_clearance", label: "Exercise clearance" },
                  ]}
                  selected={health.heartDetails}
                  onToggle={(v) => setHealth({ ...health, heartDetails: toggleValue(health.heartDetails, v) })}
                />
              </div>
            </div>
          )}

          {showRespiratory && (
            <div className="mt-6">
              <Label>Respiratory details</Label>
              <div className="mt-3">
                <CheckboxGroup
                  options={[
                    { value: "asthma", label: "Asthma" },
                    { value: "copd", label: "COPD" },
                    { value: "breathing_limitation", label: "Breathing limitation" },
                    { value: "low_oxygen", label: "Low oxygen levels" },
                    { value: "respiratory_support", label: "Uses respiratory support (e.g. inhaler, oxygen)" },
                  ]}
                  selected={health.respiratoryDetails}
                  onToggle={(v) => setHealth({ ...health, respiratoryDetails: toggleValue(health.respiratoryDetails, v) })}
                />
              </div>
            </div>
          )}

          {showNeuro && (
            <div className="mt-6">
              <Label>Neurological details</Label>
              <div className="mt-3">
                <CheckboxGroup
                  options={[
                    { value: "seizure_history", label: "Seizure history" },
                    { value: "neuropathy", label: "Neuropathy" },
                    { value: "spasticity", label: "Spasticity" },
                    { value: "nerve_pain", label: "Nerve pain" },
                    { value: "tingling", label: "Tingling" },
                    { value: "numbness", label: "Numbness" },
                    { value: "hydrocephalus", label: "Hydrocephalus" },
                    { value: "shunt_history", label: "Shunt history" },
                  ]}
                  selected={health.neurologicalDetails}
                  onToggle={(v) => setHealth({ ...health, neurologicalDetails: toggleValue(health.neurologicalDetails, v) })}
                />
              </div>
            </div>
          )}

          {showBoneJoint && (
            <div className="mt-6">
              <Label>Bone / joint / pain details</Label>
              <div className="mt-3">
                <CheckboxGroup
                  options={[
                    { value: "frozen_shoulder", label: "Frozen shoulder" },
                    { value: "shoulder_pain", label: "Shoulder pain" },
                    { value: "back_pain", label: "Back pain" },
                    { value: "joint_pain", label: "Joint pain" },
                    { value: "arthritis", label: "Arthritis" },
                    { value: "osteoporosis", label: "Osteoporosis" },
                    { value: "recent_fracture", label: "Recent fracture" },
                    { value: "movement_restrictions", label: "Movement restrictions" },
                  ]}
                  selected={health.boneJointDetails}
                  onToggle={(v) => setHealth({ ...health, boneJointDetails: toggleValue(health.boneJointDetails, v) })}
                />
              </div>
            </div>
          )}

          {showDigestive && (
            <div className="mt-6">
              <Label>Digestive details</Label>
              <div className="mt-3">
                <CheckboxGroup
                  options={[
                    { value: "ibs", label: "Irritable bowel syndrome (IBS)" },
                    { value: "acid_reflux", label: "Acid reflux / GERD" },
                    { value: "food_intolerance", label: "Food intolerance" },
                    { value: "bowel_management", label: "Bowel management routine" },
                    { value: "digestive_medication", label: "Digestive medication" },
                  ]}
                  selected={health.digestiveDetails}
                  onToggle={(v) => setHealth({ ...health, digestiveDetails: toggleValue(health.digestiveDetails, v) })}
                />
              </div>
            </div>
          )}

          {showRecentSurgery && (
            <div className="mt-6">
              <Label>Recent surgery details</Label>
              <div className="mt-3">
                <CheckboxGroup
                  options={[
                    { value: "within_6_weeks", label: "Surgery within the last 6 weeks" },
                    { value: "orthopedic_surgery", label: "Orthopedic / joint surgery" },
                    { value: "abdominal_surgery", label: "Abdominal surgery" },
                    { value: "cardiac_surgery", label: "Cardiac surgery" },
                    { value: "medical_clearance_received", label: "Medical clearance already received" },
                    { value: "medical_clearance_pending", label: "Medical clearance still pending" },
                  ]}
                  selected={health.recentSurgeryDetails}
                  onToggle={(v) => setHealth({ ...health, recentSurgeryDetails: toggleValue(health.recentSurgeryDetails, v) })}
                />
              </div>
            </div>
          )}

          <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <Label className="text-destructive">Urgent safety flags</Label>
            <p className="mt-1 text-xs text-muted-foreground">Please flag any of the following that apply to you right now.</p>
            <div className="mt-3">
              <CheckboxGroup
                options={[
                  { value: "chest_pain_activity", label: "Chest pain during activity" },
                  { value: "dizziness_fainting", label: "Dizziness, fainting, or blackouts" },
                  { value: "unexplained_breathlessness", label: "Unexplained breathlessness" },
                  { value: "open_wound", label: "Open pressure sore or wound" },
                  { value: "recent_surgery_no_clearance", label: "Recent surgery without clearance" },
                  { value: "uncontrolled_bp", label: "Uncontrolled blood pressure" },
                  { value: "uncontrolled_sugar", label: "Uncontrolled blood sugar" },
                  { value: "severe_new_pain", label: "Severe new pain" },
                  { value: "none", label: "None of these" },
                ]}
                selected={health.urgentFlags}
                onToggle={(v) => setHealth({ ...health, urgentFlags: toggleValue(health.urgentFlags, v) })}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={goBack}>Back</Button>
            <Button onClick={goNext}>Continue</Button>
          </div>
        </div>
      )}

      {currentStep === "nutrition" && (
        <div className="text-left">
          <h2 className="text-xl font-bold text-card-foreground">Nutrition &amp; Diet Context</h2>
          <div className="mt-6">
            <CheckboxGroup
              options={[
                { value: "fat_loss", label: "Fat-loss nutrition support" },
                { value: "muscle_gain", label: "Muscle-gain nutrition support" },
                { value: "healthy_weight_gain", label: "Healthy weight-gain support" },
                { value: "protein_planning", label: "Protein planning" },
                { value: "meal_timing", label: "Meal timing" },
                { value: "appetite_improvement", label: "Appetite improvement" },
                { value: "food_restriction_management", label: "Food restriction management" },
                { value: "no_support_needed", label: "No nutrition support needed" },
              ]}
              selected={nutrition.baseOptions}
              onToggle={(v) => setNutrition({ ...nutrition, baseOptions: toggleValue(nutrition.baseOptions, v) })}
            />
          </div>

          <div className="mt-6">
            <Label>Diet type</Label>
            <div className="mt-3">
              <CheckboxGroup
                options={[
                  { value: "vegetarian", label: "Vegetarian" },
                  { value: "eggetarian", label: "Eggetarian" },
                  { value: "non_vegetarian", label: "Non-vegetarian" },
                  { value: "vegan", label: "Vegan" },
                  { value: "mixed_diet", label: "Mixed diet" },
                  { value: "religious_cultural_preference", label: "Religious / cultural food preference" },
                  { value: "food_allergy", label: "Food allergy" },
                  { value: "food_intolerance", label: "Food intolerance" },
                  { value: "other", label: "Other" },
                ]}
                selected={nutrition.dietType}
                onToggle={(v) => setNutrition({ ...nutrition, dietType: toggleValue(nutrition.dietType, v) })}
              />
            </div>
          </div>

          {showKidney && (
            <div className="mt-6">
              <Label>Renal-aware nutrition</Label>
              <div className="mt-3">
                <CheckboxGroup
                  options={[
                    { value: "renal_aware", label: "Renal-aware nutrition" },
                    { value: "fluid_restriction_planning", label: "Fluid restriction planning" },
                    { value: "potassium_awareness", label: "Potassium awareness" },
                    { value: "phosphorus_awareness", label: "Phosphorus awareness" },
                    { value: "renal_protein_guidance", label: "Renal protein guidance" },
                    { value: "dialysis_protein_requirement", label: "Dialysis protein requirement" },
                    { value: "existing_dietitian_instructions", label: "Existing renal dietitian instructions" },
                  ]}
                  selected={nutrition.renalOptions}
                  onToggle={(v) => setNutrition({ ...nutrition, renalOptions: toggleValue(nutrition.renalOptions, v) })}
                />
              </div>
            </div>
          )}

          {showDiabetes && (
            <div className="mt-6">
              <Label>Diabetes-friendly nutrition</Label>
              <div className="mt-3">
                <CheckboxGroup
                  options={[
                    { value: "diabetes_friendly", label: "Diabetes-friendly nutrition" },
                    { value: "carb_management", label: "Carbohydrate management" },
                    { value: "blood_sugar_timing", label: "Blood sugar timing around workouts" },
                    { value: "hypoglycemia_risk", label: "Hypoglycemia risk" },
                    { value: "insulin_timing", label: "Insulin timing context" },
                  ]}
                  selected={nutrition.diabetesOptions}
                  onToggle={(v) => setNutrition({ ...nutrition, diabetesOptions: toggleValue(nutrition.diabetesOptions, v) })}
                />
              </div>
            </div>
          )}

          <p className="mt-6 text-xs text-muted-foreground">
            STRENTOR nutrition guidance does not replace a renal dietitian, doctor, or clinical nutrition professional.
          </p>

          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={goBack}>Back</Button>
            <Button onClick={goNext}>Continue</Button>
          </div>
        </div>
      )}

      {currentStep === "goals" && (
        <div className="text-left">
          <h2 className="text-xl font-bold text-card-foreground">Coaching Goals &amp; Readiness</h2>
          <div className="mt-6">
            <CheckboxGroup
              options={[
                { value: "strength", label: "Build strength" },
                { value: "confidence", label: "Build confidence" },
                { value: "discipline", label: "Build discipline and routine" },
                { value: "fat_loss", label: "Fat loss" },
                { value: "muscle_gain", label: "Muscle gain" },
                { value: "general_health", label: "General health and energy" },
              ]}
              selected={goals.goals}
              onToggle={(v) => setGoals({ ...goals, goals: toggleValue(goals.goals, v) })}
            />
          </div>
          <div className="mt-6">
            <Label htmlFor="additionalContext">Additional context (optional)</Label>
            <Textarea
              id="additionalContext"
              value={goals.additionalContext || ""}
              onChange={(e) => setGoals({ ...goals, additionalContext: e.target.value })}
              placeholder="Anything else you'd like us to know before your Fit Assessment."
            />
          </div>
          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={goBack}>Back</Button>
            <Button onClick={goNext}>Continue</Button>
          </div>
        </div>
      )}

      {currentStep === "corporate" && (
        <div className="text-left">
          <h2 className="text-xl font-bold text-card-foreground">Corporate / CSR / NGO Details</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="orgName">Organization name</Label>
              <Input id="orgName" value={corporate.organizationName} onChange={(e) => setCorporate({ ...corporate, organizationName: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="orgRole">Role or designation</Label>
              <Input id="orgRole" value={corporate.role} onChange={(e) => setCorporate({ ...corporate, role: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="orgWebsite">Organization website</Label>
              <Input id="orgWebsite" value={corporate.organizationWebsite || ""} onChange={(e) => setCorporate({ ...corporate, organizationWebsite: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="audienceSize">Audience or beneficiary size</Label>
              <Input id="audienceSize" value={corporate.audienceSize || ""} onChange={(e) => setCorporate({ ...corporate, audienceSize: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="budgetRange">Budget range</Label>
              <Input id="budgetRange" value={corporate.budgetRange || ""} onChange={(e) => setCorporate({ ...corporate, budgetRange: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="preferredFormat">Preferred program format</Label>
              <Input id="preferredFormat" value={corporate.preferredFormat || ""} onChange={(e) => setCorporate({ ...corporate, preferredFormat: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="corpLocation">Location</Label>
              <Input id="corpLocation" value={corporate.location || ""} onChange={(e) => setCorporate({ ...corporate, location: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="programObjective">Program objective</Label>
              <Textarea id="programObjective" value={corporate.programObjective || ""} onChange={(e) => setCorporate({ ...corporate, programObjective: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="timeline">Timeline</Label>
              <Input id="timeline" value={corporate.timeline || ""} onChange={(e) => setCorporate({ ...corporate, timeline: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="corpAdditional">Additional context (optional)</Label>
              <Textarea id="corpAdditional" value={corporate.additionalContext || ""} onChange={(e) => setCorporate({ ...corporate, additionalContext: e.target.value })} />
            </div>
          </div>
          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={goBack}>Back</Button>
            <Button onClick={goNext}>Continue</Button>
          </div>
        </div>
      )}

      {currentStep === "referral" && (
        <div className="text-left">
          <h2 className="text-xl font-bold text-card-foreground">Professional Referral Details</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="referrerName">Referrer name</Label>
              <Input id="referrerName" value={referral.referrerName} onChange={(e) => setReferral({ ...referral, referrerName: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="referrerRole">Professional role</Label>
              <Input id="referrerRole" value={referral.referrerRole} onChange={(e) => setReferral({ ...referral, referrerRole: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="candidateName">Candidate name</Label>
              <Input id="candidateName" value={referral.candidateName} onChange={(e) => setReferral({ ...referral, candidateName: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="candidateContact">Candidate contact (optional)</Label>
              <Input id="candidateContact" value={referral.candidateContact || ""} onChange={(e) => setReferral({ ...referral, candidateContact: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="referralContext">Referral context</Label>
              <Textarea id="referralContext" value={referral.referralContext || ""} onChange={(e) => setReferral({ ...referral, referralContext: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="relevantInfo">Relevant training and safety information</Label>
              <Textarea id="relevantInfo" value={referral.relevantInfo || ""} onChange={(e) => setReferral({ ...referral, relevantInfo: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="flex items-start gap-3 text-sm">
                <Checkbox
                  checked={referral.consentConfirmed}
                  onCheckedChange={(checked) => setReferral({ ...referral, consentConfirmed: checked === true })}
                />
                <span>I confirm the candidate has consented to this referral being made.</span>
              </label>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="referralAdditional">Additional context (optional)</Label>
              <Textarea id="referralAdditional" value={referral.additionalContext || ""} onChange={(e) => setReferral({ ...referral, additionalContext: e.target.value })} />
            </div>
          </div>
          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={goBack}>Back</Button>
            <Button disabled={!referral.consentConfirmed} onClick={goNext}>Continue</Button>
          </div>
        </div>
      )}

      {currentStep === "sponsor" && (
        <div className="text-left">
          <h2 className="text-xl font-bold text-card-foreground">Pay It Forward Sponsorship</h2>
          <div className="mt-6 grid gap-4">
            <div>
              <Label htmlFor="sponsorshipObjective">Sponsorship objective</Label>
              <Textarea id="sponsorshipObjective" value={sponsor.sponsorshipObjective || ""} onChange={(e) => setSponsor({ ...sponsor, sponsorshipObjective: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="sponsorshipRange">Sponsorship range</Label>
              <Input id="sponsorshipRange" value={sponsor.sponsorshipRange || ""} onChange={(e) => setSponsor({ ...sponsor, sponsorshipRange: e.target.value })} />
            </div>
            <div>
              <Label>Sponsor type</Label>
              <RadioGroup
                className="mt-2 flex gap-4"
                value={sponsor.sponsorType}
                onValueChange={(v) => setSponsor({ ...sponsor, sponsorType: v as "individual" | "corporate" })}
              >
                <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="individual" /> Individual</label>
                <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="corporate" /> Corporate</label>
              </RadioGroup>
            </div>
            <div>
              <label className="flex items-center gap-3 text-sm">
                <Checkbox
                  checked={sponsor.hasSpecificCandidate}
                  onCheckedChange={(checked) => setSponsor({ ...sponsor, hasSpecificCandidate: checked === true })}
                />
                <span>I have a specific candidate in mind</span>
              </label>
            </div>
            {sponsor.hasSpecificCandidate && (
              <div>
                <Label htmlFor="candidateDetails">Candidate details</Label>
                <Textarea id="candidateDetails" value={sponsor.candidateDetails || ""} onChange={(e) => setSponsor({ ...sponsor, candidateDetails: e.target.value })} />
              </div>
            )}
            <div>
              <Label htmlFor="sponsorFormat">Preferred sponsorship format</Label>
              <Input id="sponsorFormat" value={sponsor.preferredFormat || ""} onChange={(e) => setSponsor({ ...sponsor, preferredFormat: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="sponsorAdditional">Additional context (optional)</Label>
              <Textarea id="sponsorAdditional" value={sponsor.additionalContext || ""} onChange={(e) => setSponsor({ ...sponsor, additionalContext: e.target.value })} />
            </div>
          </div>
          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={goBack}>Back</Button>
            <Button onClick={goNext}>Continue</Button>
          </div>
        </div>
      )}

      {currentStep === "general" && (
        <div className="text-left">
          <h2 className="text-xl font-bold text-card-foreground">General Enquiry</h2>
          <div className="mt-6">
            <Label htmlFor="generalMessage">Message</Label>
            <Textarea
              id="generalMessage"
              value={general.message}
              onChange={(e) => setGeneral({ message: e.target.value })}
              rows={6}
            />
          </div>
          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={goBack}>Back</Button>
            <Button disabled={!general.message.trim()} onClick={goNext}>Continue</Button>
          </div>
        </div>
      )}

      {currentStep === "review" && (
        <div className="text-left">
          <h2 className="text-xl font-bold text-card-foreground">Review &amp; submit</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            You're submitting a <strong>{pathway ? PATHWAY_LABELS[pathway] : ""}</strong> as {contact.fullName || "—"} ({contact.email || "—"}).
          </p>
          <div className="mt-6">
            <label className="flex items-start gap-3 text-sm">
              <Checkbox checked={consent} onCheckedChange={(checked) => setConsent(checked === true)} />
              <span>
                I agree to be contacted by STRENTOR regarding this enquiry and consent to the information above
                being used for that purpose. See our{" "}
                <a href="/privacy-policy" className="underline hover:text-[#C9A96A]">Privacy Policy</a>.
              </span>
            </label>
          </div>
          {submitError && <ErrorSummary message={submitError} />}
          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={goBack} disabled={isSubmitting}>Back</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || !consent}>
              {isSubmitting ? <LoadingState label="Submitting…" /> : "Submit Enquiry"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
