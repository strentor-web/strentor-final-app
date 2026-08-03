"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AlertTriangle, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollReveal } from "@/components/motion/ScrollReveal"
import { DiscoveryCallButton } from "@/components/forms/DiscoveryCallButton"
import {
  RED_FLAG_OPTIONS,
  RED_FLAG_NONE_VALUE,
  SCORED_QUESTIONS,
  scoreAssessment,
  PATHWAY_DESTINATION,
  PATHWAY_LABELS,
  type ScoringResult,
} from "@/utils/assessment/scoring"
import { SAFETY_ACK_KEY } from "@/utils/assessment/constants"

interface AssessmentFormProps {
  /** Signed-in users get the existing DB-backed flow (POST /api/assessment/submit,
   * tied to their profile). Anonymous visitors get scored client-side and their
   * answers + contact info are saved as a lead via /api/intake/submit instead —
   * no account required, but the team can still follow up. */
  isAuthenticated: boolean
}

export function AssessmentForm({ isAuthenticated }: AssessmentFormProps) {
  const router = useRouter()
  const [safetyAcked, setSafetyAcked] = useState<boolean | null>(null)
  const [safetyAckChecked, setSafetyAckChecked] = useState(false)
  const [scored, setScored] = useState<Record<string, string>>({})
  const [redFlags, setRedFlags] = useState<string[]>([])
  const [corporateInterest, setCorporateInterest] = useState(false)
  const [eliteInterest, setEliteInterest] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [anonResult, setAnonResult] = useState<ScoringResult | null>(null)

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")

  useEffect(() => {
    const acked = typeof window !== "undefined" && window.sessionStorage.getItem(SAFETY_ACK_KEY) === "1"
    setSafetyAcked(acked)
  }, [])

  function acknowledgeSafety() {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(SAFETY_ACK_KEY, "1")
    }
    setSafetyAcked(true)
  }

  function toggleRedFlag(value: string) {
    setRedFlags((prev) => {
      if (value === RED_FLAG_NONE_VALUE) return [RED_FLAG_NONE_VALUE]
      const withoutNone = prev.filter((v) => v !== RED_FLAG_NONE_VALUE)
      return withoutNone.includes(value)
        ? withoutNone.filter((v) => v !== value)
        : [...withoutNone, value]
    })
  }

  const allScoredAnswered = SCORED_QUESTIONS.every((q) => scored[q.key])
  const redFlagsAnswered = redFlags.length > 0
  const contactComplete = isAuthenticated || (fullName.trim() && email.trim() && phone.trim() && city.trim() && country.trim())
  const canSubmit = allScoredAnswered && redFlagsAnswered && !!contactComplete && !isSubmitting

  async function handleSubmit() {
    if (!canSubmit) return
    setIsSubmitting(true)

    if (!isAuthenticated) {
      try {
        const result = scoreAssessment({ scored, redFlags, corporateInterest, eliteInterest })

        const answerLines = SCORED_QUESTIONS.map((q) => {
          const chosen = q.options.find((o) => o.value === scored[q.key])
          return `${q.label} ${chosen?.label ?? ""}`
        })
        const redFlagLabels = redFlags
          .filter((v) => v !== RED_FLAG_NONE_VALUE)
          .map((v) => RED_FLAG_OPTIONS.find((o) => o.value === v)?.label || v)

        const response = await fetch("/api/intake/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pathway: "personal",
            contact: { fullName, email, phone, city, country },
            general: {
              message: [
                "Readiness Assessment responses:",
                ...answerLines,
                `Safety flags: ${redFlagLabels.length > 0 ? redFlagLabels.join(", ") : "None"}`,
                `Corporate wellness interest: ${corporateInterest ? "Yes" : "No"}`,
                `Elite Mentorship interest: ${eliteInterest ? "Yes" : "No"}`,
                `Computed pathway: ${PATHWAY_LABELS[result.pathway]} (score ${result.totalScore})`,
              ].join("\n"),
            },
            sourcePage: "/assessment",
            consent: true,
            submittedAt: new Date().toISOString(),
          }),
        })

        if (!response.ok) {
          toast.error("Something went wrong. Please try again.")
          return
        }

        setAnonResult(result)
      } catch {
        toast.error("Network error. Please try again.")
      } finally {
        setIsSubmitting(false)
      }
      return
    }

    try {
      const response = await fetch("/api/assessment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scored, redFlags, corporateInterest, eliteInterest }),
      })

      if (response.status === 401) {
        toast.error("Please sign in to submit the assessment.")
        router.push("/sign-in")
        return
      }

      if (!response.ok) {
        toast.error("Something went wrong. Please try again.")
        return
      }

      const data = await response.json()
      router.push(`/assessment/result?id=${data.id}`)
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (safetyAcked === null) {
    return <div className="h-64" aria-hidden />
  }

  if (safetyAcked === false) {
    return (
      <ScrollReveal direction="none">
        <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <span className="text-[#C9A96A]">Step 1 of 2</span>
          <span>·</span>
          <span>Safety Disclaimer</span>
        </div>
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            STRENTOR coaching is <strong className="text-card-foreground">educational and lifestyle-focused</strong>.
            It does not diagnose, treat, prescribe, or replace medical care, physiotherapy, or
            emergency treatment.
          </p>
          <p>Before starting the Readiness Assessment, please confirm you understand the following:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Your pathway result is a starting guide, not a medical clearance.</li>
            <li>You will follow restrictions, medication, fluid, diet, and safety instructions from your own medical/clinical team.</li>
            <li>You will report pain, fatigue, skin issues, dizziness, breathlessness, fever, swelling, or new symptoms before training.</li>
            <li>A coach may pause, modify, or refer you to a professional when safety boundaries are unclear.</li>
          </ul>

          <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
            <p className="text-destructive">
              If you are experiencing a medical emergency, contact your local emergency services
              immediately. Do not use this Service for emergency assistance.
            </p>
          </div>

          <p>
            Read our full{" "}
            <Link href="/medical-disclaimer" className="text-[#C9A96A] hover:underline">
              Medical Disclaimer
            </Link>{" "}
            for details.
          </p>
        </div>

        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-background p-4 text-sm hover:border-[#C9A96A]">
          <Checkbox
            checked={safetyAckChecked}
            onCheckedChange={(v) => setSafetyAckChecked(v === true)}
          />
          <span className="text-card-foreground">
            I have read and understood this disclaimer, and I consent to continue.
          </span>
        </label>

        <Button
          onClick={acknowledgeSafety}
          disabled={!safetyAckChecked}
          className="mt-6 h-12 w-full rounded-full bg-[#C9A96A] hover:bg-[#C9A96A]/90 disabled:opacity-50"
        >
          Continue to Readiness Assessment
        </Button>
      </ScrollReveal>
    )
  }

  if (anonResult) {
    const destination = PATHWAY_DESTINATION[anonResult.pathway]
    return (
      <div>
        {anonResult.redFlagExists && (
          <div className="mb-8 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
            <p className="text-sm text-destructive">
              Pause this activity. Your response suggests professional guidance or coach review may
              be needed before continuing. A coach will follow up directly.
            </p>
          </div>
        )}
        <div className="text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#C9A96A]/10">
            <CheckCircle2 className="h-7 w-7 text-[#C9A96A]" />
          </span>
          <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-[#C9A96A]">
            Your Recommended Pathway
          </p>
          <h2 className="mt-2 text-3xl font-bold font-display text-card-foreground">
            {PATHWAY_LABELS[anonResult.pathway]}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">{anonResult.reason}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            We&apos;ve saved your answers — a STRENTOR coach will follow up. Your pathway is a
            starting guide, not a medical clearance.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild className="h-12 rounded-full bg-[#C9A96A] px-8 hover:bg-[#C9A96A]/90">
              <Link href={destination.href}>{destination.label}</Link>
            </Button>
            {!anonResult.automaticProgressionAllowed && (
              <DiscoveryCallButton className="h-12 rounded-full border-[#C9A96A] px-8 text-[#C9A96A] hover:bg-[#C9A96A]/10">
                Book a Discovery Call
              </DiscoveryCallButton>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <span className="text-[#C9A96A]">Step 2 of 2</span>
        <span>·</span>
        <span>Readiness Assessment</span>
      </div>

      {!isAuthenticated && (
        <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
          <Label className="text-base font-semibold text-card-foreground">
            Where should we send your result?
          </Label>
          <p className="text-sm text-muted-foreground">
            No account needed — just enough to save your result and have a coach follow up.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} required />
            </div>
          </div>
        </div>
      )}

      {SCORED_QUESTIONS.map((question) => (
        <div key={question.key}>
          <Label className="text-base font-semibold text-card-foreground">{question.label}</Label>
          <RadioGroup
            className="mt-3 flex flex-wrap gap-3"
            value={scored[question.key]}
            onValueChange={(value) => setScored((prev) => ({ ...prev, [question.key]: value }))}
          >
            {question.options.map((option) => (
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
      ))}

      <div>
        <Label className="text-base font-semibold text-card-foreground">
          Do you currently experience any of the following?
        </Label>
        <p className="mt-1 text-sm text-muted-foreground">Select all that apply.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {RED_FLAG_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 text-sm cursor-pointer hover:border-[#C9A96A]"
            >
              <Checkbox
                checked={redFlags.includes(option.value)}
                onCheckedChange={() => toggleRedFlag(option.value)}
              />
              <span className="text-card-foreground">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
        <Label className="text-base font-semibold text-card-foreground">Optional interests</Label>
        <label className="flex items-start gap-3 text-sm cursor-pointer">
          <Checkbox checked={corporateInterest} onCheckedChange={(v) => setCorporateInterest(v === true)} />
          <span className="text-card-foreground">
            I&apos;m interested in a corporate / organizational wellness program.
          </span>
        </label>
        <label className="flex items-start gap-3 text-sm cursor-pointer">
          <Checkbox checked={eliteInterest} onCheckedChange={(v) => setEliteInterest(v === true)} />
          <span className="text-card-foreground">
            I&apos;m interested in premium 1:1 Elite Mentorship.
          </span>
        </label>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="h-12 w-full rounded-full bg-[#C9A96A] hover:bg-[#C9A96A]/90 disabled:opacity-50"
      >
        {isSubmitting ? "Scoring your assessment..." : "See My Recommended Pathway"}
      </Button>
    </div>
  )
}
