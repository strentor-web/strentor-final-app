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
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Copy, Mail } from "lucide-react"
import { useAction } from "@/hooks/useAction"
import { draftLeadFollowUp } from "@/actions/admin/lead-follow-up/draft-follow-up.action"
import { toggleSequencePause } from "@/actions/admin/lead-follow-up/toggle-sequence-pause.action"

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
  followUpsSent: number
  sequencePaused: boolean
}

function reviewLevelVariant(level: string) {
  if (level === "medical_clearance_likely_needed") return "destructive"
  if (level === "strentor_safety_review_needed") return "default"
  return "secondary"
}

function DraftFollowUpDialog({ submissionId }: { submissionId: string }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState("")

  const { execute, isLoading } = useAction(draftLeadFollowUp, {
    onSuccess: (data) => setDraft(data.draft),
    onError: (error) => toast.error(error),
  })

  function handleOpen(next: boolean) {
    setOpen(next)
    if (next && !draft) execute({ submissionId })
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(draft)
    toast.success("Copied to clipboard.")
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Draft Follow-Up
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Follow-Up Draft</DialogTitle>
        </DialogHeader>
        <Textarea
          value={isLoading ? "Drafting…" : draft}
          onChange={(e) => setDraft(e.target.value)}
          readOnly={isLoading}
          rows={10}
        />
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => execute({ submissionId })} disabled={isLoading}>
            Regenerate
          </Button>
          <Button type="button" onClick={handleCopy} disabled={isLoading || !draft}>
            <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function SequencePauseToggle({ submission }: { submission: IntakeSubmissionRow }) {
  const [paused, setPaused] = useState(submission.sequencePaused)

  const { execute, isLoading } = useAction(toggleSequencePause, {
    onError: (error) => toast.error(error),
  })

  function toggle() {
    const next = !paused
    setPaused(next)
    execute({ submissionId: submission.id, paused: next })
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={toggle} disabled={isLoading}>
      <Mail className="mr-1.5 h-3.5 w-3.5" />
      {paused ? "Resume follow-ups" : "Pause follow-ups"}
    </Button>
  )
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
          {submission.followUpsSent > 0 && (
            <Badge variant="secondary">
              {submission.followUpsSent} follow-up{submission.followUpsSent === 1 ? "" : "s"} sent
            </Badge>
          )}
          {submission.sequencePaused && <Badge variant="outline">Follow-ups paused</Badge>}
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
      <div className="flex items-center gap-2">
        <SequencePauseToggle submission={submission} />
        <DraftFollowUpDialog submissionId={submission.id} />
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
