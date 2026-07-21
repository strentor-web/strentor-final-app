"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export interface IntakeSubmissionRow {
  id: string
  pathway: string
  fullName: string
  email: string
  phone: string
  city: string | null
  country: string | null
  reviewLevel: string
  status: string
  sourcePage: string | null
  createdAt: string
}

function reviewLevelVariant(level: string) {
  if (level === "medical_clearance_likely_needed") return "destructive"
  if (level === "strentor_safety_review_needed") return "default"
  return "secondary"
}

function Row({ submission }: { submission: IntakeSubmissionRow }) {
  const [status, setStatus] = useState(submission.status)

  async function handleChange(next: string) {
    setStatus(next)
    try {
      const response = await fetch(`/api/admin/intake-submissions/${submission.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      })
      if (!response.ok) toast.error("Failed to update.")
    } catch {
      toast.error("Network error.")
    }
  }

  return (
    <div className="border rounded-lg p-4 flex flex-wrap items-start justify-between gap-3">
      <div className="max-w-xl">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-foreground">{submission.fullName}</p>
          <Badge variant="outline">{submission.pathway}</Badge>
          <Badge variant={reviewLevelVariant(submission.reviewLevel) as "destructive" | "default" | "secondary"}>
            {submission.reviewLevel.replace(/_/g, " ")}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {submission.email} • {submission.phone}
          {submission.city ? ` • ${submission.city}` : ""}
          {submission.country ? `, ${submission.country}` : ""}
        </p>
        {submission.sourcePage && (
          <p className="mt-1 text-xs text-muted-foreground">via {submission.sourcePage}</p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">{new Date(submission.createdAt).toLocaleString()}</p>
      </div>
      <Select value={status} onValueChange={handleChange}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="contacted">Contacted</SelectItem>
          <SelectItem value="converted">Converted</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export function IntakeSubmissionsList({ submissions }: { submissions: IntakeSubmissionRow[] }) {
  if (submissions.length === 0) {
    return <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">No intake submissions yet.</div>
  }
  return (
    <div className="space-y-3">
      {submissions.map((s) => (
        <Row key={s.id} submission={s} />
      ))}
    </div>
  )
}
