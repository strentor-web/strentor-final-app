"use client"

import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import {
  Dumbbell,
  Apple,
  Sparkles,
  ShieldCheck,
  CalendarCheck,
  Trophy,
  FlaskConical,
} from "lucide-react"
import Link from "next/link"

const impactCategories = [
  {
    icon: Dumbbell,
    title: "Strength & Endurance",
    description:
      "Improved upper-body strength, seated endurance, and daily functional ability.",
  },
  {
    icon: Apple,
    title: "Nutrition & Lifestyle",
    description:
      "Healthier nutrition habits, better energy, and lifestyle choices.",
  },
  {
    icon: Sparkles,
    title: "Confidence & Identity",
    description:
      "Stronger self-belief, resilient identity, and confidence.",
  },
  {
    icon: ShieldCheck,
    title: "Safety & Health Awareness",
    description:
      "Training with safety, health realities, and smart adjustments.",
  },
  {
    icon: CalendarCheck,
    title: "Discipline & Consistency",
    description:
      "Stronger discipline, better structure, and real habit-building.",
  },
  {
    icon: Trophy,
    title: "Program Completion",
    description:
      "Training completion, program completion, and real-world results.",
  },
]

const impactStats = [
  { label: "Participants", value: "00+" },
  { label: "Active Participants", value: "00+" },
  { label: "Program Completions", value: "00+" },
  { label: "Access Seats Sponsored", value: "00+" },
  { label: "Partner Organizations", value: "00+" },
  { label: "Lives Impacted", value: "00+" },
]

export default function ImpactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <div className="relative bg-black py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
        <div className="container relative mx-auto px-4 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-[#C9A96A]">
            Our Impact
          </span>
          <h1 className="mt-4 text-4xl font-bold font-display text-white sm:text-5xl md:text-6xl">
            How <span className="text-[#C9A96A]">STRENTOR</span> Measures Impact
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
            We track real change in strength, habits, confidence, and daily life.
          </p>
        </div>
      </div>

      {/* Impact categories */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center text-3xl font-bold font-display text-foreground sm:text-4xl">
            What We Track
          </h2>
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
            {impactCategories.map((category) => (
              <div
                key={category.title}
                className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A96A]">
                  <category.icon className="h-5 w-5 text-strentor-black" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-card-foreground">
                    {category.title}
                  </h3>
                  <p className="mt-1 text-muted-foreground">{category.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact dashboard stat row */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-3 text-center text-3xl font-bold font-display text-foreground sm:text-4xl">
          Impact Dashboard
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-center text-muted-foreground">
          STRENTOR is early-stage and building its track record in public. These
          figures will populate as our program data is finalized.
        </p>
        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-6">
          {impactStats.map((stat) => (
            <div
              key={stat.label}
              className="flex min-w-[9.5rem] flex-1 flex-col items-center rounded-2xl border border-border bg-card px-6 py-8 text-center shadow-sm"
            >
              <span className="text-4xl font-bold font-display text-[#C9A96A] sm:text-5xl">
                {stat.value}
              </span>
              <span className="mt-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Case studies in progress */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-2xl border border-[#C9A96A]/30 bg-[#C9A96A]/5 p-8 text-center">
            <FlaskConical className="h-8 w-8 flex-shrink-0 text-[#C9A96A]" />
            <h2 className="text-2xl font-bold font-display text-white sm:text-3xl">
              Case Studies in Progress
            </h2>
            <p className="text-gray-300">
              STRENTOR is currently building its first specific wheelchair-user case
              studies. Detailed stories will be published as they complete the
              program.
            </p>
            <Button
              asChild
              className="mt-2 h-12 rounded-full bg-[#C9A96A] px-8 hover:bg-[#C9A96A]/90"
            >
              <Link href="/sponsor-a-seat">Sponsor a Seat</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
