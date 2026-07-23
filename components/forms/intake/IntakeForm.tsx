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
import { partnerPricingOptions } from "@/config/partnerPricing"
import {
  AdaptiveSpecialistNotes,
  CoachingContext,
  ContactDetails,
  CorporateDetails,
  EnquiryPathway,
  GeneralEnquiryDetails,
  GoalsIdentity,
  HealthBoundaries,
  IntakeFormPayload,
  MovementProfile,
  PATHWAY_LABELS,
  PERSONAL_TRACK_PATHWAYS,
  RecoveryNutritionProfile,
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

function RadioRow({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string | undefined
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div>
      <Label>{label}</Label>
      <RadioGroup className="mt-3 flex flex-wrap gap-3" value={value} onValueChange={onChange}>
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm cursor-pointer hover:border-[#C9A96A]"
          >
            <RadioGroupItem value={option.value} />
            <span>{option.label}</span>
          </label>
        ))}
      </RadioGroup>
    </div>
  )
}

function toggleValue(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

const emptyContact: ContactDetails = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  country: "",
  preferredContactMethod: [],
}

const emptyCoachingContext: CoachingContext = {
  primaryFocus: [],
  supportNeeded: [],
}

const emptyMovementProfile: MovementProfile = {}

const emptyHealthBoundaries: HealthBoundaries = {}

const emptyRecoveryNutrition: RecoveryNutritionProfile = {}

const emptyAdaptiveSpecialistNotes: AdaptiveSpecialistNotes = {}

