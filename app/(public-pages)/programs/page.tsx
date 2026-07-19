"use client"

import Image from "next/image"
import Link from "next/link"
import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dumbbell,
  Apple,
  Brain,
  Users,
  ShieldCheck,
  Compass,
  ArrowRight,
  HandHeart,
} from "lucide-react"
import dynamic from "next/dynamic"
import { accessTiers, PROGRAM_TRUE_VALUE } from "@/config/accessTiers"
import { ScrollReveal, StaggerGroup } from "@/components/motion/ScrollReveal"
import { HoverLift } from "@/components/motion/HoverLift"

// @react-three/fiber has import-time side effects that crash Next.js's
// server-side prerender pass, so it must only ever load in the browser.
const ProgramWheel3D = dynamic(
  () => import("@/components/three/ProgramWheel3D").then((mod) => mod.ProgramWheel3D),
  { ssr: false }
)

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
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <div className="relative bg-black py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
        <div className="container relative mx-auto px-4 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-[#C9A96A]">
            The STRENTOR Program
          </span>
          <h1 className="mt-4 text-4xl font-bold font-display text-white sm:text-5xl md:text-6xl">
            The 12-Week <span className="text-[#C9A96A]">STRENTOR</span> Holistic Strength Program
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
            A complete system to build seated strength, confidence, discipline, resilience and
            daily fitness habits.
          </p>
          <div className="mt-8">
            <Button asChild className="h-14 rounded-full bg-[#C9A96A] px-8 hover:bg-[#C9A96A]/90">
              <Link href="/apply-for-access">
                Apply for Access
              </Link>
            </Button>
          </div>
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
            <div
              className="h-full w-full rounded-full shadow-2xl ring-1 ring-[#C9A96A]/30"
              style={{ background: wheelGradient }}
            />
            <ProgramWheel3D
              segments={pillars.map((p) => ({ color: p.color }))}
              className="absolute inset-0"
            />
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

      {/* Access-Based Pricing */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold font-display text-foreground sm:text-4xl">
            Access-Based Pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            The 12-week program has a true value of {PROGRAM_TRUE_VALUE} per participant. Through
            sponsors, donors and partners, eligible participants may receive fully sponsored or
            subsidized access.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-foreground">Access Tier</TableHead>
                <TableHead className="text-foreground">Contribution (INR)</TableHead>
                <TableHead className="text-foreground">Who It's For</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accessTiers.map((tier) => (
                <TableRow key={tier.id}>
                  <TableCell className="font-semibold text-card-foreground">{tier.name}</TableCell>
                  <TableCell className="text-[#C9A96A]">{tier.price}</TableCell>
                  <TableCell className="text-muted-foreground">{tier.whoItsFor}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollReveal>
      </section>

      {/* Final CTA */}
      <section className="relative bg-black py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
        <ScrollReveal className="container relative mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-display text-white sm:text-4xl">
            Not sure which access tier fits you?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-300">
            Apply and our team will match you to the right seat, or sponsor a seat for someone
            who needs it.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild className="h-14 rounded-full bg-[#C9A96A] px-8 hover:bg-[#C9A96A]/90">
              <Link href="/apply-for-access">
                Apply for Access
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-14 rounded-full border-[#C9A96A] px-8 text-[#C9A96A] hover:bg-[#C9A96A]/10"
            >
              <Link href="/sponsor-a-seat">
                <HandHeart className="mr-1 h-4 w-4" />
                Sponsor a Seat
              </Link>
            </Button>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  )
}
