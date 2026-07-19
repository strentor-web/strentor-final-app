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
}

function Row({ testimonial }: { testimonial: TestimonialRow }) {
  const [status, setStatus] = useState(testimonial.approvalStatus)
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

  return (
    <div className="border rounded-lg p-4 flex flex-wrap items-start justify-between gap-3">
      <div className="max-w-xl">
        <p className="font-semibold text-foreground">
          {testimonial.nameDisplay}
          {testimonial.programType && <span className="text-muted-foreground font-normal"> — {testimonial.programType}</span>}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{testimonial.testimonialText}</p>
        <p className="mt-1 text-xs text-muted-foreground">{new Date(testimonial.createdAt).toLocaleDateString()}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <Badge variant={status === "APPROVED" ? "secondary" : status === "REJECTED" ? "destructive" : "default"}>{status}</Badge>
        {status === "PENDING" && (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => updateStatus("APPROVED")} disabled={isSaving}>Approve</Button>
            <Button size="sm" variant="outline" onClick={() => updateStatus("REJECTED")} disabled={isSaving}>Reject</Button>
          </div>
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
