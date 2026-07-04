"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

const specializedPrograms = [
  {
    title: "Wheelchair Fitness Coaching in India",
    description: "Adaptive strength training and nutrition guidance for wheelchair users, delivered virtually across India.",
    href: "/programs/wheelchair-fitness-coaching-india",
  },
  {
    title: "Online Strength Training for Wheelchair Users",
    description: "Seated strength training, progression tracking, and coach check-ins — fully online.",
    href: "/programs/online-wheelchair-strength-training",
  },
  {
    title: "Spina Bifida Fitness Coaching",
    description: "Personalized coaching built around your ability level, not a generic program.",
    href: "/programs/spina-bifida-fitness-coaching",
  },
  {
    title: "CKD-Aware Strength Coaching",
    description: "Strength and nutrition coaching designed to work alongside your medical team.",
    href: "/programs/ckd-aware-strength-coaching",
  },
]

export default function SpecializedCoaching() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            Specialized <span className="text-[#C9A96A]">Coaching</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore coaching built around your specific circumstances.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {specializedPrograms.map((program) => (
            <Link
              key={program.href}
              href={program.href}
              className="group flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-[#C9A96A] hover:shadow-lg"
            >
              <div>
                <h3 className="text-lg font-bold text-card-foreground">{program.title}</h3>
                <p className="mt-2 text-muted-foreground">{program.description}</p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#C9A96A]">
                Learn More
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
