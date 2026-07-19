"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export interface SafetyFlagRow {
  id: string
  userName: string
  userEmail: string
  sourceType: string
  symptomType: string
  severity: "LOW" | "MEDIUM" | "HIGH"
  status: "OPEN" | "IN_REVIEW" | "RESOLVED"
  message: string
  adminNotes: string | null
  createdAt: string
}

function statusVariant(status: string) {
  if (status === "OPEN") return "destructive"
  if (status === "IN_REVIEW") return "default"
  return "secondary"
}

function FlagRow({ flag }: { flag: SafetyFlagRow }) {
  const [status, setStatus] = useState(flag.status)
  const [notes, setNotes] = useState(flag.adminNotes ?? "")
  const [isSaving, setIsSaving] = useState(false)

  async function handleSave() {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/safety-flags/${flag.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNotes: notes || undefined }),
      })
      if (!response.ok) {
        toast.error("Failed to update flag.")
        return
      }
      toast.success("Safety flag updated.")
    } catch {
      toast.error("Network error.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="border rounded-lg p-6 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-foreground">{flag.userName}</p>
          <p className="text-sm text-muted-foreground">{flag.userEmail}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={flag.severity === "HIGH" ? "destructive" : "outline"}>{flag.severity}</Badge>
          <Badge variant={statusVariant(status) as "destructive" | "default" | "secondary"}>{status}</Badge>
        </div>
      </div>

      <div className="text-sm">
        <p><span className="text-muted-foreground">Source:</span> {flag.sourceType}</p>
        <p><span className="text-muted-foreground">Symptoms:</span> {flag.symptomType}</p>
        <p className="mt-1 text-muted-foreground">{flag.message}</p>
        <p className="mt-1 text-xs text-muted-foreground">{new Date(flag.createdAt).toLocaleString()}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-[200px_1fr]">
        <Select value={status} onValueChange={(v) => setStatus(v as SafetyFlagRow["status"])}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="IN_REVIEW">In Review</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
          </SelectContent>
        </Select>
        <Textarea
          placeholder="Admin notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />
      </div>

      <Button onClick={handleSave} disabled={isSaving} size="sm">
        {isSaving ? "Saving..." : "Save"}
      </Button>
    </div>
  )
}

export function SafetyFlagsTable({ flags }: { flags: SafetyFlagRow[] }) {
  if (flags.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground bg-muted/30 rounded-lg">
        No safety flags recorded.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {flags.map((flag) => (
        <FlagRow key={flag.id} flag={flag} />
      ))}
    </div>
  )
}
