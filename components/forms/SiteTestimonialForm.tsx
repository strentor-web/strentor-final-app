"use client"

import { useState } from "react"
import { toast } from "sonner"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"

export function SiteTestimonialForm() {
  const [name, setName] = useState("")
  const [context, setContext] = useState("")
  const [testimonial, setTestimonial] = useState("")
  const [consent, setConsent] = useState(false)
  // Honeypot field — kept out of visual layout via sr-only + tabIndex -1,
  // not display:none, since some spam bots skip fields with display:none.
  const [website, setWebsite] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [caseStudyPublished, setCaseStudyPublished] = useState(false)

  // Optional, additive: a full case study page, generated from these
  // answers and auto-published — separate from the base testimonial,
  // which always publishes regardless of whether this section is used.
  const [wantsCaseStudy, setWantsCaseStudy] = useState(false)
  const [condition, setCondition] = useState("")
  const [startingPoint, setStartingPoint] = useState("")
  const [approach, setApproach] = useState("")
  const [progress, setProgress] = useState("")
  const [caseStudyConsent, setCaseStudyConsent] = useState(false)

  const hasCaseStudyContent = !!(startingPoint.trim() || approach.trim() || progress.trim() || condition.trim())
  const canSubmit =
    name.trim().length > 0 &&
    testimonial.trim().length >= 20 &&
    consent &&
    !isSubmitting &&
    (!hasCaseStudyContent || caseStudyConsent)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/site-testimonials/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          testimonial: testimonial.trim(),
          context: context.trim() || undefined,
          consent: true,
          sourcePage: "/transformation-stories/share",
          website,
          condition: condition.trim() || undefined,
          startingPoint: startingPoint.trim() || undefined,
          approach: approach.trim() || undefined,
          progress: progress.trim() || undefined,
          caseStudyConsent: hasCaseStudyContent ? caseStudyConsent : undefined,
        }),
      })

      if (response.status === 429) {
        toast.error("Too many submissions right now. Please try again in a few minutes.")
        return
      }
      if (!response.ok) {
        toast.error("Something went wrong. Please try again.")
        return
      }

      const result = await response.json().catch(() => null)
      setCaseStudyPublished(!!result?.caseStudy?.published)
      setSubmitted(true)
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-[#C9A96A]/30 bg-card p-8 text-center">
        <h3 className="text-xl font-bold text-card-foreground">Thank you — your story is now live</h3>
        <p className="mt-2 text-muted-foreground">
          It's published on the Transformation Stories page right now.
        </p>
        {caseStudyPublished && (
          <p className="mt-2 text-muted-foreground">
            Your full case study page has also been published — it'll appear on the site within a few minutes.
          </p>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border bg-card p-8">
      <div>
        <Label htmlFor="testimonial-name" className="text-base font-semibold text-card-foreground">
          Your name
        </Label>
        <Input
          id="testimonial-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="How you'd like your name shown"
          className="mt-2"
          maxLength={200}
          required
        />
      </div>

      <div>
        <Label htmlFor="testimonial-context" className="text-base font-semibold text-card-foreground">
          Program or context <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="testimonial-context"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="e.g. Strength & Performance Coaching, 6 months"
          className="mt-2"
          maxLength={300}
        />
      </div>

      <div>
        <Label htmlFor="testimonial-text" className="text-base font-semibold text-card-foreground">
          Your story
        </Label>
        <Textarea
          id="testimonial-text"
          value={testimonial}
          onChange={(e) => setTestimonial(e.target.value)}
          placeholder="Tell us what working with STRENTOR has been like for you."
          className="mt-2 min-h-32"
          maxLength={2000}
          required
        />
        <p className="mt-1 text-xs text-muted-foreground">{testimonial.length}/2000</p>
      </div>

      <Collapsible open={wantsCaseStudy} onOpenChange={setWantsCaseStudy}>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-xl border border-border px-4 py-3 text-left text-sm font-semibold text-card-foreground hover:border-[#C9A96A]/50"
          >
            Want to share more for a full case study page?
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${wantsCaseStudy ? "rotate-180" : ""}`}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 space-y-4 rounded-xl border border-dashed border-border p-4">
          <p className="text-xs text-muted-foreground">
            This publishes a separate, longer page with your starting point, how coaching went, and
            where you are now — in addition to the quote above, not instead of it.
          </p>

          <div>
            <Label htmlFor="cs-condition" className="text-sm font-semibold text-card-foreground">
              Condition <span className="font-normal text-muted-foreground">(optional, shown on the page)</span>
            </Label>
            <Input
              id="cs-condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="e.g. Spina Bifida, wears an AFO"
              className="mt-2"
              maxLength={200}
            />
          </div>

          <div>
            <Label htmlFor="cs-starting" className="text-sm font-semibold text-card-foreground">
              What was your starting point?
            </Label>
            <Textarea
              id="cs-starting"
              value={startingPoint}
              onChange={(e) => setStartingPoint(e.target.value)}
              placeholder="Before training with STRENTOR..."
              className="mt-2 min-h-24"
              maxLength={2000}
            />
          </div>

          <div>
            <Label htmlFor="cs-approach" className="text-sm font-semibold text-card-foreground">
              What was the coaching like?
            </Label>
            <Textarea
              id="cs-approach"
              value={approach}
              onChange={(e) => setApproach(e.target.value)}
              placeholder="How training was built around you..."
              className="mt-2 min-h-24"
              maxLength={2000}
            />
          </div>

          <div>
            <Label htmlFor="cs-progress" className="text-sm font-semibold text-card-foreground">
              Where are you now?
            </Label>
            <Textarea
              id="cs-progress"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              placeholder="What's changed, what you can do now..."
              className="mt-2 min-h-24"
              maxLength={2000}
            />
          </div>

          <label className="flex items-start gap-3 text-sm cursor-pointer">
            <Checkbox checked={caseStudyConsent} onCheckedChange={(v) => setCaseStudyConsent(v === true)} />
            <span className="text-card-foreground">
              I also consent to STRENTOR publishing a full case study page with these details, publicly
              and immediately.
            </span>
          </label>
        </CollapsibleContent>
      </Collapsible>

      {/* Honeypot — invisible to real visitors, hidden with off-screen
          positioning rather than display:none (some bots skip hidden
          fields specifically to avoid this trick). */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="testimonial-website">Website</label>
        <input
          id="testimonial-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <label className="flex items-start gap-3 text-sm cursor-pointer">
        <Checkbox checked={consent} onCheckedChange={(v) => setConsent(v === true)} />
        <span className="text-card-foreground">
          I consent to STRENTOR publishing this testimonial, including my name, on the STRENTOR
          website.
        </span>
      </label>

      <Button
        type="submit"
        disabled={!canSubmit}
        className="h-12 w-full rounded-full bg-[#C9A96A] hover:bg-[#C9A96A]/90 disabled:opacity-50"
      >
        {isSubmitting ? "Publishing..." : "Publish My Story"}
      </Button>
    </form>
  )
}
