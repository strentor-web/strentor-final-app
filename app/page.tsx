import type { Metadata } from "next";
import Link from "next/link";
import {
  Accessibility,
  Award,
  Brain,
  CheckCircle2,
  Compass,
  Dumbbell,
  Globe,
  HeartPulse,
  ShieldCheck,
  Users,
  XCircle,
  ArrowRight,
} from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import WhatsAppButton from "@/components/landing/WhatsAppButton";
import Testimonials from "@/components/landing/Testimonials";
import { Button } from "@/components/ui/button";
import { FloatingLogoScene } from "@/components/three/FloatingLogoSceneLazy";
import { ScrollReveal, StaggerGroup } from "@/components/motion/ScrollReveal";
import { ScrollStory } from "@/components/motion/ScrollStory";
import { HoverLift } from "@/components/motion/HoverLift";

export const metadata: Metadata = {
  title: "STRENTOR — Premium Performance Coaching for Wheelchair Users",
  description:
    "Premium strength, mindset and purpose coaching for ambitious wheelchair users in India, the UAE and Singapore. Personalized coaching that connects adaptive strength, nutrition, mindset and accountability to the goals that matter in your life. Founder-led by Aditya Mandan, a wheelchair user and para powerlifter.",
  alternates: {
    canonical: "/",
  },
};

// The four integrated dimensions of the STRENTOR coaching system.
const dimensions = [
  {
    icon: Dumbbell,
    title: "Physical",
    description:
      "Build adaptive strength, conditioning, movement capacity, and confidence in your body.",
  },
  {
    icon: Brain,
    title: "Mental",
    description:
      "Develop focus, self-belief, resilience, and the ability to respond constructively to setbacks.",
  },
  {
    icon: HeartPulse,
    title: "Emotional",
    description:
      "Understand and manage the emotional patterns that influence consistency, relationships, confidence, and self-image.",
  },
  {
    icon: Compass,
    title: "Purpose",
    description:
      "Create a stronger connection between daily actions and the life, work, contribution, sport, or mission you want to pursue.",
  },
];

// Signals used for self-qualification — not gatekeeping, but honesty about fit.
const rightFit = [
  "You want structured progress, not random workouts.",
  "You want coaching built around your actual body, equipment, schedule, goals, and health considerations.",
  "You want physical, mental, emotional, and purpose-related development to work together.",
  "You are willing to be coached, tracked, challenged, and held accountable.",
  "You understand that meaningful transformation requires consistent participation.",
];

const notRightFit = [
  "You only want a one-off exercise chart.",
  "You are looking for medical treatment or physiotherapy.",
  "You are unwilling to complete assessments or track progress.",
  "You want guaranteed outcomes without consistent effort.",
  "You are primarily selecting based on the lowest price.",
];

const method = [
  {
    step: "01",
    title: "Break",
    description:
      "Identify limiting patterns, weak systems, inconsistent routines, environmental barriers, and assumptions that no longer serve you.",
  },
  {
    step: "02",
    title: "Build",
    description:
      "Create personalized strength training, nutrition guidance, mindset practices, accountability systems, and measurable routines.",
  },
  {
    step: "03",
    title: "Become",
    description:
      "Translate progress into a stronger identity, greater confidence, improved performance, and meaningful real-world goals.",
  },
];

const builtAround = [
  "Current strength and movement capacity",
  "Type of wheelchair and available equipment",
  "Training environment",
  "Daily routine and work demands",
  "Personal ambitions",
  "Relevant medical guidance and precautions supplied by the client",
  "Nutrition context",
  "Psychological and emotional patterns",
  "Recovery capacity",
  "Access to support and facilities",
];

