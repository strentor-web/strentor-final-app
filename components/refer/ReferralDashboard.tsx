"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export interface ReferralRow {
  id: string
  referredName: string
  referredEmail: string
  status: "pending" | "converted" | "paid"
  cashbackAmount: number
  createdAt: string
}

interface Props {
  referralLink: string
  initialUpiId: string
  referrals: ReferralRow[]
}

const STATUS_LABELS: Record<ReferralRow["status"], string> = {
  pending: "Applied — pending",
  converted: "Converted — cashback owed",
  paid: "Paid",
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
}

export function ReferralDashboard({ referralLink, initialUpiId, referrals }: Props) {
  const [upiId, setUpiId] = useState(initialUpiId)
  const [savedUpiId, setSavedUpiId] = useState(initialUpiId)
  const [isSavingUpi, setIsSavingUpi] = useState(false)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(referralLink)
      toast.success("Referral link copied.")
    } catch {
      toast.error("Couldn't copy — copy the link manually.")
    }
  }

  async function saveUpi() {
    if (!upiId.trim() || isSavingUpi) return
    setIsSavingUpi(true)
    try {
      const response = await fetch("/api/referrals/upi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ upiId: upiId.trim() }),
      })
      if (!response.ok) {
        toast.error("Failed to save.")
        return
      }
      setSavedUpiId(upiId.trim())
      toast.success("UPI ID saved.")
    } catch {
      toast.error("Network error.")
    } finally {
      setIsSavingUpi(false)
    }
  }

  const owedTotal = referrals.filter((r) => r.status === "converted").reduce((sum, r) => sum + r.cashbackAmount, 0)
  const paidTotal = referrals.filter((r) => r.status === "paid").reduce((sum, r) => sum + r.cashbackAmount, 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <Label>Your referral link</Label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <Input readOnly value={referralLink} className="font-mono text-sm" />
          <Button onClick={copyLink} className="shrink-0">Copy Link</Button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Share this with a friend. When they apply and become a paying client, you get ₹2,000.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <Label htmlFor="referral-upi">Payout UPI ID</Label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <Input id="referral-upi" placeholder="yourname@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
          <Button variant="outline" onClick={saveUpi} disabled={isSavingUpi || upiId.trim() === savedUpiId} className="shrink-0">
            {isSavingUpi ? "Saving..." : "Save"}
          </Button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">This is where cashback gets sent — for both referrals and reviews.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Owed</p>
          <p className="mt-2 text-3xl font-bold text-card-foreground">₹{owedTotal.toLocaleString("en-IN")}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Paid out so far</p>
          <p className="mt-2 text-3xl font-bold text-card-foreground">₹{paidTotal.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {referrals.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
          No referrals yet — share your link to get started.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Cashback</th>
                <th className="px-4 py-3 font-medium">Applied</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-card-foreground">{r.referredName}</td>
                  <td className="px-4 py-3">
                    <Badge variant={r.status === "paid" ? "secondary" : r.status === "converted" ? "default" : "outline"}>
                      {STATUS_LABELS[r.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">₹{r.cashbackAmount.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(r.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
