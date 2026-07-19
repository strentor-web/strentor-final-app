"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RED_FLAG_OPTIONS, RED_FLAG_NONE_VALUE } from "@/utils/assessment/scoring"
import { AlertTriangle } from "lucide-react"

const scales: { key: "painLevel" | "fatigueLevel" | "energyLevel" | "moodLevel"; label: string }[] = [
  { key: "painLevel", label: "Pain" },
  { key: "fatigueLevel", label: "Fatigue" },
  { key: "energyLevel", label: "Energy" },
  { key: "moodLevel", label: "Mood" },
]

function SliderRow({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <span className="text-sm font-semibold text-foreground">{value}/10</span>
      </div>
      <input
        type="range"
        min={0}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-strentor-red"
      />
    </div>
  )
}

export function PainFatigueForm({ onLogged }: { onLogged?: () => void }) {
  const [levels, setLevels] = useState({ painLevel: 0, fatigueLevel: 0, energyLevel: 5, moodLevel: 5 })
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastFlag, setLastFlag] = useState<boolean | null>(null)

  function toggleSymptom(value: string) {
    setSymptoms((prev) => {
      if (value === RED_FLAG_NONE_VALUE) return [RED_FLAG_NONE_VALUE]
      const withoutNone = prev.filter((v) => v !== RED_FLAG_NONE_VALUE)
      return withoutNone.includes(value) ? withoutNone.filter((v) => v !== value) : [...withoutNone, value]
    })
  }

  async function handleSubmit() {
    if (symptoms.length === 0 || isSubmitting) return
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/tracker/pain-fatigue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...levels, symptoms, notes: notes || undefined }),
      })
      if (!response.ok) {
        toast.error("Something went wrong logging your body check.")
        return
      }
      const data = await response.json()
      setLastFlag(data.redFlagDetected)
      toast.success("Body check logged.")
      setSymptoms([])
      setNotes("")
      onLogged?.()
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 border rounded-lg p-6">
      <h2 className="text-2xl font-bold">Log a Body Check</h2>

      {lastFlag && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
          <p className="text-sm text-destructive">
            Pause this activity. Your response suggests professional guidance or coach review may
            be needed before continuing. Your coach has been notified.
          </p>
        </div>
      )}

      <div className="space-y-5">
        {scales.map((scale) => (
          <SliderRow
            key={scale.key}
            label={scale.label}
            value={levels[scale.key]}
            onChange={(v) => setLevels((prev) => ({ ...prev, [scale.key]: v }))}
          />
        ))}
      </div>

      <div>
        <Label>Do you currently experience any of the following?</Label>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {RED_FLAG_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 text-sm cursor-pointer hover:border-strentor-red"
            >
              <Checkbox checked={symptoms.includes(option.value)} onCheckedChange={() => toggleSymptom(option.value)} />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={symptoms.length === 0 || isSubmitting}
        className="h-12 w-full rounded-full bg-strentor-red hover:bg-strentor-red/80 disabled:opacity-50"
      >
        {isSubmitting ? "Logging..." : "Log Body Check"}
      </Button>
    </div>
  )
}