const outcomes = [
  "Greater upper-body strength and endurance",
  "More confidence using the body",
  "Better consistency and self-management",
  "Stronger personal identity",
  "Greater readiness for work, sport, travel, relationships, or independent living",
  "More structured nutrition and recovery habits",
  "Clearer goals and purpose",
  "Measurable progress through regular assessments",
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
            <h1 className="text-5xl font-bold font-display leading-tight text-white sm:text-6xl md:text-7xl">
              Built for <span className="text-[#C9A96A]">More.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-gray-300 md:text-xl">
              Premium strength, mindset and purpose coaching for ambitious
              wheelchair users.
            </p>
            <p className="mx-auto mt-4 max-w-lg text-base text-gray-400">
              Build a stronger body, a more resilient identity, and a life
              shaped by your ambitions — not other people&apos;s assumptions.
            </p>
          </div>,
          <div key="founder" className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-[#C9A96A]">
              Founder-Led
            </p>
            <h2 className="mt-4 text-3xl font-bold font-display leading-tight text-white sm:text-4xl md:text-5xl">
              Built by a wheelchair user.
              <br />
              For ambitious wheelchair users.
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-lg text-gray-300">
              Aditya Mandan is a wheelchair user and para powerlifter. Every
              program is built from lived experience — not generic fitness
              theory.
            </p>
          </div>,
          <div key="pillars" className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold font-display leading-tight text-white sm:text-4xl md:text-5xl">
              Strength. Mindset.
              <br />
              Identity. Purpose.
            </h2>
            <div className="mx-auto mt-10 grid max-w-xl grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { icon: Dumbbell, label: "Physical" },
                { icon: Brain, label: "Mental" },
                { icon: HeartPulse, label: "Emotional" },
                { icon: Compass, label: "Purpose" },
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
              Ready to find out what you&apos;re building toward?
            </h2>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                className="h-14 rounded-full bg-[#C9A96A] px-8 text-black transition-transform hover:scale-105 hover:bg-[#C9A96A]/90"
              >
                <Link href="/apply-for-access">Take the Performance Assessment</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-14 rounded-full px-8 transition-transform hover:scale-105"
              >
                <Link href="#method">Explore the STRENTOR Method</Link>
              </Button>
            </div>
            <p className="mx-auto mt-6 max-w-md text-sm text-gray-400">
              Personalized online coaching for committed clients in India, the
              UAE, Singapore and selected international markets.
            </p>
          </div>,
        ]}
      />

      {/* More Than Rehabilitation */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold font-display text-foreground sm:text-4xl">
              You are not here merely to manage limitations.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Rehabilitation may help a person recover or maintain function.
              STRENTOR is built for what comes next — for those who want to
              build further strength, confidence, performance, identity, and
              direction. STRENTOR does not replace medical care, physiotherapy,
              or rehabilitation; it starts from where those leave off.
            </p>
          </ScrollReveal>
          <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
            <ScrollReveal direction="up" className="rounded-2xl border border-border bg-card p-6">
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Rehabilitation asks
              </p>
              <p className="mt-2 text-lg font-semibold text-card-foreground">
                &ldquo;What function can we restore or maintain?&rdquo;
              </p>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.1} className="rounded-2xl border border-[#C9A96A]/30 bg-card p-6">
              <p className="text-sm font-bold uppercase tracking-widest text-[#C9A96A]">
                STRENTOR asks
              </p>
              <p className="mt-2 text-lg font-semibold text-card-foreground">
                &ldquo;What can you build from here?&rdquo;
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Who STRENTOR Is For — qualification, not gatekeeping */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold font-display text-foreground sm:text-4xl">
              For wheelchair users who refuse to make ambition smaller.
            </h2>
          </ScrollReveal>
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
            <ScrollReveal direction="up" className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-lg font-bold text-card-foreground">This is built for you if</h3>
              <ul className="mt-4 space-y-3">
                {rightFit.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm font-medium text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#C9A96A]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.1} className="rounded-2xl border border-border bg-card/50 p-6">
              <h3 className="text-lg font-bold text-card-foreground">This may not be right for you if</h3>
              <ul className="mt-4 space-y-3">
                {notRightFit.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm font-medium text-muted-foreground">
                    <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Four Dimensions of Transformation */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold font-display text-foreground sm:text-4xl">
              An integrated system, not a workout plan.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Four dimensions, coached together — because lasting change in
              one rarely holds without the others.
            </p>
          </ScrollReveal>
          <StaggerGroup className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dimensions.map((dimension) => (
              <ScrollReveal key={dimension.title} direction="up">
                <HoverLift className="flex h-full flex-col items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-[#C9A96A]/40">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A96A]">
                    <dimension.icon className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-card-foreground">
                      {dimension.title}
                    </h3>
                    <p className="mt-1 text-muted-foreground">
                      {dimension.description}
                    </p>
                  </div>
                </HoverLift>
              </ScrollReveal>
            ))}
          </StaggerGroup>
          <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-muted-foreground">
            Mental and emotional coaching support performance and consistency
            and are not a substitute for licensed mental-health treatment.
          </p>
        </div>
      </section>

      {/* The STRENTOR Method — Break. Build. Become. */}
      <section id="method" className="scroll-mt-20 bg-black py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-[#C9A96A]">
              The STRENTOR Method
            </p>
            <h2 className="mt-4 text-3xl font-bold font-display text-white sm:text-4xl">
              Break. Build. Become.
            </h2>
          </ScrollReveal>
          <div className="mx-auto mt-14 grid max-w-5xl gap-10 md:grid-cols-3">
            {method.map((stage) => (
              <ScrollReveal key={stage.step} direction="up" scale={0.94} blur duration={0.6}>
                <div className="text-center md:text-left">
                  <span className="font-display text-5xl font-bold text-[#C9A96A]/30">
                    {stage.step}
                  </span>
                  <h3 className="mt-2 text-2xl font-bold font-display text-white">
                    {stage.title}
                  </h3>
                  <p className="mt-3 text-gray-400">{stage.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Built Around the Individual */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2">
            <ScrollReveal direction="right">
              <h2 className="text-3xl font-bold font-display text-foreground sm:text-4xl">
                Built around you. Never retrofitted from a standing-body
                template.
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Every coaching plan considers the specifics of your body, your
                equipment, and your life — not a generic program adapted at
                the last step.
              </p>
            </ScrollReveal>
            <StaggerGroup as="ul" className="space-y-3">
              {builtAround.map((item) => (
                <ScrollReveal as="li" key={item} direction="up" distance={12} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#C9A96A]" />
                  <span className="text-base font-medium text-foreground">{item}</span>
                </ScrollReveal>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </section>

      {/* Credibility */}
      <section className="bg-muted/30 py-16">
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

      {/* Outcomes */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold font-display text-foreground sm:text-4xl">
              What clients build, with consistent participation.
            </h2>
          </ScrollReveal>
          <StaggerGroup className="mx-auto mt-10 grid max-w-4xl gap-x-8 gap-y-4 sm:grid-cols-2">
            {outcomes.map((outcome) => (
              <ScrollReveal key={outcome} direction="up" className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#C9A96A]" />
                <span className="text-base font-medium text-foreground">{outcome}</span>
              </ScrollReveal>
            ))}
          </StaggerGroup>
          <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-muted-foreground">
            Individual outcomes vary and depend on participation, starting
            condition, available equipment, medical considerations and other
            personal factors. STRENTOR does not guarantee weight loss,
            strength gains, medical improvement, independence, or the cure or
            reversal of any condition.
          </p>
        </div>
      </section>

      {/* Transformation Stories */}
      <div id="stories" className="scroll-mt-20">
        <ScrollReveal>
          <Testimonials />
        </ScrollReveal>
      </div>

      {/* Founder Credibility */}
      <section className="bg-black py-20">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <ScrollReveal>
            <p className="text-sm font-bold uppercase tracking-widest text-[#C9A96A]">
              Founder
            </p>
            <h2 className="mt-4 text-3xl font-bold font-display text-white sm:text-4xl">
              &ldquo;I was not looking for sympathy. I was looking for a
              system.&rdquo;
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-gray-300">
              Aditya Mandan is a wheelchair user, a certified fitness and
              nutrition expert, and a para powerlifter. STRENTOR exists
              because the system he needed didn&apos;t — so he built it.
            </p>
            <Link
              href="/about"
              className="group mt-6 inline-flex items-center gap-1 font-semibold text-[#C9A96A] transition-colors hover:text-[#C9A96A]/80"
            >
              Read the full story
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Programs */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold font-display text-foreground sm:text-4xl">
              Programs are recommended following your Performance Assessment.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              STRENTOR offers private transformation coaching, focused
              strength and performance coaching, and corporate partnership
              programs. The right fit depends on your goals, readiness, and
              current situation — which is exactly what the assessment is
              for.
            </p>
          </ScrollReveal>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              className="h-14 rounded-full bg-[#C9A96A] px-8 text-black transition-transform hover:scale-105 hover:bg-[#C9A96A]/90"
            >
              <Link href="/apply-for-access">Take the Performance Assessment</Link>
            </Button>
            <Button asChild variant="outline" className="h-14 rounded-full px-8 transition-transform hover:scale-105">
              <Link href="/programs">See All Programs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* International Relevance */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <Globe className="mx-auto h-8 w-8 text-[#C9A96A]" />
          <ScrollReveal className="mt-4">
            <h2 className="text-2xl font-bold font-display text-foreground sm:text-3xl">
              Coaching delivered virtually, wherever you are.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              STRENTOR coaches clients across India, the UAE, Singapore, and
              selected international markets — with pricing and scheduling
              adapted to your region.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-black py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
        <ScrollReveal className="container relative mx-auto px-4 text-center" scale={0.94} blur duration={0.7}>
          <h2 className="mx-auto max-w-2xl text-3xl font-bold font-display text-white sm:text-4xl">
            You have adapted long enough. Now decide what you want to build.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-300">
            If you are ready for structured, personalized coaching and
            meaningful accountability, begin with the STRENTOR Performance
            Assessment.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              className="h-14 rounded-full bg-[#C9A96A] px-8 text-black transition-transform hover:scale-105 hover:bg-[#C9A96A]/90"
            >
              <Link href="/apply-for-access">Take the Performance Assessment</Link>
            </Button>
            <Link
              href="/coaching"
              className="group inline-flex items-center gap-1 font-semibold text-gray-300 transition-colors hover:text-white"
            >
              See How Coaching Works
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
