"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/utils/supabase/client"
import Link from "next/link"

export function TestimonialSubmitForm() {
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [isAuthed, setIsAuthed] = useState(false)
  const [nameDisplay, setNameDisplay] = useState("")
  const [programType, setProgramType] = useState("")
  const [testimonialText, setTestimonialText] = useState("")
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

  async function handleSubmit() {
    if (!nameDisplay.trim() || testimonialText.trim().length < 10 || isSubmitting) return
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/testimonials/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameDisplay,
          programType: programType || undefined,
          testimonialText,
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
          Your story is pending review and may be featured on our site.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-8">
      <h3 className="text-xl font-bold text-card-foreground">Share Your Story</h3>
      <div className="mt-4 space-y-4">
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
      </div>
      <Button
        onClick={handleSubmit}
        disabled={!nameDisplay.trim() || testimonialText.trim().length < 10 || isSubmitting}
        className="mt-6 h-11 w-full rounded-full bg-[#C9A96A] hover:bg-[#C9A96A]/90 disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit Your Story"}
      </Button>
    </div>
  )
}
