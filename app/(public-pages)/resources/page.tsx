"use client";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ClipboardCheck,
  Activity,
  Rocket,
  Stethoscope,
  ShieldCheck,
  BookOpen,
  Target,
  LineChart,
  Apple,
  HandHeart,
} from "lucide-react";
import Link from "next/link";

interface Resource {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
}

const resources: Resource[] = [
  {
    icon: ClipboardCheck,
    title: "STRENTOR Readiness Checklist",
    description:
      "A short, practical checklist covering the basics you should have in place before starting adaptive strength coaching — from equipment access to a general sense of your current activity level.",
    ctaLabel: "Get the Checklist",
    href: "/contact?type=personal",
  },
  {
    icon: Activity,
    title: "Adaptive Strength Readiness Assessment",
    description:
      "A guided self-assessment that walks through training readiness, safety signals, and mobility context, so you and a coach can have a focused first conversation instead of starting from zero.",
    ctaLabel: "Start the Assessment",
    href: "/contact?type=personal",
  },
  {
    icon: Rocket,
    title: "7-Day Starter Kit",
    description:
      "A structured, low-commitment 7-day introduction to adaptive strength training — exercise plan, video demonstrations, and daily tracking, from ₹1,999. The easiest way to experience STRENTOR coaching directly.",
    ctaLabel: "View the Starter Kit",
    href: "/programs/starter-kit",
  },
  {
    icon: Stethoscope,
    title: "Fit Assessment",
    description:
      "A one-on-one conversation with our team to review your goals, physical context, and current constraints, and to recommend which STRENTOR program — if any — is the right starting point for you.",
    ctaLabel: "Request a Fit Assessment",
    href: "/contact?type=personal",
  },
  {
    icon: BookOpen,
    title: "Training Readiness Guide",
    description:
      "A practical guide to what \"ready to train\" actually means for wheelchair users and people managing chronic health conditions — covering baseline conditioning, prior activity, and realistic starting points.",
    ctaLabel: "Request the Guide",
    href: "/contact?type=personal",
  },
  {
    icon: ShieldCheck,
    title: "Safety Review Guide",
    description:
      "An overview of the safety considerations STRENTOR coaches build into every program — from movement selection to load progression — so you know what to expect before your first session.",
    ctaLabel: "Request the Guide",
    href: "/contact?type=personal",
  },
  {
    icon: Target,
    title: "Goal-Setting Workbook",
    description:
      "A structured worksheet for turning a general intention — \"get stronger,\" \"move more confidently\" — into specific, trackable training goals a coach can actually build a program around.",
    ctaLabel: "Request the Workbook",
    href: "/contact?type=personal",
  },
  {
    icon: LineChart,
    title: "Progress Tracker",
    description:
      "A simple template for logging training sessions, effort, and milestones over time, so progress is visible in weeks and months — not just felt in the moment.",
    ctaLabel: "Request the Tracker",
    href: "/contact?type=personal",
  },
  {
    icon: Apple,
    title: "Nutrition Context Checklist",
    description:
      "A short checklist covering the nutrition and hydration factors most relevant to adaptive strength training, framed as context for your coach rather than a prescriptive diet plan.",
    ctaLabel: "Request the Checklist",
    href: "/contact?type=personal",
  },
  {
    icon: HandHeart,
    title: "Pay It Forward",
    description:
      "Learn how STRENTOR's Pay It Forward program extends coaching access to individuals who could not otherwise afford it, and how you can contribute or apply.",
    ctaLabel: "Learn More",
    href: "/pay-it-forward",
  },
];

const readinessAreas = [
  {
    title: "Training Readiness",
    description: "Your current activity level and general preparedness to begin structured training.",
  },
  {
    title: "Safety Signals",
    description: "Any factors that would need to be accounted for before recommending specific movements or loads.",
  },
  {
    title: "Mobility Context",
    description: "How you move day to day, what equipment you use, and what that means for exercise selection.",
  },
  {
    title: "Health Realities",
    description: "A general understanding of relevant health conditions, at a level appropriate for a fitness coach — not a diagnosis.",
  },
  {
    title: "Goals",
    description: "What you're actually trying to achieve, whether that's strength, independence, confidence, or something else.",
  },
  {
    title: "Confidence",
    description: "Your current comfort level with training, so the starting point isn't overwhelming.",
  },
  {
    title: "Consistency",
    description: "The realistic time and structure you can commit to, so the program fits your life.",
  },
  {
    title: "Nutrition Context",
    description: "General eating patterns and constraints that a coach should know about, not a medical dietary review.",
  },
  {
    title: "Recovery Capacity",
    description: "How your body typically responds to physical effort and what recovery looks like for you.",
  },
  {
    title: "Coaching Suitability",
    description: "An honest read on whether STRENTOR is the right fit right now, or whether another resource makes more sense first.",
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <div className="relative bg-black py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
        <div className="container relative mx-auto px-4 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-[#C9A96A]">
            Resource Hub
          </span>
          <h1 className="mt-4 text-4xl font-bold font-display text-white sm:text-5xl md:text-6xl">
            Tools for anyone considering{" "}
            <span className="text-[#C9A96A]">STRENTOR coaching</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
            Checklists, assessments, and guides to help you understand what adaptive strength
            coaching involves, whether you&apos;re ready to start, and what the right next step
            looks like for you.
          </p>
        </div>
      </div>

      {/* Resources grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <div
              key={resource.title}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A96A]">
                <resource.icon className="h-5 w-5 text-strentor-black" />
              </div>
              <h3 className="text-lg font-bold text-card-foreground">{resource.title}</h3>
              <p className="flex-1 text-sm text-muted-foreground">{resource.description}</p>
              <Link
                href={resource.href}
                className="group mt-2 inline-flex items-center gap-1 text-sm font-bold text-[#C9A96A] hover:underline"
              >
                {resource.ctaLabel}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* What the readiness process checks */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-center text-3xl font-bold font-display text-foreground sm:text-4xl">
            What Our Readiness Process Actually Checks
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-muted-foreground">
            The Fit Assessment and Readiness Assessment aren&apos;t medical evaluations — they&apos;re
            a structured way for a coach to understand your context before recommending a program.
            Here&apos;s what goes into that picture.
          </p>
          <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2">
            {readinessAreas.map((area) => (
              <div
                key={area.title}
                className="rounded-xl border border-border bg-card p-5 shadow-sm"
              >
                <h3 className="font-bold text-card-foreground">{area.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{area.description}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-muted-foreground">
            STRENTOR provides fitness and nutrition coaching, not medical treatment or diagnosis.
            Please consult your physician before beginning any new exercise program, especially if
            you have an existing health condition.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative bg-black py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
        <div className="container relative mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-display text-white sm:text-4xl">
            Not sure where to <span className="text-[#C9A96A]">start?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-300">
            Reach out and we&apos;ll help you figure out which resource, assessment, or program
            makes sense for where you are right now.
          </p>
          <div className="mt-8">
            <Button size="lg" className="rounded-full bg-[#C9A96A] hover:bg-[#C9A96A]/90" asChild>
              <Link href="/contact">
                Get in Touch
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
