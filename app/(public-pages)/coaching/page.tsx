"use client"

import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  ShieldAlert,
  ArrowRight,
  Check,
  Dumbbell,
  HeartPulse,
  Brain,
  Apple,
  LineChart,
  Video,
  Target,
  Users,
} from "lucide-react"
import Link from "next/link"

const includes = [
  {
    icon: Dumbbell,
    title: "Strength Built For Your Body",
    description:
      "Upper-body strength, seated strength, and functional strength programmed around the equipment and movement patterns you actually have — not a standing-body plan with exercises swapped out.",
  },
  {
    icon: HeartPulse,
    title: "Fatigue-Aware Conditioning",
    description:
      "Endurance and conditioning work that builds capacity gradually, with progression paced to your energy levels and recovery — not a fixed schedule that ignores how you're doing week to week.",
  },
  {
    icon: ShieldAlert,
    title: "Pain-Aware Programming & Recovery",
    description:
      "Sessions are adjusted around pain signals, joint stress, and recovery needs. Rest and recovery planning are treated as part of the program, not an afterthought.",
  },
  {
    icon: Brain,
    title: "Confidence, Discipline & Routine",
    description:
      "Structured coaching builds a training habit you can rely on — consistency, mental steadiness, and the discipline to keep showing up, on the days that are easy and the days that aren't.",
  },
  {
    icon: Apple,
    title: "Nutrition Context",
    description:
      "General nutrition guidance that supports your training goals and energy needs. This is fitness-coaching-level nutrition context, not clinical dietetics — it works alongside any advice from your dietitian or doctor.",
  },
  {
    icon: Video,
    title: "Form Review & Coached Correction",
    description:
      "Video-based form review on your lifts and movements, with direct, specific correction — so technique stays safe and effective as load and difficulty increase.",
  },
  {
    icon: LineChart,
    title: "Progress Tracking & Accountability",
    description:
      "Your strength, energy, and consistency are tracked over time. Weekly check-ins keep the plan honest and keep you accountable to the goal you set, not just the workout in front of you.",
  },
  {
    icon: Target,
    title: "Goal-Led Transformation",
    description:
      "Every plan is built toward a specific outcome you define — strength, independence, confidence, or performance — with progression staged around that goal rather than a generic template.",
  },
]

const focusAreas = [
  "Upper-body pushing and pulling strength",
  "Seated core and trunk stability",
  "Functional strength for transfers, daily tasks, and independence",
  "Cardiovascular endurance appropriate to your ability",
  "Joint-friendly mobility and movement quality",
  "Sport-specific strength work, including para powerlifting foundations, for those who want it",
]

const suitableFor = [
  {
    title: "Wheelchair users",
    description:
      "Building upper-body and seated strength, functional capacity, and confidence in your own training — programmed for your chair and your movement, from the first session.",
  },
  {
    title: "People with limited walking ability",
    description:
      "Strength and conditioning that works with your mobility as it is today, focused on capability and progress rather than comparison to a standing-body standard.",
  },
  {
    title: "People managing chronic health conditions",
    description:
      "Including CKD, diabetes, cardiac considerations, neurological conditions, and bone or joint conditions. Programming accounts for your health context — this is not a one-size-fits-all plan.",
  },
  {
    title: "People returning after illness, surgery, or a long gap",
    description:
      "A structured, paced return to training after time away — rebuilding strength and routine without rushing back to a level your body isn't ready for yet.",
  },
]

const principles = [
  "Programming starts with your health context and current ability, not a generic template.",
  "Progression is paced to what your body can sustain week over week — not a fixed calendar.",
  "Communication is two-way and ongoing: you report how you're feeling, and the plan adjusts.",
  "Intensity is earned through consistency and readiness, not pushed to hit an arbitrary number.",
]

const process = [
  {
    step: "01",
    title: "Fit Assessment",
    description:
      "A structured conversation about your body, equipment, health context, training history, and goals. This is where suitability and starting point are established — honestly, before anything else.",
  },
  {
    step: "02",
    title: "Plan Design",
    description:
      "A coaching plan is built around what came out of your assessment — strength focus, conditioning, pain and fatigue considerations, and a realistic timeline.",
  },
  {
    step: "03",
    title: "Coached Sessions",
    description:
      "You train on the plan, with video-guided sessions and direct form feedback so technique stays safe as difficulty increases.",
  },
  {
    step: "04",
    title: "Weekly Check-Ins",
    description:
      "Every week, progress, energy, pain, and consistency are reviewed together, and the plan is adjusted accordingly.",
  },
  {
    step: "05",
    title: "Progression",
    description:
      "As strength, capacity, and confidence build, the plan progresses in structured stages — always safety-checked before intensity increases.",
  },
]

