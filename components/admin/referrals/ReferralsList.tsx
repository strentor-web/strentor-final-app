"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export interface ReferralAdminRow {
  id: string
  referrerName: string
  referrerEmail: string
  payoutUpiId: string | null
  referredName: string
  referredEmail: string
  status: "pending" | "converted" | "paid"
  cashbackAmount: number
  createdAt: string
}

function Row({ referral }: { referral: ReferralAdminRow }) {
  const [status, setStatus] = useState(referral.status)
  const [isSaving, setIsSaving] = useState(false)

  async function updateStatus(next: "converted" | "paid") {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/referrals/${referral.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        toast.error(body.error || "Failed to update.")
        return
      }
      setStatus(next)
      toast.success(next === "converted" ? "Marked converted — cashback now owed." : "Marked paid.")
    } catch {
      toast.error("Network error.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="border rounded-lg p-4 flex flex-wrap items-start justify-between gap-3">
      <div className="max-w-xl">
        <p className="font-semibold text-foreground">
          {referral.referredName} <span className="text-muted-foreground font-normal">— {referral.referredEmail}</span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Referred by {referral.referrerName} ({referral.referrerEmail})
          {referral.payoutUpiId && <span> → {referral.payoutUpiId}</span>}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{new Date(referral.createdAt).toLocaleDateString()}</p>
        <p className="mt-2 text-sm font-medium">₹{referral.cashbackAmount.toLocaleString("en-IN")}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <Badge variant={status === "paid" ? "secondary" : status === "converted" ? "default" : "outline"}>{status}</Badge>
        {status === "pending" && (
          <Button size="sm" onClick={() => updateStatus("converted")} disabled={isSaving}>
            Mark Converted
          </Button>
        )}
        {status === "converted" && (
          <Button size="sm" variant="outline" onClick={() => updateStatus("paid")} disabled={isSaving}>
            Mark Paid
          </Button>
        )}
      </div>
    </div>
  )
}

export function ReferralsList({ referrals }: { referrals: ReferralAdminRow[] }) {
  if (referrals.length === 0) {
    return <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">No referrals yet.</div>
  }
  return (
    <div className="space-y-3">
      {referrals.map((r) => (
        <Row key={r.id} referral={r} />
      ))}
    </div>
  )
}
