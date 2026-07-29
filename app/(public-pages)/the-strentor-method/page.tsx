import Link from "next/link"
import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Compass,
  Dumbbell,
  HeartPulse,
} from "lucide-react"
import { ScrollReveal, StaggerGroup } from "@/components/motion/ScrollReveal"
import { HoverLift } from "@/components/motion/HoverLift"

const dimensions = [
  {
    icon: Dumbbell,
    title: "Physical",
    description: "Build adaptive strength, conditioning, movement capacity, and confidence in your body.",
  },
  {
    icon: Brain,
    title: "Mental",
    description: "Develop focus, self-belief, resilience, and the ability to respond constructively to setbacks.",
  },
  {
    icon: HeartPulse,
    title: "Emotional",
    description: "Understand and manage the emotional patterns that influence consistency, relationships, confidence, and self-image.",
  },
  {
    icon: Compass,
    title: "Purpose",
    description: "Create a stronger connection between daily actions and the life, work, contribution, sport, or mission you want to pursue.",
  },
]

const stages = [
  {
    step: "01",
    title: "Break",
    summary: "Identify what's actually in your way — before building anything new.",
    points: [
      "Identify inconsistent routines and honestly name why they haven't stuck",
      "Separate real physical limits from inherited assumptions about what's possible",
      "Name the environmental and equipment barriers actually in your way",
      "Get a current, honest read on your strength, mobility, and health context",
    ],
  },
  {
    step: "02",
    title: "Build",
    summary: "A personalized system across training, nutrition, mindset, and accountability.",
    points: [
      "A strength and conditioning plan built around your body and equipment",
      "Nutrition guidance that supports training, energy, and recovery",
      "Mindset practices for consistency, focus, and resilience under setbacks",
      "Accountability systems and measurable routines you can actually sustain",
    ],
  },
  {
    step: "03",
    title: "Become",
    summary: "Progress that shows up as identity, confidence, and direction — not just numbers.",
    points: [
      "A stronger, more capable body, measured against your own baseline",
      "Confidence that carries into work, relationships, travel, and sport",
      "A clearer sense of purpose connecting training to what you're building toward",
      "Progress you can point to, tracked through regular assessment",
    ],
  },
]

export default function TheStrentorMethodPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <div className="relative bg-black py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
        <div className="container relative mx-auto px-4 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-[#C9A96A]">
            The STRENTOR Method
          </span>
          <h1 className="mt-4 text-4xl font-bold font-display text-white sm:text-5xl md:text-6xl">
            Break. Build. <span className="text-[#C9A96A]">Become.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
            A three-stage coaching framework that connects adaptive strength,
            mindset, and purpose — so progress in one area holds because the
            others are moving with it.
          </p>
        </div>
      </div>

      {/* Four dimensions recap */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold font-display text-foreground sm:text-4xl">
            An integrated system, not a workout plan
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every stage of the method works across four dimensions together.
          </p>
        </ScrollReveal>
        <StaggerGroup className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {dimensions.map((dimension) => (
            <ScrollReveal key={dimension.title} direction="up">
              <HoverLift className="flex h-full flex-col items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A96A]">
                  <dimension.icon className="h-5 w-5 text-strentor-black" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-card-foreground">{dimension.title}</h3>
                  <p className="mt-1 text-muted-foreground">{dimension.description}</p>
                </div>
              </HoverLift>
            </ScrollReveal>
          ))}
        </StaggerGroup>
      </section>

      {/* The three stages, in depth */}
      <section className="bg-black py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl space-y-16">
            {stages.map((stage) => (
              <ScrollReveal key={stage.step} scale={0.96} blur duration={0.6}>
                <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-start">
                  <span className="font-display text-6xl font-bold text-[#C9A96A]/30">
                    {stage.step}
                  </span>
                  <div>
                    <h2 className="text-3xl font-bold font-display text-white sm:text-4xl">
                      {stage.title}
                    </h2>
                    <p className="mt-2 text-lg text-gray-300">{stage.summary}</p>
                    <ul className="mt-6 space-y-3">
                      {stage.points.map((point) => (
                        <li key={point} className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#C9A96A]" />
                          <span className="text-gray-300">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-link to the operational detail already on /coaching */}
      <section className="container mx-auto px-4 py-16 text-center">
        <ScrollReveal className="mx-auto max-w-xl">
          <h2 className="text-2xl font-bold font-display text-foreground sm:text-3xl">
            Want the training mechanics in detail?
          </h2>
          <p className="mt-3 text-muted-foreground">
            See exactly how the physical-training side of coaching works —
            assessment, plan design, sessions, weekly check-ins, and safety
            principles.
          </p>
          <Link
            href="/coaching"
            className="group mt-4 inline-flex items-center gap-1 font-semibold text-[#C9A96A] transition-colors hover:text-[#C9A96A]/80"
          >
            See how coaching works
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </ScrollReveal>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-black py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
        <ScrollReveal className="container relative mx-auto px-4 text-center">
          <h2 className="mx-auto max-w-xl text-3xl font-bold font-display text-white sm:text-4xl">
            Find out where you fit in the method
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-300">
            Take the Performance Assessment and STRENTOR will recommend the
            right coaching pathway for you.
          </p>
          <div className="mt-8 flex justify-center">
            <Button asChild className="h-14 rounded-full bg-[#C9A96A] px-8 text-black hover:bg-[#C9A96A]/90">
              <Link href="/apply-for-access">Take the Performance Assessment</Link>
            </Button>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  )
}
