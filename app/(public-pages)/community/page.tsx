"use client"

import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import { TestimonialSubmitForm } from "@/components/forms/TestimonialSubmitForm"
import Link from "next/link"
import {
  Users,
  MessageCircle,
  Target,
  TrendingUp,
  MessagesSquare,
  Send,
  Video,
  BookOpen,
} from "lucide-react"
import { ScrollReveal, StaggerGroup } from "@/components/motion/ScrollReveal"
import { HoverLift } from "@/components/motion/HoverLift"

const pillars = [
  {
    icon: Users,
    title: "Shared Strength",
    description: "Train with others who understand your journey.",
  },
  {
    icon: MessageCircle,
    title: "Real Conversations",
    description: "Support and motivation, not just theory.",
  },
  {
    icon: Target,
    title: "Accountability",
    description: "Stay motivated with weekly check-ins.",
  },
  {
    icon: TrendingUp,
    title: "Grow Together",
    description: "Stronger together. Every week.",
  },
]

const spaces = [
  {
    icon: MessagesSquare,
    title: "WhatsApp Group",
    description: "Daily motivation, updates, and support.",
    cta: "Join Now",
    href: "https://chat.whatsapp.com/GJRdI9y1NRkFei0IosUAlL",
    external: true,
  },
  {
    icon: Send,
    title: "Telegram Channel",
    description: "Announcements, resources, and tips.",
    cta: "Join Now",
    href: "#",
    external: true,
  },
  {
    icon: Video,
    title: "Live Sessions",
    description: "Q&A, check-ins, and workshops.",
    cta: "Join Now",
    href: "#",
    external: true,
  },
  {
    icon: BookOpen,
    title: "Resource Library",
    description: "Exercises, guides, nutrition, and more.",
    cta: "Explore Now",
    href: "#",
    external: false,
  },
]

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <div className="relative bg-black py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
        <div className="container relative mx-auto px-4 text-center">
          <ScrollReveal direction="none" duration={0.4}>
            <h1 className="text-4xl font-bold font-display text-white sm:text-5xl md:text-6xl">
              The <span className="text-[#C9A96A]">STRENTOR</span> Community
            </h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.15}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
              You are not training alone. You are building a stronger life with a community
              that understands, supports, and grows together.
            </p>
          </ScrollReveal>
        </div>
      </div>

      {/* Pillars */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <StaggerGroup className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar, index) => (
              <ScrollReveal key={index}>
                <HoverLift className="h-full">
                  <div className="flex h-full flex-col items-center gap-4 rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A96A]">
                      <pillar.icon className="h-6 w-6 text-strentor-black" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-card-foreground">{pillar.title}</h3>
                      <p className="mt-1 text-muted-foreground">{pillar.description}</p>
                    </div>
                  </div>
                </HoverLift>
              </ScrollReveal>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Community Spaces */}
      <section className="container mx-auto px-4 py-16">
        <ScrollReveal className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold font-display text-foreground sm:text-4xl">
            Community <span className="text-[#C9A96A]">Spaces</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Find your place in the STRENTOR community, wherever you connect best.
          </p>
        </ScrollReveal>
        <StaggerGroup className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
          {spaces.map((space, index) => (
            <ScrollReveal key={index}>
              <HoverLift className="h-full">
                <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A96A]/10">
                    <space.icon className="h-6 w-6 text-[#C9A96A]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-card-foreground">{space.title}</h3>
                    <p className="mt-1 text-muted-foreground">{space.description}</p>
                  </div>
                  {space.external ? (
                    <Button
                      asChild
                      className="w-fit rounded-full bg-[#C9A96A] px-6 transition-transform hover:scale-105 hover:bg-[#C9A96A]/90"
                    >
                      <a href={space.href} target="_blank" rel="noopener noreferrer">
                        {space.cta}
                      </a>
                    </Button>
                  ) : (
                    <Button
                      asChild
                      className="w-fit rounded-full bg-[#C9A96A] px-6 transition-transform hover:scale-105 hover:bg-[#C9A96A]/90"
                    >
                      <Link href={space.href}>{space.cta}</Link>
                    </Button>
                  )}
                </div>
              </HoverLift>
            </ScrollReveal>
          ))}
        </StaggerGroup>
      </section>

      {/* Share Your Story */}
      <section className="container mx-auto px-4 py-16">
        <ScrollReveal className="mx-auto max-w-xl">
          <TestimonialSubmitForm />
        </ScrollReveal>
      </section>

      {/* Final CTA */}
      <section className="relative bg-black py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
        <ScrollReveal className="container relative mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-display text-white sm:text-4xl">
            Join the movement. Build strength. Build life.
          </h2>
          <div className="mt-8">
            <Button
              asChild
              className="h-14 rounded-full bg-[#C9A96A] px-8 transition-transform hover:scale-105 hover:bg-[#C9A96A]/90"
            >
              <Link href="/apply-for-access">Apply for Access</Link>
            </Button>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  )
}
