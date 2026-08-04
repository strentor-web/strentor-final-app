"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/motion/ScrollReveal"
import { HoverLift } from "@/components/motion/HoverLift"

const successStories = [
  {
    condition: "Spina Bifida",
    description: "Adaptive strength and mobility coaching built around spina bifida — not a generic seated workout.",
    number: "01",
    color: "from-[#C9A96A]/10 to-[#C9A96A]/5",
    numberBg: "#C9A96A",
    href: "/programs/spina-bifida-fitness-coaching"
  }
]

export default function SuccessStories() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
            Built Around <span className="text-[#C9A96A]">Real Conditions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Coaching designed around your specific situation, not a generic template. Here&apos;s what that looks like.
          </p>
        </ScrollReveal>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:px-[33.333%]">
            {successStories.map((story, index) => {
              const cardClassName = `rounded-xl p-6 bg-gradient-to-br ${story.color} border border-border transition-all duration-300 hover:shadow-lg`
              const cardContent = (
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: story.numberBg }}
                  >
                    <span className="text-xl font-bold text-strentor-black">{story.number}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{story.condition}</h3>
                    <p className="text-muted-foreground">{story.description}</p>
                    {story.href && (
                      <Button asChild className="mt-3 bg-[#C9A96A] hover:bg-[#C9A96A]/90 text-primary-foreground">
                        <Link href={story.href}>
                          Learn More
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              )

              return (
                <ScrollReveal key={index} as="div">
                  <HoverLift tilt={false} className={cardClassName}>
                    {cardContent}
                  </HoverLift>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
} 