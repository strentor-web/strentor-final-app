"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

const successStories = [
  {
    condition: "Spina Bifida",
    description: "Helped clients play sports like critical pain-free with customised fitness plans.",
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
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
            Real <span className="text-[#C9A96A]">Transformations</span>, Real Results
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            At STRENTOR, we&apos;ve already helped people achieve life-changing results. We don&apos;t promise magic - we deliver proven strategies that empower you to break through your limitations.
          </p>
        </div>

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
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[#C9A96A]">
                        Learn More
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                </div>
              )

              return story.href ? (
                <Link key={index} href={story.href} className={`group ${cardClassName}`}>
                  {cardContent}
                </Link>
              ) : (
                <div key={index} className={cardClassName}>
                  {cardContent}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
} 