const faqs = [
  {
    question: "Is this medical treatment or physiotherapy?",
    answer:
      "No. STRENTOR is fitness coaching. It is not medical treatment, not physiotherapy, and not a substitute for care from a doctor, physiotherapist, or dietitian. Coaching works alongside your existing medical care, not in place of it.",
  },
  {
    question: "What if I have a specific health condition, like CKD, diabetes, or a cardiac or neurological condition?",
    answer:
      "Your health context is central to how your plan is built. Conditions like these are discussed in detail during your Fit Assessment so programming can be designed around them responsibly. Where a condition requires medical clearance or ongoing monitoring, that stays with your treating doctor — coaching is programmed to work alongside it.",
  },
  {
    question: "Do I need doctor clearance before starting?",
    answer:
      "If you have an existing diagnosis, ongoing treatment, or any condition your doctor is actively managing, we recommend confirming with them that structured strength training is appropriate before you start. We'll ask about this directly during your Fit Assessment.",
  },
  {
    question: "What equipment do I need?",
    answer:
      "This depends on your plan and goals. Many clients start with minimal equipment — resistance bands, light dumbbells, or bodyweight work adapted to a seated or limited-mobility position. Equipment needs are confirmed and kept realistic during plan design, not assumed upfront.",
  },
  {
    question: "How is progress measured if I'm not chasing a standard fitness benchmark?",
    answer:
      "Progress is tracked against your own baseline — strength gained, consistency built, capacity increased, and confidence in your training. Weekly check-ins keep this measured and honest, rather than comparing you to a generic standard that was never designed for your body.",
  },
]

