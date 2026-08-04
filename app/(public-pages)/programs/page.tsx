"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import {
  Dumbbell,
  Apple,
  Brain,
  Users,
  ShieldCheck,
  Compass,
  Crown,
  Sparkles,
  Rocket,
  Building2,
  ArrowRight,
} from "lucide-react"
import { ScrollReveal, StaggerGroup } from "@/components/motion/ScrollReveal"
import { HoverLift } from "@/components/motion/HoverLift"
import { ProgramWheel3D } from "@/components/three/ProgramWheel3DLazy"
import { TrackedLink } from "@/components/analytics/TrackedLink"

// Every card links to a real, already-built program page — nothing here
// is invented or marked available ahead of business approval.
const programs = [
  {
    icon: Crown,
    title: "Elite Mentorship",
    description: "Private, high-touch coaching with direct founder access — for clients seeking fully integrated physical, mental, emotional, and purpose development.",
    cta: "Apply for Elite Mentorship",
    href: "/programs/elite-mentorship",
  },
  {
    icon: Sparkles,
    title: "Flagship Transformation",
    description: "A structured, four-phase program: assess and stabilise, build the foundation, progress strength, build independence.",
    cta: "Explore Flagship Transformation",
    href: "/programs/flagship-transformation",
  },
  {
    icon: Dumbbell,
    title: "Strength & Performance Coaching",
    description: "Focused adaptive strength training, nutrition guidance, and progress tracking — the core STRENTOR coaching program.",
    cta: "Explore Strength Coaching",
    href: "/programs/fitness-training",
  },
  {
    icon: Users,
    title: "Strength Circle",
    description: "Education, community, and group support — structured coaching for clients who prefer a group environment.",
    cta: "Join the Strength Circle",
    href: "/programs/membership",
  },
  {
    icon: Rocket,
    title: "7-Day Starter Kit",
    description: "A low-commitment introduction to adaptive strength training — exercise plan, video feedback, and daily tracking.",
    cta: "Get the Starter Kit",
    href: "/programs/starter-kit",
  },
  {
    icon: Building2,
    title: "Corporate & Institutional Programs",
    description: "Programs for companies, institutions, and organizations seeking wheelchair-first performance, wellbeing, or inclusion initiatives.",
    cta: "Discuss a Partnership",
    href: "/corporate",
  },
]

const pillars = [
  {
    title: "Seated Strength Training",
    description: "Adaptive upper-body strength training built for seated function.",
    icon: Dumbbell,
    color: "#C9A96A",
  },
  {
    title: "Nutrition Guidance",
    description: "Practical nutrition strategies that support energy and recovery.",
    icon: Apple,
    color: "#B8935A",
  },
  {
    title: "Mindset & Resilience",
    description: "Build confidence and a stronger, more resilient mindset.",
    icon: Brain,
    color: "#C9C0B4",
  },
  {
    title: "Weekly Accountability",
    description: "Weekly check-ins to keep you consistent and on track.",
    icon: Users,
    color: "#EDE0C8",
  },
  {
    title: "Safety-Aware Progression",
    description: "Program design that respects safety, health needs, and body limits.",
    icon: ShieldCheck,
    color: "#8A7554",
  },
  {
    title: "Purpose & Direction",
    description: "Training with a clear sense of purpose and where it's leading.",
    icon: Compass,
    color: "#3A3A38",
  },
]

// Conic-gradient wheel built from on-brand tonal variants only —
// gold / deep gold / silver / champagne / bronze / charcoal.
const wheelGradient = `conic-gradient(${pillars
  .map((p, i) => `${p.color} ${(i * 100) / pillars.length}% ${((i + 1) * 100) / pillars.length}%`)
  .join(", ")})`

