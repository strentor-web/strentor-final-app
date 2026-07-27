"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { createClient } from "@/utils/supabase/client"
import Link from "next/link"

type ReviewType = "TEXT" | "VIDEO"

const CASHBACK_BY_TYPE: Record<ReviewType, number> = { TEXT: 500, VIDEO: 1000 }

export function TestimonialSubmitForm() {
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [isAuthed, setIsAuthed] = useState(false)
  const [nameDisplay, setNameDisplay] = useState("")
  const [programType, setProgramType] = useState("")
  const [testimonialText, setTestimonialText] = useState("")
  const [reviewType, setReviewType] = useState<ReviewType>("TEXT")
  const [videoUrl, setVideoUrl] = useState("")
  const [upiId, setUpiId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAuthed(!!user)
      if (user?.user_metadata?.full_name) setNameDisplay(user.user_metadata.full_name)
      setCheckingAuth(false)
    })
  }, [])

  const canSubmit =
    nameDisplay.trim().length > 0 &&
    testimonialText.trim().length >= 10 &&
    upiId.trim().length > 0 &&
    (reviewType === "TEXT" || videoUrl.trim().length > 0) &&
    !isSubmitting

  async function handleSubmit() {
    if (!canSubmit) return
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/testimonials/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameDisplay,
          programType: programType || undefined,
          testimonialText,
          reviewType,
          videoUrl: reviewType === "VIDEO" ? videoUrl : undefined,
          upiId,
        }),
      })
      if (!response.ok) {
        toast.error("Something went wrong. Please try again.")
        return
      }
      setSubmitted(true)
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (checkingAuth) return null

  if (!isAuthed) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <h3 className="text-xl font-bold text-card-foreground">Share Your Story</h3>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to submit a testimonial.</p>
        <Button asChild className="mt-4 h-11 rounded-full bg-[#C9A96A] px-8 hover:bg-[#C9A96A]/90">
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-[#C9A96A]/30 bg-[#C9A96A]/5 p-8 text-center">
        <h3 className="text-xl font-bold text-foreground">Thank you for sharing</h3>
        <p className="mt-2 text-muted-foreground">
          Your story is pending review. Once approved, we'll send ₹{CASHBACK_BY_TYPE[reviewType]} to the UPI ID
          you provided.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-8">
      <h3 className="text-xl font-bold text-card-foreground">Share Your Story</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get ₹500 for a text review, or ₹1,000 for a video review — paid out once your review is approved.
      </p>
      <div className="mt-4 space-y-4">
        <div>
          <Label>Review type</Label>
          <RadioGroup
            className="mt-2 flex gap-4"
            value={reviewType}
            onValueChange={(v) => setReviewType(v as ReviewType)}
          >
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="TEXT" /> Text — ₹500
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="VIDEO" /> Video — ₹1,000
            </label>
          </RadioGroup>
        </div>
        <div>
          <Label htmlFor="nameDisplay">Name to display</Label>
          <Input id="nameDisplay" value={nameDisplay} onChange={(e) => setNameDisplay(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="programType">Program (optional)</Label>
          <Input id="programType" value={programType} onChange={(e) => setProgramType(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="testimonialText">Your story</Label>
          <Textarea id="testimonialText" value={testimonialText} onChange={(e) => setTestimonialText(e.target.value)} rows={4} />
        </div>
        {reviewType === "VIDEO" && (
          <div>
            <Label htmlFor="videoUrl">Video link</Label>
            <Input
              id="videoUrl"
              type="url"
              placeholder="https://youtube.com/... or https://drive.google.com/..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Upload your video to YouTube, Instagram, or Google Drive first, then paste the link here.
            </p>
          </div>
        )}
        <div>
          <Label htmlFor="upiId">UPI ID (for cashback)</Label>
          <Input id="upiId" placeholder="yourname@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
        </div>
      </div>
      <Button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="mt-6 h-11 w-full rounded-full bg-[#C9A96A] hover:bg-[#C9A96A]/90 disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit Your Story"}
      </Button>
    </div>
  )
}
