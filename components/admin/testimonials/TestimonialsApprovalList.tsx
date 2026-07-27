"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export interface TestimonialRow {
  id: string
  nameDisplay: string
  programType: string | null
  testimonialText: string
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED"
  createdAt: string
  reviewType: string
  videoUrl: string | null
  cashbackAmount: number | null
  cashbackPaidAt: string | null
  payoutUpiId: string | null
}

function Row({ testimonial }: { testimonial: TestimonialRow }) {
  const [status, setStatus] = useState(testimonial.approvalStatus)
  const [cashbackPaidAt, setCashbackPaidAt] = useState(testimonial.cashbackPaidAt)
  const [isSaving, setIsSaving] = useState(false)

  async function updateStatus(next: "APPROVED" | "REJECTED") {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/testimonials/${testimonial.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvalStatus: next }),
      })
      if (!response.ok) {
        toast.error("Failed to update.")
        return
      }
      setStatus(next)
      toast.success(next === "APPROVED" ? "Testimonial approved." : "Testimonial rejected.")
    } catch {
      toast.error("Network error.")
    } finally {
      setIsSaving(false)
    }
  }

  async function markCashbackPaid() {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/testimonials/${testimonial.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markCashbackPaid: true }),
      })
      if (!response.ok) {
        toast.error("Failed to update.")
        return
      }
      setCashbackPaidAt(new Date().toISOString())
      toast.success("Marked as paid.")
    } catch {
      toast.error("Network error.")
    } finally {
      setIsSaving(false)
    }
  }

  const cashbackOwed = status === "APPROVED" && testimonial.cashbackAmount && !cashbackPaidAt

  return (
    <div className="border rounded-lg p-4 flex flex-wrap items-start justify-between gap-3">
      <div className="max-w-xl">
        <p className="font-semibold text-foreground">
          {testimonial.nameDisplay}
          {testimonial.programType && <span className="text-muted-foreground font-normal"> — {testimonial.programType}</span>}
          <Badge variant="outline" className="ml-2">{testimonial.reviewType}</Badge>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{testimonial.testimonialText}</p>
        {testimonial.videoUrl && (
          <a
            href={testimonial.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-sm text-primary underline"
          >
            View video
          </a>
        )}
        <p className="mt-1 text-xs text-muted-foreground">{new Date(testimonial.createdAt).toLocaleDateString()}</p>
        {testimonial.cashbackAmount && (
          <p className="mt-2 text-sm">
            Cashback: ₹{testimonial.cashbackAmount}
            {testimonial.payoutUpiId && <span className="text-muted-foreground"> → {testimonial.payoutUpiId}</span>}
            {cashbackPaidAt ? (
              <span className="ml-2 text-muted-foreground">(paid {new Date(cashbackPaidAt).toLocaleDateString()})</span>
            ) : status === "APPROVED" ? (
              <span className="ml-2 font-medium text-amber-600">owed</span>
            ) : (
              <span className="ml-2 text-muted-foreground">(pending approval)</span>
            )}
          </p>
        )}
      </div>
      <div className="flex flex-col items-end gap-2">
        <Badge variant={status === "APPROVED" ? "secondary" : status === "REJECTED" ? "destructive" : "default"}>{status}</Badge>
        {status === "PENDING" && (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => updateStatus("APPROVED")} disabled={isSaving}>Approve</Button>
            <Button size="sm" variant="outline" onClick={() => updateStatus("REJECTED")} disabled={isSaving}>Reject</Button>
          </div>
        )}
        {cashbackOwed && (
          <Button size="sm" variant="outline" onClick={markCashbackPaid} disabled={isSaving}>
            Mark cashback paid
          </Button>
        )}
      </div>
    </div>
  )
}

export function TestimonialsApprovalList({ testimonials }: { testimonials: TestimonialRow[] }) {
  if (testimonials.length === 0) {
    return <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">No testimonials submitted yet.</div>
  }
  return (
    <div className="space-y-3">
      {testimonials.map((t) => (
        <Row key={t.id} testimonial={t} />
      ))}
    </div>
  )
}