export default function ProgramsPage() {
  const [show3DWheel, setShow3DWheel] = useState(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!reducedMotion) setShow3DWheel(true)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <div className="relative bg-black py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
        <div className="container relative mx-auto px-4 text-center">
          <ScrollReveal direction="none">
            <span className="text-sm font-bold uppercase tracking-widest text-[#C9A96A]">
              Programs
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.1} scale={0.96}>
            <h1 className="mt-4 text-4xl font-bold font-display text-white sm:text-5xl md:text-6xl">
              Coaching matched to your <span className="text-[#C9A96A]">goals and readiness</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
              STRENTOR runs several coaching programs, each built for a different level of support
              and commitment. The right fit for you is recommended after the Performance Assessment
              — but here is what exists today.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.3} className="mt-8">
            <Button asChild className="h-14 rounded-full bg-[#C9A96A] px-8 hover:bg-[#C9A96A]/90">
              <Link href="/apply-for-access">
                Take the Performance Assessment
              </Link>
            </Button>
          </ScrollReveal>
        </div>
      </div>

      {/* Wheel of Focus */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <ScrollReveal className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold font-display text-foreground sm:text-4xl">
            One Program, Six Pillars
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every week of the 12-week program touches all six pillars of holistic strength.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="mt-12 flex justify-center">
          <div className="relative h-64 w-64 sm:h-80 sm:w-80">
            {show3DWheel ? (
              <ProgramWheel3D
                segments={pillars.map((p) => ({ color: p.color }))}
                className="absolute inset-0"
                onError={() => setShow3DWheel(false)}
              />
            ) : (
              <div
                className="h-full w-full rounded-full shadow-2xl ring-1 ring-[#C9A96A]/30"
                style={{ background: wheelGradient }}
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-black shadow-lg ring-4 ring-black sm:h-28 sm:w-28">
                <Image
                  src="/strentor-icon.png"
                  alt="STRENTOR"
                  width={56}
                  height={56}
                  className="h-12 w-12 object-contain sm:h-14 sm:w-14"
                />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Pillar cards */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <StaggerGroup className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((pillar) => {
              const Icon = pillar.icon
              return (
                <ScrollReveal key={pillar.title}>
                  <HoverLift
                    className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-[#C9A96A]/40"
                  >
                    <div
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A96A]"
                    >
                      <Icon className="h-5 w-5 text-strentor-black" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-card-foreground">{pillar.title}</h3>
                      <p className="mt-1 text-muted-foreground">{pillar.description}</p>
                    </div>
                  </HoverLift>
                </ScrollReveal>
              )
            })}
          </StaggerGroup>
        </div>
      </section>

      {/* Program tiers */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold font-display text-foreground sm:text-4xl">
            Every current STRENTOR program
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Programs are recommended following your Performance Assessment. Pricing depends on
            your program, region, and coaching format — see individual program pages for detail.
          </p>
        </ScrollReveal>

        <StaggerGroup className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2">
          {programs.map((program) => (
            <ScrollReveal key={program.href}>
              <HoverLift className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-[#C9A96A]/40">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A96A]">
                  <program.icon className="h-5 w-5 text-strentor-black" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-card-foreground">{program.title}</h3>
                  <p className="mt-1 text-muted-foreground">{program.description}</p>
                </div>
                <TrackedLink
                  href={program.href}
                  event="program_view"
                  eventParams={{ program: program.title }}
                  className="group inline-flex items-center gap-1 font-semibold text-[#C9A96A] transition-colors hover:text-[#C9A96A]/80"
                >
                  {program.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </TrackedLink>
              </HoverLift>
            </ScrollReveal>
          ))}
        </StaggerGroup>
      </section>

      {/* Final CTA */}
      <section className="relative bg-black py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
        <ScrollReveal className="container relative mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-display text-white sm:text-4xl">
            Not sure which program fits you?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-300">
            Take the Performance Assessment and STRENTOR will recommend the right coaching
            pathway based on your goals, readiness, and current situation.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild className="h-14 rounded-full bg-[#C9A96A] px-8 hover:bg-[#C9A96A]/90">
              <Link href="/apply-for-access">Take the Performance Assessment</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-gray-400">
            Want to fund coaching for someone else instead?{" "}
            <Link href="/sponsor-a-seat" className="text-[#C9A96A] hover:underline">
              Sponsor a seat
            </Link>
          </p>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  )
}
