"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  RED_FLAG_OPTIONS,
  RED_FLAG_NONE_VALUE,
  SCORED_QUESTIONS,
} from "@/utils/assessment/scoring"
import { SAFETY_ACK_KEY } from "@/utils/assessment/constants"

export function AssessmentForm() {
  const router = useRouter()
  const [safetyAcked, setSafetyAcked] = useState<boolean | null>(null)
  const [scored, setScored] = useState<Record<string, string>>({})
  const [redFlags, setRedFlags] = useState<string[]>([])
  const [corporateInterest, setCorporateInterest] = useState(false)
  const [eliteInterest, setEliteInterest] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const acked = typeof window !== "undefined" && window.sessionStorage.getItem(SAFETY_ACK_KEY) === "1"
    setSafetyAcked(acked)
    if (!acked) {
      router.replace("/safety-disclaimer?next=/assessment")
    }
  }, [router])

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

  if (safetyAcked === null || safetyAcked === false) {
    return null
  }

  return (
    <div className="space-y-10">
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
