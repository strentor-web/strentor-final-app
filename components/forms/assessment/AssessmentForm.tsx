"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollReveal } from "@/components/motion/ScrollReveal"
import {
  RED_FLAG_OPTIONS,
  RED_FLAG_NONE_VALUE,
  SCORED_QUESTIONS,
} from "@/utils/assessment/scoring"
import { SAFETY_ACK_KEY } from "@/utils/assessment/constants"

export function AssessmentForm() {
  const router = useRouter()
  const [safetyAcked, setSafetyAcked] = useState<boolean | null>(null)
  const [safetyAckChecked, setSafetyAckChecked] = useState(false)
  const [scored, setScored] = useState<Record<string, string>>({})
  const [redFlags, setRedFlags] = useState<string[]>([])
  const [corporateInterest, setCorporateInterest] = useState(false)
  const [eliteInterest, setEliteInterest] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
  const canSubmit = allScoredAnswered && redFlagsAnswered && !isSubmitting

  async function handleSubmit() {
    if (!canSubmit) return
    setIsSubmitting(true)
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

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <span className="text-[#C9A96A]">Step 2 of 2</span>
        <span>·</span>
        <span>Readiness Assessment</span>
      </div>
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
