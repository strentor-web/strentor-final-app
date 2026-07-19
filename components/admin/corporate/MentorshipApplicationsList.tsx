"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export interface MentorshipApplicationRow {
  id: string
  userName: string
  userEmail: string
  goals: string
  readinessScore: number | null
  status: "PENDING" | "APPROVED" | "DECLINED"
  submittedAt: string
}

function Row({ application }: { application: MentorshipApplicationRow }) {
  const [status, setStatus] = useState(application.status)
  const [isSaving, setIsSaving] = useState(false)

  async function updateStatus(next: "APPROVED" | "DECLINED") {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/mentorship-applications/${application.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      })
      if (!response.ok) {
        toast.error("Failed to update.")
        return
      }
      setStatus(next)
      toast.success(next === "APPROVED" ? "Application approved." : "Application declined.")
    } catch {
      toast.error("Network error.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="border rounded-lg p-4 flex flex-wrap items-start justify-between gap-3">
      <div className="max-w-xl">
        <p className="font-semibold text-foreground">{application.userName}</p>
        <p className="text-sm text-muted-foreground">{application.userEmail}</p>
        <p className="mt-1 text-sm">{application.goals}</p>
        {application.readinessScore !== null && (
          <p className="mt-1 text-xs text-muted-foreground">Readiness score: {application.readinessScore}/60</p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">{new Date(application.submittedAt).toLocaleDateString()}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <Badge variant={status === "APPROVED" ? "secondary" : status === "DECLINED" ? "destructive" : "default"}>{status}</Badge>
        {status === "PENDING" && (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => updateStatus("APPROVED")} disabled={isSaving}>Approve</Button>
            <Button size="sm" variant="outline" onClick={() => updateStatus("DECLINED")} disabled={isSaving}>Decline</Button>
          </div>
        )}
      </div>
    </div>
  )
}

export function MentorshipApplicationsList({ applications }: { applications: MentorshipApplicationRow[] }) {
  if (applications.length === 0) {
    return <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">No Elite Mentorship applications yet.</div>
  }
  return (
    <div className="space-y-3">
      {applications.map((a) => (
        <Row key={a.id} application={a} />
      ))}
    </div>
  )
}
