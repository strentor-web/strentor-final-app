"use client"

import Link from "next/link"
import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import { DiscoveryCallButton } from "@/components/forms/DiscoveryCallButton"
import { ScrollReveal, StaggerGroup } from "@/components/motion/ScrollReveal"
import { HoverLift } from "@/components/motion/HoverLift"
import { Check } from "lucide-react"
import { aiCoachingTiers } from "@/config/aiCoachingTiers"

const tierBullets: Record<string, string[]> = {
  ai_starter: ["Basic workouts", "Mindset exercises", "Habit tracking", "Limited AI conversations"],
  ai_coach: ["Full personalization", "Adaptive workouts", "Unlimited AI coaching conversations", "Progress tracking", "Weekly reports"],
  ai_human_review: ["Everything in AI Coach", "One detailed monthly review by a STRENTOR coach"],
  ai_human_accountability: ["Everything in AI + Human Review", "Weekly coach review", "Video-form feedback", "Priority adjustments"],
  full_transformation: ["Human-led premium fitness, mindset and transformation coaching", "Full AI support alongside your coach"],
}

export default function AiCoachingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <div className="relative bg-black py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
        <ScrollReveal direction="none" className="container relative mx-auto px-4 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-[#C9A96A]">
            STRENTOR AI
          </span>
          <h1 className="mt-4 text-4xl font-bold font-display text-white sm:text-5xl md:text-6xl">
            Coaching That Meets You <span className="text-[#C9A96A]">Where You Are</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
            From AI-guided basics to full 1:1 human-led transformation — five tiers, so you can
            start where you are and move up as your needs change.
          </p>
        </ScrollReveal>
      </div>

      {/* Pricing grid */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <StaggerGroup className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {aiCoachingTiers.map((tier) => {
            const isFeatured = tier.id === "ai_coach"
            return (
              <ScrollReveal key={tier.id}>
                <HoverLift
                  className={`flex h-full flex-col rounded-2xl border p-6 shadow-sm ${
                    isFeatured ? "border-[#C9A96A] bg-[#C9A96A]/5" : "border-border bg-card"
                  }`}
                >
                  {isFeatured && (
                    <span className="mb-3 inline-block w-fit rounded-full bg-[#C9A96A] px-3 py-1 text-xs font-bold uppercase tracking-wide text-black">
                      Most Popular
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-card-foreground">{tier.name}</h3>
                  <p className="mt-1 text-2xl font-bold font-display text-[#C9A96A]">{tier.price}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{tier.description}</p>

                  <ul className="mt-5 flex-1 space-y-2">
                    {(tierBullets[tier.id] ?? []).map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2 text-sm text-card-foreground">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#C9A96A]" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    {tier.ctaType === "self_serve" ? (
                      <Button
                        asChild
                        className={`h-11 w-full rounded-full ${
                          isFeatured
                            ? "bg-[#C9A96A] text-black hover:bg-[#C9A96A]/90"
                            : "bg-transparent border border-[#C9A96A] text-[#C9A96A] hover:bg-[#C9A96A]/10"
                        }`}
                      >
                        <Link href="/sign-up">Get Started</Link>
                      </Button>
                    ) : (
                      <DiscoveryCallButton
                        variant="outline"
                        className="h-11 w-full rounded-full border-[#C9A96A] text-[#C9A96A] hover:bg-[#C9A96A]/10"
                      >
                        Book a Discovery Call
                      </DiscoveryCallButton>
                    )}
                  </div>
                </HoverLift>
              </ScrollReveal>
            )
          })}
        </StaggerGroup>
      </section>

      {/* Final CTA */}
      <ScrollReveal as="section" className="bg-black py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-display text-white sm:text-4xl">
            Not sure which tier fits you?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-300">
            Book a discovery call and we'll match you to the right starting point.
          </p>
          <div className="mt-8">
            <DiscoveryCallButton className="h-14 rounded-full bg-[#C9A96A] px-8 text-black hover:bg-[#C9A96A]/90" variant="default">
              Book a Discovery Call
            </DiscoveryCallButton>
          </div>
        </div>
      </ScrollReveal>

      <Footer />
    </div>
  )
}