const emptyGoalsIdentity: GoalsIdentity = {}

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
  const [coachingContext, setCoachingContext] = useState<CoachingContext>(emptyCoachingContext)
  const [movementProfile, setMovementProfile] = useState<MovementProfile>(emptyMovementProfile)
  const [healthBoundaries, setHealthBoundaries] = useState<HealthBoundaries>(emptyHealthBoundaries)
  const [recoveryNutrition, setRecoveryNutrition] = useState<RecoveryNutritionProfile>(emptyRecoveryNutrition)
  const [adaptiveSpecialistNotes, setAdaptiveSpecialistNotes] = useState<AdaptiveSpecialistNotes>(emptyAdaptiveSpecialistNotes)
  const [goalsIdentity, setGoalsIdentity] = useState<GoalsIdentity>(emptyGoalsIdentity)
  const [signatureName, setSignatureName] = useState("")
  const [acknowledged, setAcknowledged] = useState(false)
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
      return [
        "pathway",
        "contact",
        "coachingContext",
        "movementProfile",
        "healthBoundaries",
        "recoveryNutrition",
        "adaptiveSpecialist",
        "goalsIdentity",
        "review",
      ]
    }
    return ["pathway"]
  }, [pathway])

  const currentStep = steps[stepIndex]
  const isPersonalTrack = !!pathway && PERSONAL_TRACK_PATHWAYS.includes(pathway)

  const goNext = () => setStepIndex((i) => Math.min(i + 1, steps.length - 1))
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0))

  const handleSelectPathway = (value: EnquiryPathway) => {
    setPathway(value)
    setStepIndex(1)
  }

  const contactValid =
    contact.fullName.trim() && contact.email.trim() && contact.phone.trim() && contact.city.trim() && contact.country.trim()

  async function handleSubmit() {
    if (!pathway || !consent || !acknowledged) return
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
      if (isPersonalTrack) {
        payload.coachingContext = coachingContext
        payload.movementProfile = movementProfile
        payload.healthBoundaries = healthBoundaries
        payload.recoveryNutrition = recoveryNutrition
        payload.adaptiveSpecialistNotes = adaptiveSpecialistNotes
        payload.goalsIdentity = goalsIdentity
        payload.signatureName = signatureName
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
          <h2 className="text-xl font-bold text-card-foreground">
            {isPersonalTrack ? "Personal and contact details" : "Your contact details"}
          </h2>
          {isPersonalTrack && (
            <p className="mt-1 text-sm text-muted-foreground">
              Write &quot;Unknown&quot; instead of guessing when you are unsure.
            </p>
          )}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 text-left">
            <div className="sm:col-span-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" value={contact.fullName} onChange={(e) => setContact({ ...contact, fullName: e.target.value })} />
            </div>
            {isPersonalTrack && (
              <div className="sm:col-span-2">
                <Label htmlFor="preferredName">Preferred name (optional)</Label>
                <Input id="preferredName" value={contact.preferredName || ""} onChange={(e) => setContact({ ...contact, preferredName: e.target.value })} />
              </div>
            )}
            <div>
              <Label htmlFor="age">{isPersonalTrack ? "Age / date of birth" : "Age (optional)"}</Label>
              <Input id="age" value={contact.age || ""} onChange={(e) => setContact({ ...contact, age: e.target.value })} />
            </div>
            {isPersonalTrack && (
              <>
                <div>
                  <Label htmlFor="height">Height</Label>
                  <Input id="height" value={contact.height || ""} onChange={(e) => setContact({ ...contact, height: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="weight">Current weight</Label>
                  <Input id="weight" value={contact.weight || ""} onChange={(e) => setContact({ ...contact, weight: e.target.value })} />
                </div>
              </>
            )}
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
            {isPersonalTrack && (
              <div className="sm:col-span-2">
                <Label htmlFor="emergencyContact">Emergency contact</Label>
                <Input
                  id="emergencyContact"
                  placeholder="Name and phone number"
                  value={contact.emergencyContact || ""}
                  onChange={(e) => setContact({ ...contact, emergencyContact: e.target.value })}
                />
              </div>
            )}
            {!isPersonalTrack && (
              <div className="sm:col-span-2">
                <Label htmlFor="socialUrl">Social or professional profile (optional)</Label>
                <Input
                  id="socialUrl"
                  placeholder="https://..."
                  value={contact.socialUrl || ""}
                  onChange={(e) => setContact({ ...contact, socialUrl: e.target.value })}
                />
              </div>
            )}
            {isPersonalTrack && (
              <div className="sm:col-span-2">
                <Label>Preferred contact method</Label>
                <div className="mt-3">
                  <CheckboxGroup
                    options={[
                      { value: "whatsapp", label: "WhatsApp" },
                      { value: "email", label: "Email" },
                      { value: "call", label: "Call" },
                      { value: "instagram_dm", label: "Instagram DM" },
                      { value: "linkedin_dm", label: "LinkedIn DM" },
                    ]}
                    selected={contact.preferredContactMethod || []}
                    onToggle={(v) =>
                      setContact({ ...contact, preferredContactMethod: toggleValue(contact.preferredContactMethod || [], v) })
                    }
                  />
                </div>
              </div>
            )}
          </div>
          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={goBack}>Back</Button>
            <Button disabled={!contactValid} onClick={goNext}>Continue</Button>
          </div>
        </div>
      )}

      {currentStep === "coachingContext" && (
        <div className="text-left">
          <h2 className="text-xl font-bold text-card-foreground">Coaching context and goals</h2>
          <div className="mt-6 space-y-6">
            <div>
              <Label>Primary coaching focus</Label>
              <div className="mt-3">
                <CheckboxGroup
                  options={[
                    { value: "strength", label: "Strength" },
                    { value: "fat_loss", label: "Fat loss" },
                    { value: "energy", label: "Energy" },
                    { value: "confidence", label: "Confidence" },
                    { value: "routine_discipline", label: "Routine discipline" },
                    { value: "mixed", label: "Mixed" },
                  ]}
                  selected={coachingContext.primaryFocus}
                  onToggle={(v) => setCoachingContext({ ...coachingContext, primaryFocus: toggleValue(coachingContext.primaryFocus, v) })}
                />
              </div>
            </div>
            <RadioRow
              label="Current training experience"
              value={coachingContext.trainingExperience}
              onChange={(v) => setCoachingContext({ ...coachingContext, trainingExperience: v })}
              options={[
                { value: "beginner", label: "Beginner" },
                { value: "restarting", label: "Restarting" },
                { value: "intermediate", label: "Intermediate" },
                { value: "experienced", label: "Experienced" },
              ]}
            />
            <RadioRow
              label="Movement context"
              value={coachingContext.movementContext}
              onChange={(v) => setCoachingContext({ ...coachingContext, movementContext: v })}
              options={[
                { value: "wheelchair_seated", label: "Wheelchair / seated" },
                { value: "standing_walking", label: "Standing / walking" },
                { value: "mixed_mobility", label: "Mixed mobility" },
                { value: "prefer_to_explain", label: "Prefer to explain" },
              ]}
            />
            <RadioRow
              label="Preferred coaching format"
              value={coachingContext.coachingFormat}
              onChange={(v) => setCoachingContext({ ...coachingContext, coachingFormat: v })}
              options={[
                { value: "online", label: "Online" },
                { value: "hybrid", label: "Hybrid" },
                { value: "in_person_where_available", label: "In-person where available" },
                { value: "unsure", label: "Unsure" },
              ]}
            />
            <div>
              <Label>Support needed</Label>
              <div className="mt-3">
                <CheckboxGroup
                  options={[
                    { value: "accountability", label: "Accountability" },
                    { value: "exercise_guidance", label: "Exercise guidance" },
                    { value: "routine_design", label: "Routine design" },
                    { value: "confidence_support", label: "Confidence support" },
                    { value: "safety_boundaries", label: "Safety boundaries" },
                  ]}
                  selected={coachingContext.supportNeeded}
                  onToggle={(v) => setCoachingContext({ ...coachingContext, supportNeeded: toggleValue(coachingContext.supportNeeded, v) })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="successVision">What would make the next 8–12 weeks successful?</Label>
              <Textarea
                id="successVision"
                value={coachingContext.successVision || ""}
                onChange={(e) => setCoachingContext({ ...coachingContext, successVision: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="biggestBarrier">Biggest barrier right now</Label>
              <Textarea
                id="biggestBarrier"
                value={coachingContext.biggestBarrier || ""}
                onChange={(e) => setCoachingContext({ ...coachingContext, biggestBarrier: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={goBack}>Back</Button>
            <Button onClick={goNext}>Continue</Button>
          </div>
        </div>
      )}

      {currentStep === "movementProfile" && (
        <div className="text-left">
          <h2 className="text-xl font-bold text-card-foreground">Movement, mobility, pain, and daily function</h2>
          <div className="mt-6 space-y-6">
            <RadioRow
              label="Typical daily movement"
              value={movementProfile.dailyMovement}
              onChange={(v) => setMovementProfile({ ...movementProfile, dailyMovement: v })}
              options={[
                { value: "mostly_seated", label: "Mostly seated" },
                { value: "mixed_sitting_standing", label: "Mixed sitting/standing" },
                { value: "mostly_standing_walking", label: "Mostly standing/walking" },
                { value: "other", label: "Other" },
              ]}
            />
            <RadioRow
              label="Transfer or position-change difficulty"
              value={movementProfile.transferDifficulty}
              onChange={(v) => setMovementProfile({ ...movementProfile, transferDifficulty: v })}
              options={[
                { value: "no", label: "No" },
                { value: "sometimes", label: "Sometimes" },
                { value: "yes", label: "Yes" },
                { value: "not_applicable", label: "Not applicable" },
              ]}
            />
            <RadioRow
              label="Shoulder / neck / back pain"
              value={movementProfile.shoulderNeckBackPain}
              onChange={(v) => setMovementProfile({ ...movementProfile, shoulderNeckBackPain: v })}
              options={[
                { value: "none", label: "None" },
                { value: "mild", label: "Mild" },
                { value: "moderate", label: "Moderate" },
                { value: "severe", label: "Severe" },
              ]}
            />
            <RadioRow
              label="Balance or fall concern"
              value={movementProfile.balanceFallConcern}
              onChange={(v) => setMovementProfile({ ...movementProfile, balanceFallConcern: v })}
              options={[
                { value: "no", label: "No" },
                { value: "sometimes", label: "Sometimes" },
                { value: "yes", label: "Yes" },
                { value: "not_applicable", label: "Not applicable" },
              ]}
            />
            <RadioRow
              label="Typical day fatigue"
              value={movementProfile.fatigueLevel}
              onChange={(v) => setMovementProfile({ ...movementProfile, fatigueLevel: v })}
              options={[
                { value: "low", label: "Low" },
                { value: "moderate", label: "Moderate" },
                { value: "high", label: "High" },
                { value: "variable", label: "Variable" },
              ]}
            />
            <RadioRow
              label="Pain triggers known"
              value={movementProfile.painTriggersKnown}
              onChange={(v) => setMovementProfile({ ...movementProfile, painTriggersKnown: v })}
              options={[
                { value: "no", label: "No" },
                { value: "yes", label: "Yes — describe below" },
              ]}
            />
            <RadioRow
              label="Assistive device / support used"
              value={movementProfile.assistiveDevice}
              onChange={(v) => setMovementProfile({ ...movementProfile, assistiveDevice: v })}
              options={[
                { value: "none", label: "None" },
                { value: "manual_chair", label: "Manual chair" },
                { value: "power_chair", label: "Power chair" },
                { value: "walker_cane", label: "Walker/cane" },
                { value: "other", label: "Other" },
              ]}
            />
            <RadioRow
              label="Caregiver / family support involved"
              value={movementProfile.caregiverSupport}
              onChange={(v) => setMovementProfile({ ...movementProfile, caregiverSupport: v })}
              options={[
                { value: "no", label: "No" },
                { value: "yes", label: "Yes" },
                { value: "sometimes", label: "Sometimes" },
              ]}
            />
            <div>
              <Label htmlFor="painTriggerDescription">Movements, positions, or exercises that usually trigger pain or fatigue</Label>
              <Textarea
                id="painTriggerDescription"
                value={movementProfile.painTriggerDescription || ""}
                onChange={(e) => setMovementProfile({ ...movementProfile, painTriggerDescription: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={goBack}>Back</Button>
            <Button onClick={goNext}>Continue</Button>
          </div>
        </div>
      )}

      {currentStep === "healthBoundaries" && (
        <div className="text-left">
          <h2 className="text-xl font-bold text-card-foreground">Health boundaries and care-team guidance</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This is not a diagnosis — it just helps us coach you safely. STRENTOR is educational and
            lifestyle-focused coaching, and does not replace medical care, physiotherapy, renal guidance,
            emergency treatment, or professional clinical advice.
          </p>
          <div className="mt-6 space-y-6">
            <RadioRow
              label="Any medical condition that affects training?"
              value={healthBoundaries.medicalConditionAffectsTraining}
              onChange={(v) => setHealthBoundaries({ ...healthBoundaries, medicalConditionAffectsTraining: v })}
              options={[
                { value: "no", label: "No" },
                { value: "yes", label: "Yes" },
                { value: "unsure", label: "Unsure" },
              ]}
            />
            <RadioRow
              label="Medical clearance recommended or required?"
              value={healthBoundaries.medicalClearance}
              onChange={(v) => setHealthBoundaries({ ...healthBoundaries, medicalClearance: v })}
              options={[
                { value: "no", label: "No" },
                { value: "yes", label: "Yes" },
                { value: "unsure", label: "Unsure" },
              ]}
            />
            <RadioRow
              label="Blood pressure / heart / breathing / blood sugar concerns"
              value={healthBoundaries.cardioMetabolicConcerns}
              onChange={(v) => setHealthBoundaries({ ...healthBoundaries, cardioMetabolicConcerns: v })}
              options={[
                { value: "no", label: "No" },
                { value: "yes", label: "Yes" },
                { value: "unsure", label: "Unsure" },
              ]}
            />
            <RadioRow
              label="Kidney, bladder, dialysis, or fluid/diet instructions"
              value={healthBoundaries.kidneyBladderConcerns}
              onChange={(v) => setHealthBoundaries({ ...healthBoundaries, kidneyBladderConcerns: v })}
              options={[
                { value: "no", label: "No" },
                { value: "yes", label: "Yes" },
                { value: "not_applicable", label: "Not applicable" },
              ]}
            />
            <RadioRow
              label="Current wound, skin breakdown, swelling, or infection concern"
              value={healthBoundaries.woundSkinConcern}
              onChange={(v) => setHealthBoundaries({ ...healthBoundaries, woundSkinConcern: v })}
              options={[
                { value: "no", label: "No" },
                { value: "yes", label: "Yes" },
              ]}
            />
            <RadioRow
              label="Medication / supplement considerations"
              value={healthBoundaries.medicationConsiderations}
              onChange={(v) => setHealthBoundaries({ ...healthBoundaries, medicationConsiderations: v })}
              options={[
                { value: "no", label: "No" },
                { value: "yes", label: "Yes" },
                { value: "unsure", label: "Unsure" },
              ]}
            />
            <RadioRow
              label="Allergy or sensitivity relevant to training equipment"
              value={healthBoundaries.allergyConsiderations}
              onChange={(v) => setHealthBoundaries({ ...healthBoundaries, allergyConsiderations: v })}
              options={[
                { value: "no", label: "No" },
                { value: "yes", label: "Yes" },
                { value: "unsure", label: "Unsure" },
              ]}
            />
            <div>
              <Label htmlFor="careTeamRestrictions">Current restrictions or instructions from your medical/clinical team</Label>
              <Textarea
                id="careTeamRestrictions"
                value={healthBoundaries.careTeamRestrictions || ""}
                onChange={(e) => setHealthBoundaries({ ...healthBoundaries, careTeamRestrictions: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <p className="text-sm text-destructive">
              Pause coaching and seek medical help for chest pain, severe breathlessness, fainting, new
              weakness/numbness, fever, sudden severe headache, open wound, major swelling, or any symptom
              your care team treats as urgent.
            </p>
          </div>

          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={goBack}>Back</Button>
            <Button onClick={goNext}>Continue</Button>
          </div>
        </div>
      )}

      {currentStep === "recoveryNutrition" && (
        <div className="text-left">
          <h2 className="text-xl font-bold text-card-foreground">Recovery, nutrition, and lifestyle routine</h2>
          <div className="mt-6 space-y-6">
            <RadioRow
              label="Sleep quality"
              value={recoveryNutrition.sleepQuality}
              onChange={(v) => setRecoveryNutrition({ ...recoveryNutrition, sleepQuality: v })}
              options={[
                { value: "poor", label: "Poor" },
                { value: "fair", label: "Fair" },
                { value: "good", label: "Good" },
                { value: "variable", label: "Variable" },
              ]}
            />
            <RadioRow
              label="Current meal pattern"
              value={recoveryNutrition.mealPattern}
              onChange={(v) => setRecoveryNutrition({ ...recoveryNutrition, mealPattern: v })}
              options={[
                { value: "1_to_2_meals", label: "1–2 meals" },
                { value: "3_meals", label: "3 meals" },
                { value: "4_plus_eating_events", label: "4+ eating events" },
                { value: "irregular", label: "Irregular" },
              ]}
            />
            <RadioRow
              label="Appetite"
              value={recoveryNutrition.appetite}
              onChange={(v) => setRecoveryNutrition({ ...recoveryNutrition, appetite: v })}
              options={[
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
                { value: "variable", label: "Variable" },
              ]}
            />
            <RadioRow
              label="Hydration or fluid instructions"
              value={recoveryNutrition.hydrationInstructions}
              onChange={(v) => setRecoveryNutrition({ ...recoveryNutrition, hydrationInstructions: v })}
              options={[
                { value: "none", label: "None" },
                { value: "medical_instruction", label: "Medical instruction" },
                { value: "unsure", label: "Unsure" },
              ]}
            />
            <RadioRow
              label="Diet instructions from care team"
              value={recoveryNutrition.dietInstructions}
              onChange={(v) => setRecoveryNutrition({ ...recoveryNutrition, dietInstructions: v })}
              options={[
                { value: "none", label: "None" },
                { value: "renal", label: "Renal" },
                { value: "diabetes", label: "Diabetes" },
                { value: "weight_loss", label: "Weight loss" },
                { value: "other", label: "Other" },
              ]}
            />
            <RadioRow
              label="Current supplements / sports drinks / electrolyte products"
              value={recoveryNutrition.supplementsUsed}
              onChange={(v) => setRecoveryNutrition({ ...recoveryNutrition, supplementsUsed: v })}
              options={[
                { value: "no", label: "No" },
                { value: "yes", label: "Yes — list below" },
              ]}
            />
            <RadioRow
              label="Routine consistency"
              value={recoveryNutrition.routineConsistency}
              onChange={(v) => setRecoveryNutrition({ ...recoveryNutrition, routineConsistency: v })}
              options={[
                { value: "strong", label: "Strong" },
                { value: "average", label: "Average" },
                { value: "difficult_right_now", label: "Difficult right now" },
              ]}
            />
            <div>
              <Label htmlFor="supplementsDescription">Current supplements, sports drinks, electrolyte products, or diet instructions</Label>
              <Textarea
                id="supplementsDescription"
                value={recoveryNutrition.supplementsDescription || ""}
                onChange={(e) => setRecoveryNutrition({ ...recoveryNutrition, supplementsDescription: e.target.value })}
              />
            </div>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            STRENTOR nutrition guidance does not replace a renal dietitian, doctor, or clinical nutrition professional.
          </p>
          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={goBack}>Back</Button>
            <Button onClick={goNext}>Continue</Button>
          </div>
        </div>
      )}

      {currentStep === "adaptiveSpecialist" && (
        <div className="text-left">
          <h2 className="text-xl font-bold text-card-foreground">Optional adaptive specialist notes</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete this section only if it applies. It helps STRENTOR set safer coaching boundaries for
            seated, wheelchair, chronic-condition, or medically complex clients. You can skip straight to
            Continue if none of this applies to you.
          </p>
          <div className="mt-6 space-y-6">
            <RadioRow
              label="Pressure injury history or skin-check routine"
              value={adaptiveSpecialistNotes.pressureInjuryHistory}
              onChange={(v) => setAdaptiveSpecialistNotes({ ...adaptiveSpecialistNotes, pressureInjuryHistory: v })}
              options={[
                { value: "not_applicable", label: "Not applicable" },
                { value: "no_concern", label: "No concern" },
                { value: "yes_explain", label: "Yes — explain" },
              ]}
            />
            <RadioRow
              label="Reduced sensation in legs, feet, or sitting areas"
              value={adaptiveSpecialistNotes.reducedSensation}
              onChange={(v) => setAdaptiveSpecialistNotes({ ...adaptiveSpecialistNotes, reducedSensation: v })}
              options={[
                { value: "not_applicable", label: "Not applicable" },
                { value: "no", label: "No" },
                { value: "yes", label: "Yes" },
                { value: "unsure", label: "Unsure" },
              ]}
            />
            <RadioRow
              label="Catheter, bladder, bowel, or UTI routine affects training"
              value={adaptiveSpecialistNotes.catheterBladderBowelRoutine}
              onChange={(v) => setAdaptiveSpecialistNotes({ ...adaptiveSpecialistNotes, catheterBladderBowelRoutine: v })}
              options={[
                { value: "not_applicable", label: "Not applicable" },
                { value: "no", label: "No" },
                { value: "yes", label: "Yes" },
              ]}
            />
            <RadioRow
              label="Dialysis / CKD / renal instructions affect training"
              value={adaptiveSpecialistNotes.dialysisCkdInstructions}
              onChange={(v) => setAdaptiveSpecialistNotes({ ...adaptiveSpecialistNotes, dialysisCkdInstructions: v })}
              options={[
                { value: "not_applicable", label: "Not applicable" },
                { value: "no", label: "No" },
                { value: "yes", label: "Yes" },
              ]}
            />
            <RadioRow
              label="Neurological or shunt-related monitoring needed"
              value={adaptiveSpecialistNotes.neurologicalShuntMonitoring}
              onChange={(v) => setAdaptiveSpecialistNotes({ ...adaptiveSpecialistNotes, neurologicalShuntMonitoring: v })}
              options={[
                { value: "not_applicable", label: "Not applicable" },
                { value: "no", label: "No" },
                { value: "yes", label: "Yes" },
                { value: "unsure", label: "Unsure" },
              ]}
            />
          </div>
          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={goBack}>Back</Button>
            <Button onClick={goNext}>Continue</Button>
          </div>
        </div>
      )}

      {currentStep === "goalsIdentity" && (
        <div className="text-left">
          <h2 className="text-xl font-bold text-card-foreground">Goals, identity, and coaching fit</h2>
          <div className="mt-6 space-y-6">
            <div>
              <Label htmlFor="topOutcomes">Top 3 outcomes you want from coaching</Label>
              <Textarea
                id="topOutcomes"
                value={goalsIdentity.topOutcomes || ""}
                onChange={(e) => setGoalsIdentity({ ...goalsIdentity, topOutcomes: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="whatToKnow">What should STRENTOR know about your body, confidence, routine, or support needs?</Label>
              <Textarea
                id="whatToKnow"
                value={goalsIdentity.whatToKnow || ""}
                onChange={(e) => setGoalsIdentity({ ...goalsIdentity, whatToKnow: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="coachingStyle">What coaching style helps you perform best?</Label>
              <Textarea
                id="coachingStyle"
                value={goalsIdentity.coachingStyle || ""}
                onChange={(e) => setGoalsIdentity({ ...goalsIdentity, coachingStyle: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="whatNotToPush">Anything you do not want pushed, rushed, or ignored?</Label>
              <Textarea
                id="whatNotToPush"
                value={goalsIdentity.whatNotToPush || ""}
                onChange={(e) => setGoalsIdentity({ ...goalsIdentity, whatNotToPush: e.target.value })}
              />
            </div>
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
              <RadioRow
                label="Which option are you interested in?"
                value={corporate.interestedOption}
                onChange={(v) => setCorporate({ ...corporate, interestedOption: v })}
                options={partnerPricingOptions.map((option) => ({
                  value: option.id,
                  label: `${option.label} — ${option.price}`,
                }))}
              />
            </div>
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
          <h2 className="text-xl font-bold text-card-foreground">
            {isPersonalTrack ? "Consent and acknowledgement" : "Review & submit"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            You're submitting a <strong>{pathway ? PATHWAY_LABELS[pathway] : ""}</strong> as {contact.fullName || "—"} ({contact.email || "—"}).
          </p>

          {isPersonalTrack && (
            <div className="mt-6 space-y-2 rounded-lg border border-border bg-background p-4 text-sm text-muted-foreground">
              <p>• I understand STRENTOR coaching is educational and lifestyle-focused; it does not diagnose, treat, prescribe, or replace medical care.</p>
              <p>• I will follow restrictions, medication, fluid, diet, and safety instructions from my medical/clinical team.</p>
              <p>• I will report pain, fatigue, skin issues, dizziness, breathlessness, fever, swelling, or new symptoms before training.</p>
              <p>• I understand the coach may pause, modify, or refer out when safety boundaries are unclear.</p>
            </div>
          )}

          {isPersonalTrack && (
            <div className="mt-6">
              <label className="flex items-start gap-3 text-sm">
                <Checkbox checked={acknowledged} onCheckedChange={(checked) => setAcknowledged(checked === true)} />
                <span>I have read and agree to the acknowledgements above.</span>
              </label>
              <div className="mt-4">
                <Label htmlFor="signatureName">Type your full name to sign</Label>
                <Input
                  id="signatureName"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  placeholder="Full legal name"
                />
              </div>
            </div>
          )}

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
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !consent || (isPersonalTrack && (!acknowledged || !signatureName.trim()))}
            >
              {isSubmitting ? <LoadingState label="Submitting…" /> : "Submit Enquiry"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
