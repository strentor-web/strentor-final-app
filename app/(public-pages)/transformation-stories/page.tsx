import Link from "next/link"
import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import { Quote } from "lucide-react"
import { testimonials } from "@/data/testimonials"
import { ScrollReveal, StaggerGroup } from "@/components/motion/ScrollReveal"
import { HoverLift } from "@/components/motion/HoverLift"

export default function TransformationStoriesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <div className="relative bg-black py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
        <div className="container relative mx-auto px-4 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-[#C9A96A]">
            Transformation Stories
          </span>
          <h1 className="mt-4 text-4xl font-bold font-display text-white sm:text-5xl md:text-6xl">
            Real clients. <span className="text-[#C9A96A]">Real words.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
            These are the client stories currently on record with STRENTOR —
            presented as given, without invented details, numbers, or
            outcomes.
          </p>
        </div>
      </div>

      {/* Testimonial cards */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <StaggerGroup className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <ScrollReveal key={testimonial.author}>
              <HoverLift className="flex h-full flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
                <Quote className="h-8 w-8 text-[#B8935A]" />
                <p className="flex-1 text-base font-medium leading-relaxed text-card-foreground">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="h-1 w-12 bg-gradient-to-r from-[#C9A96A] via-[#B8935A] to-[#C9C0B4]" />
                <p className="font-semibold text-[#C9A96A]">{testimonial.author}</p>
              </HoverLift>
            </ScrollReveal>
          ))}
        </StaggerGroup>

        <ScrollReveal className="mx-auto mt-12 max-w-xl rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            More stories
          </p>
          <p className="mt-2 text-muted-foreground">
            Detailed transformation stories — starting point, goals, coaching
            approach, and progress — are coming soon as more clients complete
            their programs and consent to share their journey in full.
          </p>
        </ScrollReveal>
      </section>

      {/* Final CTA */}
      <section className="relative bg-black py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
        <ScrollReveal className="container relative mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-display text-white sm:text-4xl">
            Ready to write your own story?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-300">
            Take the Performance Assessment and STRENTOR will recommend the
            right coaching pathway for you.
          </p>
          <div className="mt-8 flex justify-center">
            <Button asChild className="h-14 rounded-full bg-[#C9A96A] px-8 hover:bg-[#C9A96A]/90">
              <Link href="/apply-for-access">Take the Performance Assessment</Link>
            </Button>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  )
}
