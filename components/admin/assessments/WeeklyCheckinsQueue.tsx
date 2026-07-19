"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export interface CheckinRow {
  id: string
  userName: string
  userEmail: string
  weekStart: string
  wins: string | null
  barriers: string | null
  supportNeeded: boolean
  redFlagDetected: boolean
  coachReviewStatus: "PENDING" | "REVIEWED"
}

function Row({ checkin }: { checkin: CheckinRow }) {
  const [status, setStatus] = useState(checkin.coachReviewStatus)
  const [isSaving, setIsSaving] = useState(false)

  async function markReviewed() {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/weekly-checkins/${checkin.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coachReviewStatus: "REVIEWED" }),
      })
      if (!response.ok) {
        toast.error("Failed to update.")
        return
      }
      setStatus("REVIEWED")
      toast.success("Marked reviewed.")
    } catch {
      toast.error("Network error.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="border rounded-lg p-4 flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="font-semibold text-foreground">{checkin.userName}</p>
        <p className="text-sm text-muted-foreground">{checkin.userEmail} • Week of {new Date(checkin.weekStart).toLocaleDateString()}</p>
        {checkin.wins && <p className="mt-1 text-sm"><span className="text-muted-foreground">Wins:</span> {checkin.wins}</p>}
        {checkin.barriers && <p className="mt-1 text-sm"><span className="text-muted-foreground">Barriers:</span> {checkin.barriers}</p>}
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="flex gap-2">
          {checkin.redFlagDetected && <Badge variant="destructive">Safety Flag</Badge>}
          {checkin.supportNeeded && <Badge variant="outline">Support Requested</Badge>}
          <Badge variant={status === "REVIEWED" ? "secondary" : "default"}>{status}</Badge>
        </div>
        {status === "PENDING" && (
          <Button size="sm" onClick={markReviewed} disabled={isSaving}>
            {isSaving ? "Saving..." : "Mark Reviewed"}
          </Button>
        )}
      </div>
    </div>
  )
}

export function WeeklyCheckinsQueue({ checkins }: { checkins: CheckinRow[] }) {
  if (checkins.length === 0) {
    return <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">No weekly check-ins yet.</div>
  }
  return (
    <div className="space-y-3">
      {checkins.map((c) => (
        <Row key={c.id} checkin={c} />
      ))}
    </div>
  )
}
