import Link from "next/link"
import type { Metadata } from "next"
import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import { ScrollReveal, StaggerGroup } from "@/components/motion/ScrollReveal"
import { HoverLift } from "@/components/motion/HoverLift"
import { ShieldCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "Start Here",
  description: "How the STRENTOR guided transformation journey works, from readiness checklist to coaching.",
  alternates: { canonical: "/start-here" },
}

const journey = [
  {
    number: 1,
    title: "Free Readiness Checklist",
    description: "A quick, no-pressure check-in so we understand where you're starting from.",
    href: "/readiness-checklist",
    cta: "Take the Checklist",
  },
  {
    number: 2,
    title: "Safety Disclaimer & Consent",
    description: "Read how STRENTOR coaching works alongside — never in place of — your medical care.",
    href: "/safety-disclaimer",
    cta: "Read & Continue",
  },
  {
    number: 3,
    title: "Readiness Assessment",
    description: "A few honest questions about your training, energy, routine, and any safety concerns.",
    href: "/assessment",
    cta: "Start Assessment",
  },
  {
    number: 4,
    title: "Your Recommended Pathway",
    description: "A clear, deterministic recommendation — never a guess — with the reason behind it.",
    href: null,
    cta: null,
  },
  {
    number: 5,
    title: "7-Day Starter Kit or Program",
    description: "Begin with a low-friction starter sequence or the full 12-week program, based on your pathway.",
    href: "/programs",
    cta: "See Programs",
  },
  {
    number: 6,
    title: "Tracker & Weekly Check-In",
    description: "Log pain, fatigue, energy, and habits inside your dashboard once you begin your program.",
    href: null,
    cta: null,
  },
  {
    number: 7,
    title: "Discovery Call & Upgrade Path",
    description: "When you're ready for more support, book a call or explore Elite Mentorship and Corporate Wellness.",
    href: "/contact",
    cta: "Book a Call",
  },
]

export default function StartHerePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="relative bg-black py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
        <ScrollReveal direction="none" className="container relative mx-auto px-4 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-[#C9A96A]">
            How STRENTOR Works
          </span>
          <h1 className="mt-4 text-4xl font-bold font-display text-white sm:text-5xl md:text-6xl">
            Start Here
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
            Built for wheelchair users. Guided by lived experience. Designed for strength, health,
            and limitless ambition.
          </p>
        </ScrollReveal>
      </div>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A96A]/10">
            <ShieldCheck className="h-6 w-6 text-[#C9A96A]" />
          </div>
          <h2 className="mt-4 text-2xl font-bold font-display text-foreground">
            You will never be told to push through pain.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Every step below is designed to help you start safely, track honestly, and get
            professional guidance the moment it's needed — never automatically progressed past a
            safety concern.
          </p>
        </ScrollReveal>

        <StaggerGroup className="mx-auto mt-14 max-w-3xl space-y-6">
          {journey.map((step) => (
            <ScrollReveal key={step.number}>
              <HoverLift className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A96A] text-base font-bold text-black">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-card-foreground">{step.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {step.href && step.cta && (
                  <Button
                    asChild
                    variant="outline"
                    className="h-10 flex-shrink-0 rounded-full border-[#C9A96A] px-6 text-[#C9A96A] hover:bg-[#C9A96A]/10"
                  >
                    <Link href={step.href}>{step.cta}</Link>
                  </Button>
                )}
              </HoverLift>
            </ScrollReveal>
          ))}
        </StaggerGroup>
      </section>

      <ScrollReveal as="section" className="bg-black py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-display text-white sm:text-4xl">
            Ready for step one?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-300">
            The Free Readiness Checklist takes less than two minutes.
          </p>
          <div className="mt-8">
            <Button asChild className="h-14 rounded-full bg-[#C9A96A] px-8 hover:bg-[#C9A96A]/90">
              <Link href="/readiness-checklist">Take the Readiness Checklist</Link>
            </Button>
          </div>
        </div>
      </ScrollReveal>

      <Footer />
    </div>
  )
}
