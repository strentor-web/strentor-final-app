"use client"

import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import {
  ShieldCheck,
  HeartHandshake,
  Dumbbell,
  Eye,
  Compass,
  ArrowRight,
} from "lucide-react"

const coreValues = [
  {
    icon: ShieldCheck,
    title: "Dignity",
    description:
      "Every client is coached as a capable athlete first — never as a project or a cause. Programming respects who you are, not just what you're managing.",
  },
  {
    icon: Dumbbell,
    title: "Discipline",
    description:
      "Real transformation is built through consistency, not intensity spikes. Coaching prioritizes routine and follow-through over quick wins.",
  },
  {
    icon: HeartHandshake,
    title: "Safety",
    description:
      "Health context and safety come before every training decision. Intensity is earned once it's clear your body is ready for it.",
  },
  {
    icon: Eye,
    title: "Honesty",
    description:
      "No inflated promises, no guaranteed outcomes, no exaggerated claims. Coaching is straightforward about what's realistic and what isn't.",
  },
  {
    icon: Compass,
    title: "Adaptability",
    description:
      "Every plan is built around your body and equipment from day one — not adapted afterward from a standing-body template.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero / About Strentor intro */}
      <div className="relative bg-black py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
        <div className="container relative mx-auto px-4 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-[#C9A96A]">
            About Strentor
          </span>
          <h1 className="mt-4 text-4xl font-bold font-display text-white sm:text-5xl md:text-6xl">
            Strength, Discipline, And <span className="text-[#C9A96A]">Purpose</span> — On Your Terms
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
            STRENTOR is an adaptive strength and transformation brand built for people who refuse
            to let physical challenges define their future. It combines fitness coaching, mindset
            discipline, emotional resilience, and purpose-led action in a way that respects real
            bodies, health realities, confidence levels, and personal ambition.
          </p>
        </div>
      </div>

      {/* Built from lived experience */}
      <section className="container mx-auto max-w-3xl px-4 py-16 text-center">
        <h2 className="text-3xl font-bold font-display text-foreground sm:text-4xl">
          Built From <span className="text-[#C9A96A]">Lived Experience</span>
        </h2>
        <div className="mt-6 space-y-4 text-left text-lg font-medium text-muted-foreground">
          <p>
            Most fitness coaching assumes a standing body and treats everything else as a
            modification. STRENTOR exists because that assumption doesn&apos;t hold up — coaching
            wheelchair users and clients managing long-term conditions requires programming built
            around a body from the very first session, not adjusted onto it after the fact.
          </p>
          <p>
            That distinction didn&apos;t come from a textbook. It came from training as a
            competitive para athlete, coaching clients through the same physical and emotional
            terrain, and seeing firsthand how much progress changes when a program starts from
            your actual ability, equipment, and health context instead of a generic standard.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-black py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            <div className="rounded-xl border-t-4 border-[#C9A96A] bg-white/5 p-8">
              <h2 className="text-2xl font-bold text-[#C9A96A]">Mission</h2>
              <p className="mt-4 text-lg text-gray-200">
                To help clients become physically stronger, mentally steadier, emotionally more
                confident, and better prepared to pursue their goals without compromising health
                and safety.
              </p>
            </div>
            <div className="rounded-xl border-t-4 border-[#C9A96A] bg-white/5 p-8">
              <h2 className="text-2xl font-bold text-[#C9A96A]">Vision</h2>
              <p className="mt-4 text-lg text-gray-200">
                To become a trusted global adaptive transformation brand for strength, confidence,
                discipline, and purpose-driven living.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Story */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2">
          <div className="relative order-1 h-[500px] overflow-hidden rounded-lg shadow-xl">
            <Image
              src="/Aditya-transparent.png"
              alt="Aditya Mandan, founder of Strentor and national-level para powerlifter"
              fill
              className="object-cover object-top"
            />
          </div>
          <div className="order-2 space-y-6">
            <span className="text-sm font-bold uppercase tracking-widest text-[#C9A96A]">
              Founder Story
            </span>
            <h2 className="text-3xl font-bold font-display text-foreground sm:text-4xl">
              Aditya Mandan
            </h2>
            <div className="space-y-4 text-lg font-medium text-muted-foreground leading-relaxed">
              <p>
                Aditya Mandan is a national-level para powerlifter, certified fitness trainer, and
                the founder of STRENTOR. His approach to coaching is shaped directly by his own
                training — building competitive strength while managing the same real-world
                physical realities his clients navigate, from equipment constraints to health
                considerations that don&apos;t pause for a training block.
              </p>
              <p>
                Before STRENTOR, that experience lived in individual coaching relationships —
                athletes and clients who use wheelchairs or manage long-term conditions, trained
                one session at a time. Building STRENTOR was a deliberate move to turn that
                approach into a structured, repeatable coaching system: adaptive strength training
                delivered with the same discipline and rigor as any competitive program, without
                pretending health realities don&apos;t exist.
              </p>
              <p>
                It reflects a straightforward operating principle — strength and discipline are
                built the same way regardless of the body doing the work: consistently, safely,
                and with a plan that respects where you&apos;re actually starting from.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold font-display text-foreground sm:text-4xl">
              Core Values
            </h2>
            <p className="mt-4 text-lg font-medium text-muted-foreground">
              The principles that shape every program, every check-in, and every coaching decision.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((value) => (
              <div
                key={value.title}
                className="flex gap-4 rounded-xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A96A]">
                  <value.icon className="h-5 w-5 text-strentor-black" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-card-foreground">{value.title}</h3>
                  <p className="mt-1 text-muted-foreground">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Strentor exists */}
      <section className="container mx-auto max-w-3xl px-4 py-16 text-center">
        <h2 className="text-3xl font-bold font-display text-foreground sm:text-4xl">
          Why <span className="text-[#C9A96A]">Strentor</span> Exists
        </h2>
        <div className="mt-6 space-y-4 text-left text-lg font-medium text-muted-foreground">
          <p>
            Wheelchair users and people managing chronic health conditions are routinely offered
            two options: generic fitness programming that ignores their reality, or
            inspiration-driven campaigns that focus on overcoming adversity instead of building
            actual capability. Neither delivers structured, competent coaching.
          </p>
          <p>
            STRENTOR exists to close that gap — with programming that treats adaptive strength
            training as a serious discipline, not a modification or a feel-good story. The goal is
            straightforward: stronger bodies, steadier minds, and clients who are better equipped
            to pursue whatever comes next, coached with the same rigor as any elite strength
            program, and never at the cost of health or safety.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-black py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-display text-white sm:text-4xl">
            Ready To Start Your <span className="text-[#C9A96A]">Fit Assessment</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-300">
            A structured conversation about your body, your goals, and your health context — the
            first step toward coaching built specifically for you.
          </p>
          <div className="mt-8">
            <Button
              asChild
              className="h-14 rounded-full bg-[#C9A96A] px-8 hover:bg-[#C9A96A]/90"
            >
              <Link href="/contact">
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
