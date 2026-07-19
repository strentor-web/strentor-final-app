"use client"

import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import { IntakeForm } from "@/components/forms/intake/IntakeForm"
import { ScrollReveal, StaggerGroup } from "@/components/motion/ScrollReveal"
import { HoverLift } from "@/components/motion/HoverLift"
import { Check } from "lucide-react"

const steps = [
  {
    number: 1,
    title: "Application",
    description: "Submit your details",
  },
  {
    number: 2,
    title: "Review",
    description: "We review your application",
  },
  {
    number: 3,
    title: "Access Decision",
    description: "We assign the right access tier",
  },
  {
    number: 4,
    title: "Begin Program",
    description: "Start your 12-week journey",
  },
]

const eligibility = [
  "Wheelchair users (18+ years)",
  "Motivated to build strength & habits",
  "Ready to commit 2–4x per week",
  "Open to guidance & accountability",
  "Living with physical challenges, health realities, or long-term conditions",
]

export default function ApplyForAccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <div className="relative bg-black py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
        <ScrollReveal direction="none" duration={0.6} className="container relative mx-auto px-4 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-[#C9A96A]">
            Access Application
          </span>
          <h1 className="mt-4 text-4xl font-bold font-display text-white sm:text-5xl md:text-6xl">
            Apply for a <span className="text-[#C9A96A]">STRENTOR Access Seat</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
            Take the first step toward building seated strength, confidence,
            discipline, and daily fitness habits.
          </p>
        </ScrollReveal>
      </div>

      {/* 4-step process indicator */}
      <section className="border-b border-border bg-muted/30 py-14">
        <div className="container mx-auto px-4">
          <StaggerGroup className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <ScrollReveal key={step.number}>
                <HoverLift className="flex flex-col items-center text-center sm:items-start sm:text-left">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A96A] text-lg font-bold text-black">
                    {step.number}
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-foreground">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                </HoverLift>
              </ScrollReveal>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Two-column: eligibility + application form */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:items-start">
          {/* Left column: Who Can Apply */}
          <ScrollReveal direction="left" className="rounded-2xl border border-border bg-card p-8 lg:sticky lg:top-24">
            <h2 className="text-2xl font-bold font-display text-card-foreground">
              Who Can Apply?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              STRENTOR Access seats are for people who are ready to show up and build
              real, lasting strength.
            </p>
            <StaggerGroup as="ul" className="mt-6 space-y-4">
              {eligibility.map((item) => (
                <ScrollReveal key={item} as="li">
                  <HoverLift className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A96A]/10">
                      <Check className="h-3.5 w-3.5 text-[#C9A96A]" />
                    </span>
                    <span className="text-sm font-medium text-card-foreground">{item}</span>
                  </HoverLift>
                </ScrollReveal>
              ))}
            </StaggerGroup>
          </ScrollReveal>

          {/* Right column: Application form */}
          <div>
            <ScrollReveal direction="right">
              <h2 className="text-2xl font-bold font-display text-foreground">
                Application Form
              </h2>
            </ScrollReveal>
            <div className="mt-6">
              <IntakeForm initialPathway="personal" sourcePage="/apply-for-access" />
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Your information is safe and only used for program evaluation.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