export default function CoachingPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Header />

      {/* Hero */}
      <div className="relative bg-black py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
        <div className="container relative mx-auto px-4 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-[#C9A96A]">
            Adaptive Strength Coaching
          </span>
          <h1 className="mt-4 text-4xl font-bold font-display text-white sm:text-5xl md:text-6xl">
            Strength Coaching For <span className="text-[#C9A96A]">Real Bodies</span>, Real Limits, Real Goals
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
            One-on-one adaptive coaching for wheelchair users and people managing chronic health
            conditions — programmed around your body and your health context, so confidence and
            discipline build alongside strength, without compromising safety.
          </p>
          <div className="mt-8">
            <Button
              asChild
              className="h-14 rounded-full bg-[#C9A96A] px-8 hover:bg-[#C9A96A]/90"
            >
              <Link href="/contact?type=personal">Book Fit Assessment</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* What adaptive coaching includes */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold font-display text-foreground sm:text-4xl">
            What Adaptive Coaching Includes
          </h2>
          <p className="mt-4 text-lg font-medium text-muted-foreground">
            Every element of the program is built around one idea: strength training that
            respects your body as it is today, and progresses it deliberately from there.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2">
          {includes.map((item) => (
            <div
              key={item.title}
              className="flex gap-4 rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A96A]">
                <item.icon className="h-5 w-5 text-strentor-black" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-card-foreground">{item.title}</h3>
                <p className="mt-1 text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Training focus areas */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold font-display text-foreground sm:text-4xl">
              Training Focus Areas
            </h2>
            <p className="mt-4 text-lg font-medium text-muted-foreground">
              Where your program draws its foundation, before it's shaped around your specific goal.
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
            {focusAreas.map((area) => (
              <div key={area} className="flex items-start gap-3 rounded-lg bg-card p-4 shadow-sm">
                <Check className="mt-1 h-5 w-5 flex-shrink-0 text-[#C9A96A]" />
                <span className="font-medium text-card-foreground">{area}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who coaching is suitable for */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold font-display text-foreground sm:text-4xl">
            Who Coaching Is Suitable For
          </h2>
          <p className="mt-4 text-lg font-medium text-muted-foreground">
            STRENTOR coaching is built for people navigating real physical circumstances — not as
            a modification of standard fitness, but as its own starting point.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2">
          {suitableFor.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-card-foreground">{item.title}</h3>
              <p className="mt-2 text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Health-respecting principles */}
      <section className="bg-black py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold font-display sm:text-4xl">
              Health-Respecting <span className="text-[#C9A96A]">Coaching Principles</span>
            </h2>
          </div>
          <div className="mx-auto mt-10 max-w-3xl space-y-4">
            {principles.map((principle) => (
              <div key={principle} className="flex items-start gap-3 rounded-lg bg-white/5 p-4">
                <Check className="mt-1 h-5 w-5 flex-shrink-0 text-[#C9A96A]" />
                <span className="font-medium text-gray-200">{principle}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety before intensity */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <ShieldAlert className="h-10 w-10 text-[#C9A96A]" />
          <h2 className="text-3xl font-bold font-display text-foreground sm:text-4xl">
            Safety Before Intensity
          </h2>
          <p className="text-lg font-medium text-muted-foreground">
            Every decision in your program follows the same order: safety and health context
            first, intensity second. If a session needs to be scaled back because of pain,
            fatigue, or how your body is responding that week, it gets scaled back — no exceptions,
            no pushing through. Progress that costs your health isn't progress.
          </p>
        </div>
      </section>

      {/* Coaching process */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold font-display text-foreground sm:text-4xl">
              How Coaching Works
            </h2>
          </div>
          <div className="mx-auto mt-12 max-w-3xl space-y-6">
            {process.map((item) => (
              <div key={item.step} className="flex gap-5 rounded-xl border border-border bg-card p-6 shadow-sm">
                <span className="text-2xl font-bold text-[#C9A96A]">{item.step}</span>
                <div>
                  <h3 className="text-lg font-bold text-card-foreground">{item.title}</h3>
                  <p className="mt-1 text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expected outcomes */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <Users className="mx-auto h-10 w-10 text-[#C9A96A]" />
          <h2 className="mt-4 text-3xl font-bold font-display text-foreground sm:text-4xl">
            Expected Outcomes
          </h2>
          <div className="mt-6 space-y-4 text-left text-lg font-medium text-muted-foreground">
            <p>
              Clients coached consistently through this program typically build measurable
              upper-body and functional strength, greater training endurance, steadier routine
              and discipline, and more confidence in their own physical capability.
            </p>
            <p>
              Results vary by starting point, health context, and consistency — there are no
              guaranteed outcomes, and no program can promise a specific result. What coaching
              guarantees is a structured, honest, and safety-first process behind every session.
            </p>
          </div>
        </div>
      </section>

      {/* What STRENTOR does not provide */}
      <section className="container mx-auto px-4 pb-16">
        <div className="mx-auto flex max-w-3xl gap-4 rounded-xl border border-[#C9A96A]/30 bg-[#C9A96A]/5 p-6">
          <ShieldAlert className="h-6 w-6 flex-shrink-0 text-[#C9A96A]" />
          <div className="text-sm text-muted-foreground">
            <p className="font-bold text-foreground">What STRENTOR does not provide:</p>
            <p className="mt-2">
              STRENTOR is fitness coaching — it is not medical treatment, not physiotherapy, not a
              cure or rehabilitation service, and not a replacement for a doctor, physiotherapist,
              or dietitian. It does not diagnose or treat any medical condition, and it does not
              guarantee specific health or fitness outcomes. Coaching is designed to work alongside
              your existing medical care, not instead of it. If you have an existing diagnosis or
              condition under active treatment, please consult your doctor before beginning any new
              training program.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="mb-8 text-3xl font-bold font-display text-[#C9A96A] sm:text-4xl">
          Frequently Asked Questions
        </h2>
        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg text-foreground hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-left text-base font-normal text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-black py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-display text-white sm:text-4xl">
            Start With A <span className="text-[#C9A96A]">Fit Assessment</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-300">
            A structured conversation about your body, your goals, and your health context — the
            first step toward a plan built specifically for you.
          </p>
          <div className="mt-8">
            <Button
              asChild
              className="h-14 rounded-full bg-[#C9A96A] px-8 hover:bg-[#C9A96A]/90"
            >
              <Link href="/contact?type=personal">
                Book Fit Assessment
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
