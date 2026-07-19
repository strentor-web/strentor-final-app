"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertTriangle } from "lucide-react"

export function WeeklyCheckinForm({ alreadyCompleted }: { alreadyCompleted: boolean }) {
  const [wins, setWins] = useState("")
  const [barriers, setBarriers] = useState("")
  const [painSummary, setPainSummary] = useState("")
  const [energySummary, setEnergySummary] = useState("")
  const [moodSummary, setMoodSummary] = useState("")
  const [habitConsistency, setHabitConsistency] = useState("")
  const [supportNeeded, setSupportNeeded] = useState(false)
  const [supportDetails, setSupportDetails] = useState("")
  const [redFlagDetected, setRedFlagDetected] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(alreadyCompleted)

  async function handleSubmit() {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/tracker/weekly-checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wins: wins || undefined,
          barriers: barriers || undefined,
          painSummary: painSummary || undefined,
          energySummary: energySummary || undefined,
          moodSummary: moodSummary || undefined,
          habitConsistency: habitConsistency || undefined,
          supportNeeded,
          supportNeededDetails: supportDetails || undefined,
          redFlagDetected,
        }),
      })
      if (!response.ok) {
        toast.error("Something went wrong submitting your check-in.")
        return
      }
      toast.success("Weekly reflection submitted.")
      setSubmitted(true)
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="border rounded-lg p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">This week's reflection is complete</h2>
        <p className="text-muted-foreground">Come back next week for your next check-in.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 border rounded-lg p-6">
      <h2 className="text-2xl font-bold">Weekly Reflection</h2>

      <div>
        <Label htmlFor="wins">Wins this week</Label>
        <Textarea id="wins" value={wins} onChange={(e) => setWins(e.target.value)} rows={2} />
      </div>
      <div>
        <Label htmlFor="barriers">Barriers you ran into</Label>
        <Textarea id="barriers" value={barriers} onChange={(e) => setBarriers(e.target.value)} rows={2} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="pain">Pain this week</Label>
          <Textarea id="pain" value={painSummary} onChange={(e) => setPainSummary(e.target.value)} rows={2} />
        </div>
        <div>
          <Label htmlFor="energy">Energy this week</Label>
          <Textarea id="energy" value={energySummary} onChange={(e) => setEnergySummary(e.target.value)} rows={2} />
        </div>
        <div>
          <Label htmlFor="mood">Mood this week</Label>
          <Textarea id="mood" value={moodSummary} onChange={(e) => setMoodSummary(e.target.value)} rows={2} />
        </div>
      </div>
      <div>
        <Label htmlFor="habit">Habit consistency</Label>
        <Textarea id="habit" value={habitConsistency} onChange={(e) => setHabitConsistency(e.target.value)} rows={2} />
      </div>

      <label className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 text-sm cursor-pointer">
        <Checkbox checked={supportNeeded} onCheckedChange={(v) => setSupportNeeded(v === true)} />
        <span>I&apos;d like a coach to reach out this week.</span>
      </label>
      {supportNeeded && (
        <Textarea
          placeholder="What would you like support with?"
          value={supportDetails}
          onChange={(e) => setSupportDetails(e.target.value)}
          rows={2}
        />
      )}

      <label className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm cursor-pointer">
        <Checkbox checked={redFlagDetected} onCheckedChange={(v) => setRedFlagDetected(v === true)} />
        <span className="flex items-start gap-2 text-destructive">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          I experienced a safety concern this week (chest pain, severe breathlessness, fainting,
          new weakness/numbness, fever, sudden severe headache, open wound, or major swelling).
        </span>
      </label>

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="h-12 w-full rounded-full bg-strentor-red hover:bg-strentor-red/80 disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit Weekly Reflection"}
      </Button>
    </div>
  )
}
