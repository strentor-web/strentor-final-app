"use client"

import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Check, ArrowRight } from "lucide-react"

const checklist = [
  "Founded by Aditya Mandan",
  "Wheelchair user living with Spina Bifida & CKD-aware",
  "Certified Fitness Trainer & Nutrition Consultant",
  "Para Powerlifter",
  "Lived experience. Real discipline. Real results.",
  "Building access. Building strength. Building life.",
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page header */}
      <div className="border-b border-border bg-black py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-display text-white sm:text-5xl">
            About <span className="text-[#C9A96A]">STRENTOR</span>
          </h1>
        </div>
      </div>

      {/* Two-column: story + photo */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-2">
          {/* Left: body text + checklist */}
          <div>
            <p className="text-lg font-medium leading-relaxed text-muted-foreground">
              STRENTOR is a founder-led, wheelchair-first holistic strength platform that helps
              wheelchair users build seated strength, confidence, resilience, and daily fitness
              habits through adaptive coaching and sponsored access seats.
            </p>

            <ul className="mt-8 space-y-4">
              {checklist.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A96A]/10">
                    <Check className="h-4 w-4 text-[#C9A96A]" />
                  </span>
                  <span className="text-base font-medium text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: founder photo */}
          <div className="flex flex-col items-center lg:items-end">
            <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-[#C9A96A]/30 bg-card p-2 shadow-sm">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-black">
                <Image
                  src="/Aditya-transparent.png"
                  alt="Aditya Mandan, founder of STRENTOR, in his wheelchair wearing a black STRENTOR t-shirt"
                  fill
                  className="object-cover object-top"
                />
              </div>
            </div>
            <p className="mt-4 text-sm font-medium text-muted-foreground">
              Aditya Mandan — Founder, STRENTOR
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-black py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-display text-white sm:text-4xl">
            Ready to begin your <span className="text-[#C9A96A]">strength journey?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-300">
            Apply for a coaching seat, or help sponsor access for a wheelchair user who needs it.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              className="h-14 rounded-full bg-[#C9A96A] px-8 hover:bg-[#C9A96A]/90"
            >
              <Link href="/apply-for-access">
                Apply for Access
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-14 rounded-full border-[#C9A96A]/40 bg-transparent px-8 text-white hover:bg-white/10"
            >
              <Link href="/sponsor-a-seat">Sponsor a Seat</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
