import Link from "next/link"
import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Quote } from "lucide-react"
import { testimonials as staticTestimonials } from "@/data/testimonials"
import { getPublishedCaseStudies } from "@/lib/caseStudies"
import { ScrollReveal, StaggerGroup } from "@/components/motion/ScrollReveal"
import { HoverLift } from "@/components/motion/HoverLift"
import prisma from "@/utils/prisma/prismaClient"

// This page reads live from the database (newly submitted testimonials
// must appear immediately, per the "publish whenever submitted" design —
// see /transformation-stories/share). Without this, Next.js would try to
// statically prerender it once at build time, which both requires DB
// access during the build and freezes the list until the next deploy.
export const dynamic = "force-dynamic"

interface StoryCard {
  key: string
  quote: string
  author: string
  context?: string
}

async function getStories(): Promise<StoryCard[]> {
  const fromStatic: StoryCard[] = staticTestimonials.map((t) => ({
    key: t.author,
    quote: t.quote,
    author: t.author,
  }))

  // Published directly by visitors via /transformation-stories/share — see
  // that page and prisma/schema.prisma's site_testimonials model comment
  // for why these publish immediately rather than going through review.
  // This query is wrapped defensively: the static testimonials, the case
  // studies, and the rest of the page don't depend on the database at all,
  // so a DB outage here shouldn't 500 the whole page — it should just mean
  // the live-submitted stories are temporarily missing.
  try {
    const submitted = await prisma.site_testimonials.findMany({
      where: { is_published: true },
      orderBy: { created_at: "desc" },
      take: 60,
    })

    const fromSubmissions: StoryCard[] = submitted.map((t) => ({
      key: t.id,
      quote: t.testimonial_text,
      author: t.name_display,
      context: t.context ?? undefined,
    }))

    return [...fromSubmissions, ...fromStatic]
  } catch (error) {
    console.error("Failed to load submitted testimonials, falling back to static list:", error)
    return fromStatic
  }
}

export default async function TransformationStoriesPage() {
  const stories = await getStories()
  const caseStudies = getPublishedCaseStudies()

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
          <div className="mt-8">
            <Button asChild variant="outline" className="h-12 rounded-full border-[#C9A96A]/40 px-6 text-white hover:bg-white/10">
              <Link href="/transformation-stories/share">Share Your Story</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Case studies — starting point, coaching approach, and where each
          person is now. More detail than a testimonial quote, so these get
          their own cards linking to a full page rather than being folded
          into the quote grid below. */}
      {caseStudies.length > 0 && (
        <section className="container mx-auto px-4 py-16 md:py-24">
          <ScrollReveal className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-[#C9A96A]">Case Studies</span>
            <h2 className="mt-3 text-3xl font-bold font-display text-foreground sm:text-4xl">
              Starting point. Approach. Where they are now.
            </h2>
          </ScrollReveal>

          <StaggerGroup className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2">
            {caseStudies.map((study) => (
              <ScrollReveal key={study.slug}>
                <HoverLift tilt={false} className="h-full">
                  <Link
                    href={`/transformation-stories/${study.slug}`}
                    className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-8 transition-colors hover:border-[#C9A96A]"
                  >
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A96A]">
                      {study.role === "Founder" ? "Founder Story" : "Client Story"}
                    </span>
                    <h3 className="text-xl font-bold text-card-foreground">{study.name}</h3>
                    <p className="text-xs font-medium text-muted-foreground">{study.condition}</p>
                    <p className="flex-1 text-sm text-muted-foreground">{study.excerpt}</p>
                    <span className="flex items-center gap-2 text-sm font-semibold text-[#C9A96A]">
                      Read the full story <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                </HoverLift>
              </ScrollReveal>
            ))}
          </StaggerGroup>
        </section>
      )}

      {/* Testimonial cards */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <StaggerGroup className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <ScrollReveal key={story.key}>
              <HoverLift className="flex h-full flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
                <Quote className="h-8 w-8 text-[#B8935A]" />
                <p className="flex-1 text-base font-medium leading-relaxed text-card-foreground">
                  &ldquo;{story.quote}&rdquo;
                </p>
                <div className="h-1 w-12 bg-gradient-to-r from-[#C9A96A] via-[#B8935A] to-[#C9C0B4]" />
                <div>
                  <p className="font-semibold text-[#C9A96A]">{story.author}</p>
                  {story.context && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{story.context}</p>
                  )}
                </div>
              </HoverLift>
            </ScrollReveal>
          ))}
        </StaggerGroup>

        <ScrollReveal className="mx-auto mt-12 max-w-xl rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Have a story of your own?
          </p>
          <p className="mt-2 text-muted-foreground">
            <Link href="/transformation-stories/share" className="font-semibold text-[#C9A96A] hover:underline">
              Share it here
            </Link>{" "}
            — it'll appear on this page.
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
