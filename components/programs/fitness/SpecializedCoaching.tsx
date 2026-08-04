"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollReveal, StaggerGroup } from "@/components/motion/ScrollReveal"
import { HoverLift } from "@/components/motion/HoverLift"

const specializedPrograms = [
  {
    title: "Wheelchair Fitness Coaching in India",
    description: "Full strength, nutrition, and mindset coaching for clients anywhere in India — coached by a national-level para powerlifter.",
    href: "/programs/wheelchair-fitness-coaching-india",
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
        <ScrollReveal className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            Specialized <span className="text-[#C9A96A]">Coaching</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore coaching built around your specific circumstances.
          </p>
        </ScrollReveal>
        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {specializedPrograms.map((program) => (
            <ScrollReveal key={program.href}>
              <HoverLift className="flex h-full flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-[#C9A96A] hover:shadow-lg">
                <div>
                  <h3 className="text-lg font-bold text-card-foreground">{program.title}</h3>
                  <p className="mt-2 text-muted-foreground">{program.description}</p>
                </div>
                <Button asChild className="mt-4 w-fit bg-[#C9A96A] hover:bg-[#C9A96A]/90 text-primary-foreground">
                  <Link href={program.href}>
                    Learn More
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </HoverLift>
            </ScrollReveal>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
