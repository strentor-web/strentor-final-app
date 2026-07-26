import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import {
  Accessibility,
  Award,
  Dumbbell,
  HeartPulse,
  ShieldCheck,
  Users,
  ArrowRight,
} from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import WhatsAppButton from "@/components/landing/WhatsAppButton";
import Pricing from "@/components/landing/Pricing";
import { Button } from "@/components/ui/button";
import { FloatingLogoScene } from "@/components/three/FloatingLogoSceneLazy";
import { ScrollReveal, StaggerGroup } from "@/components/motion/ScrollReveal";
import { ScrollStory } from "@/components/motion/ScrollStory";
import { HoverLift } from "@/components/motion/HoverLift";

export const metadata: Metadata = {
  title: "STRENTOR — Holistic Strength Coaching for Wheelchair Users",
  description:
    "STRENTOR helps wheelchair users build seated strength, confidence, discipline, resilience, and daily fitness habits through adaptive fitness, nutrition guidance, mindset mentorship, and weekly accountability. Founder-led by Aditya Mandan, a wheelchair user and para powerlifter.",
  alternates: {
    canonical: "/",
  },
};

const features = [
  {
    icon: Accessibility,
    title: "Wheelchair-First Approach",
    description: "Built for wheelchair users, by a wheelchair user.",
  },
  {
    icon: Dumbbell,
    title: "12-Week Holistic Strength Program",
    description:
      "Adaptive fitness, nutrition, mindset and accountability, built with purpose.",
  },
  {
    icon: Users,
    title: "Sponsored Access Seats",
    description:
      "Making high-quality coaching accessible through sponsors and partners.",
  },
  {
    icon: Award,
    title: "Founder-Led, Mission-Driven",
    description: "Built from lived experience, not generic fitness theory.",
  },
  {
    icon: ShieldCheck,
    title: "Safety-Aware Coaching",
    description:
      "Health realities aware programming with care, clarity and accountability.",
  },
];

const credibilityBadges = [
  { icon: Accessibility, label: "Wheelchair-First Lived Experience" },
  { icon: HeartPulse, label: "Spina Bifida & CKD-Aware" },
  { icon: Dumbbell, label: "Para Powerlifting Discipline" },
  { icon: Award, label: "Certified Fitness & Nutrition Expert" },
  { icon: Users, label: "Founder-Led Access Cohort" },
  { icon: ShieldCheck, label: "Case Studies in Progress" },
];

export default function Home() {
  return (
    <div>
      <Header />

      {/* Hero — a pinned, scroll-scrubbed story (Apple.com-style): the
          section stays fixed on screen while four beats crossfade as you
          scroll through it. Falls back to a plain stacked layout under
          prefers-reduced-motion — see ScrollStory. */}
      <ScrollStory
        className="relative bg-black"
        background={
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
            <FloatingLogoScene className="pointer-events-none absolute inset-0 opacity-70" />
          </>
        }
        beats={[
          <div key="headline" className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold font-display leading-tight text-white sm:text-5xl md:text-6xl">
              HOLISTIC STRENGTH FOR{" "}
              <span className="text-[#C9A96A]">WHEELCHAIR USERS</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-gray-300 md:text-xl">
              STRENTOR helps wheelchair users build seated strength,
              confidence, discipline, resilience, and daily fitness habits
              through adaptive fitness, nutrition guidance, mindset
              mentorship, and weekly accountability.
            </p>
          </div>,
          <div key="founder" className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-[#C9A96A]">
              Founder-Led
            </p>
            <h2 className="mt-4 text-3xl font-bold font-display leading-tight text-white sm:text-4xl md:text-5xl">
              Built by a wheelchair user.
              <br />
              For wheelchair users.
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-lg text-gray-300">
              Aditya Mandan is a wheelchair user and para powerlifter. Every
              program is built from lived experience — not generic fitness
              theory.
            </p>
          </div>,
          <div key="pillars" className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold font-display leading-tight text-white sm:text-4xl md:text-5xl">
              Adaptive Fitness. Nutrition.
              <br />
              Mindset. Accountability.
            </h2>
            <div className="mx-auto mt-10 grid max-w-xl grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { icon: Dumbbell, label: "Fitness" },
                { icon: HeartPulse, label: "Nutrition" },
                { icon: Award, label: "Mindset" },
                { icon: Users, label: "Accountability" },
              ].map((pillar) => (
                <div key={pillar.label} className="flex flex-col items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A96A]/10">
                    <pillar.icon className="h-6 w-6 text-[#C9A96A]" />
                  </div>
                  <span className="text-sm font-semibold text-gray-300">{pillar.label}</span>
                </div>
              ))}
            </div>
          </div>,
          <div key="cta" className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold font-display leading-tight text-white sm:text-4xl md:text-5xl">
              Ready to build real strength?
            </h2>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                className="h-14 rounded-full bg-[#C9A96A] px-8 text-black transition-transform hover:scale-105 hover:bg-[#C9A96A]/90"
              >
                <Link href="/apply-for-access">Apply for Access</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-14 rounded-full px-8 transition-transform hover:scale-105"
              >
                <Link href="/sponsor-a-seat">Sponsor a Seat</Link>
              </Button>
            </div>
            <div className="mt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-6">
              <Link
                href="/programs"
                className="group inline-flex items-center gap-1 font-semibold text-[#C9A96A] transition-colors hover:text-[#C9A96A]/80"
              >
                Explore the Program
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/start-here"
                className="group inline-flex items-center gap-1 font-semibold text-gray-300 transition-colors hover:text-white"
              >
                Not sure where to start?
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>,
        ]}
      />

      {/* Feature cards */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <StaggerGroup className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <ScrollReveal key={feature.title} direction="up">
                <HoverLift className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-[#C9A96A]/40">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A96A]">
                    <feature.icon className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-card-foreground">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </HoverLift>
              </ScrollReveal>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Credibility */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal scale={0.94} blur duration={0.7}>
            <h2 className="text-2xl font-bold font-display uppercase tracking-wide text-[#C9A96A] sm:text-3xl">
              Built From Lived Experience, Not Theory.
            </h2>
          </ScrollReveal>
          <StaggerGroup className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {credibilityBadges.map((badge) => (
              <ScrollReveal key={badge.label} direction="up">
                <HoverLift className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-4 py-6 text-center transition-colors hover:border-[#C9A96A]/40">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C9A96A]/10">
                    <badge.icon className="h-5 w-5 text-[#C9A96A]" />
                  </div>
                  <span className="text-sm font-semibold text-card-foreground">
                    {badge.label}
                  </span>
                </HoverLift>
              </ScrollReveal>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Fitness Plan Pricing */}
      <ScrollReveal>
        <Suspense>
          <Pricing />
        </Suspense>
      </ScrollReveal>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-black py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
        <ScrollReveal className="container relative mx-auto px-4 text-center" scale={0.94} blur duration={0.7}>
          <h2 className="text-3xl font-bold font-display text-white sm:text-4xl">
            Ready to begin your strength journey?
          </h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              className="h-14 rounded-full bg-[#C9A96A] px-8 text-black transition-transform hover:scale-105 hover:bg-[#C9A96A]/90"
            >
              <Link href="/apply-for-access">Apply for Access</Link>
            </Button>
            <Button asChild variant="outline" className="h-14 rounded-full px-8 transition-transform hover:scale-105">
              <Link href="/sponsor-a-seat">Sponsor a Seat</Link>
            </Button>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
