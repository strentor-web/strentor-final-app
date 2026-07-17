"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, ShieldAlert } from "lucide-react"

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-sm font-bold uppercase tracking-widest text-[#C9A96A]">{children}</span>
  )
}

export function ValueProposition() {
  return (
    <section className="container mx-auto px-4 py-16 text-center">
      <Eyebrow>Core Value Proposition</Eyebrow>
      <h2 className="mt-4 text-3xl font-bold font-display text-foreground sm:text-4xl">
        Strength coaching built for <span className="text-[#C9A96A]">real bodies, real limits, real goals</span>
      </h2>
      <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground">
        STRENTOR combines adaptive fitness coaching, mindset discipline, and emotional resilience into a
        single, health-respecting system — designed for wheelchair users, people managing chronic health
        conditions, and anyone returning to fitness after illness, surgery, or a long gap. It's premium
        coaching that respects where you actually are, not a generic program stretched to fit.
      </p>
    </section>
  )
}

export function ProblemSection() {
  return (
    <section className="bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>The Problem</Eyebrow>
          <h2 className="mt-4 text-3xl font-bold font-display text-foreground sm:text-4xl">
            Generic fitness advice wasn't built for you
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Most fitness content assumes a standing body, full mobility, and no chronic health context.
            For wheelchair users and people managing conditions like Spina Bifida, CKD, or long-term pain,
            that advice doesn't just fail to help — it can be unsafe. Generic programs don't account for
            transfer strain, pressure risk, dialysis schedules, or doctor-advised restrictions, and most
            trainers simply aren't trained to.
          </p>
        </div>
      </div>
    </section>
  )
}

export function DifferenceSection() {
  const points = [
    { title: "Built from lived experience", description: "Founded by a national-level para powerlifter who trains from the same reality clients do." },
    { title: "Health-respecting by design", description: "Every program factors in your actual health context — not a standing-body template adapted after the fact." },
    { title: "Safety before intensity", description: "We build capacity progressively, with pain-aware and fatigue-aware adjustments as standard practice." },
    { title: "Premium, not performative", description: "This is structured, disciplined coaching — not an inspirational campaign or a charity gesture." },
  ]
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center">
        <Eyebrow>The STRENTOR Difference</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold font-display text-foreground sm:text-4xl">
          What makes this different
        </h2>
      </div>
      <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
        {points.map((point) => (
          <div key={point.title} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A96A]">
              <Check className="h-5 w-5 text-strentor-black" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-card-foreground">{point.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{point.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function WhoItsFor() {
  const audiences = [
    "Wheelchair users — manual and power",
    "People with paraplegia, quadriplegia, or Spina Bifida",
    "People managing CKD, diabetes, cardiac, or neurological conditions",
    "People using canes, walkers, or crutches",
    "People returning to fitness after illness, surgery, or a long gap",
    "Anyone seeking strength, confidence, and discipline within their real health context",
  ]
  return (
    <section className="bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <Eyebrow>Who STRENTOR Is For</Eyebrow>
          <h2 className="mt-4 text-3xl font-bold font-display text-foreground sm:text-4xl">
            Coaching for real, specific circumstances
          </h2>
        </div>
        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
          {audiences.map((audience) => (
            <div key={audience} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#C9A96A]" />
              <span className="text-sm text-card-foreground">{audience}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CoachingPillars() {
  const pillars = [
    { title: "Strength", description: "Upper-body, seated, and functional strength built progressively." },
    { title: "Discipline", description: "Structured routine and accountability, not motivation alone." },
    { title: "Confidence", description: "Capability built through consistent, visible progress." },
    { title: "Health-respecting progress", description: "Pain-aware, fatigue-aware, and safety-first programming." },
  ]
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center">
        <Eyebrow>Core Coaching Pillars</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold font-display text-foreground sm:text-4xl">
          Four pillars, one system
        </h2>
      </div>
      <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((pillar) => (
          <div key={pillar.title} className="rounded-2xl border border-border bg-card p-6 text-center">
            <h3 className="text-lg font-bold text-[#C9A96A]">{pillar.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{pillar.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function HowItWorks() {
  const steps = [
    { step: "1", title: "Fit Assessment", description: "Tell us about your training context, health realities, and goals." },
    { step: "2", title: "Plan design", description: "We build a program around your equipment, ability, and health context." },
    { step: "3", title: "Coached sessions", description: "Train with structured guidance, form review, and check-ins." },
    { step: "4", title: "Progression", description: "We adjust intensity and complexity as your capacity builds." },
  ]
  return (
    <section className="bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <Eyebrow>How STRENTOR Works</Eyebrow>
          <h2 className="mt-4 text-3xl font-bold font-display text-foreground sm:text-4xl">
            A structured, safety-first process
          </h2>
        </div>
        <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.step} className="rounded-2xl border border-border bg-card p-6">
              <span className="text-3xl font-bold text-[#C9A96A]">{s.step}</span>
              <h3 className="mt-3 text-lg font-bold text-card-foreground">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function PayItForwardIntro() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl rounded-2xl border border-[#C9A96A]/30 bg-[#C9A96A]/5 p-8 text-center sm:p-12">
        <Eyebrow>Access Support</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold font-display text-foreground sm:text-4xl">
          Each One, Pay One. Pay It Forward.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Sponsor part or full coaching access for someone who needs support — individually, or as a
          company or community group.
        </p>
        <Button asChild className="mt-6 bg-[#C9A96A] hover:bg-[#C9A96A]/90 text-primary-foreground rounded-full px-8">
          <Link href="/pay-it-forward">Learn About Pay It Forward</Link>
        </Button>
      </div>
    </section>
  )
}

export function HomeMedicalNote() {
  return (
    <section className="container mx-auto px-4 pb-4">
      <div className="mx-auto flex max-w-3xl gap-4 rounded-xl border border-border bg-card p-6">
        <ShieldAlert className="h-6 w-6 flex-shrink-0 text-[#C9A96A]" />
        <p className="text-sm text-muted-foreground">
          STRENTOR provides fitness and nutrition coaching, not medical treatment or physiotherapy.
          Please consult your physician before beginning any new exercise program.
        </p>
      </div>
    </section>
  )
}

export function FinalCTA() {
  return (
    <div className="bg-black py-20 text-center">
      <h2 className="mb-4 text-4xl font-bold font-display text-white sm:text-5xl">
        Ready to <span className="text-[#C9A96A]">Become</span>?
      </h2>
      <p className="mx-auto max-w-[700px] pb-8 pt-2 text-gray-300 md:text-xl">
        Start with a Fit Assessment — we'll recommend the right path based on your goals and health context.
      </p>
      <Button asChild className="bg-[#C9A96A] hover:bg-[#C9A96A]/90 text-primary-foreground rounded-full px-8 py-6 text-lg">
        <Link href="/contact">Book Fit Assessment</Link>
      </Button>
    </div>
  )
}
