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
import { ShieldAlert, Check } from "lucide-react"
import Link from "next/link"
import { ScrollReveal, StaggerGroup } from "@/components/motion/ScrollReveal"
import { HoverLift } from "@/components/motion/HoverLift"

export interface NicheFaq {
  question: string
  answer: string
}

export interface NicheProgramPageProps {
  eyebrow: string
  title: string
  titleAccent: string
  subtitle: string
  priceRange?: string
  contactPlan: string
  // When set, the primary hero CTA links directly to checkout (sessions/
  // week priced, program pre-selected) instead of the discovery-call
  // funnel — "Book Fit Assessment" still appears as a secondary option.
  checkoutHref?: string
  intro: {
    heading: string
    paragraphs: string[]
  }
  benefits: { title: string; description: string }[]
  disclaimer?: string
  faqs: NicheFaq[]
  relatedLinks: { label: string; href: string }[]
}

export function NicheProgramPage({
  eyebrow,
  title,
  titleAccent,
  subtitle,
  priceRange,
  contactPlan,
  checkoutHref,
  intro,
  benefits,
  disclaimer,
  faqs,
  relatedLinks,
}: NicheProgramPageProps) {
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
          <ScrollReveal direction="none">
            <span className="text-sm font-bold uppercase tracking-widest text-[#C9A96A]">
              {eyebrow}
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.1} scale={0.96}>
            <h1 className="mt-4 text-4xl font-bold font-display text-white sm:text-5xl md:text-6xl">
              {title} <span className="text-[#C9A96A]">{titleAccent}</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
              {subtitle}
            </p>
          </ScrollReveal>
          {priceRange && (
            <ScrollReveal delay={0.28}>
              <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
                {priceRange}
                {checkoutHref
                  ? " · Priced by sessions per week — enroll instantly or book a call first"
                  : " · Final pricing confirmed on your discovery call"}
              </p>
            </ScrollReveal>
          )}
          <ScrollReveal delay={0.35} className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            {checkoutHref ? (
              <>
                <Button asChild className="h-14 rounded-full bg-[#C9A96A] px-8 hover:bg-[#C9A96A]/90">
                  <Link href={checkoutHref}>Enroll Now</Link>
                </Button>
                <Button asChild variant="outline" className="h-14 rounded-full border-white/30 px-8 text-white hover:bg-white/10">
                  <Link href={`/contact?type=personal&plan=${encodeURIComponent(contactPlan)}`}>
                    Or Book Fit Assessment First
                  </Link>
                </Button>
              </>
            ) : (
              <Button asChild className="h-14 rounded-full bg-[#C9A96A] px-8 hover:bg-[#C9A96A]/90">
                <Link href={`/contact?type=personal&plan=${encodeURIComponent(contactPlan)}`}>
                  Book Fit Assessment
                </Link>
              </Button>
            )}
          </ScrollReveal>
        </div>
      </div>

      {/* Intro */}
      <section className="container mx-auto max-w-3xl px-4 py-16 text-center">
        <ScrollReveal>
          <h2 className="text-3xl font-bold font-display text-foreground sm:text-4xl">
            {intro.heading}
          </h2>
        </ScrollReveal>
        <div className="mt-6 space-y-4 text-left text-lg font-medium text-muted-foreground">
          {intro.paragraphs.map((paragraph, index) => (
            <ScrollReveal key={index} delay={index * 0.06} as="div">
              <p>{paragraph}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <StaggerGroup className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
            {benefits.map((benefit, index) => (
              <ScrollReveal key={index}>
                <HoverLift className="flex h-full gap-4 rounded-xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-[#C9A96A]/40">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A96A]">
                    <Check className="h-5 w-5 text-strentor-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-card-foreground">{benefit.title}</h3>
                    <p className="mt-1 text-muted-foreground">{benefit.description}</p>
                  </div>
                </HoverLift>
              </ScrollReveal>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Medical/safety disclaimer */}
      {disclaimer && (
        <section className="container mx-auto px-4 py-10">
          <ScrollReveal className="mx-auto flex max-w-3xl gap-4 rounded-xl border border-[#C9A96A]/30 bg-[#C9A96A]/5 p-6">
            <ShieldAlert className="h-6 w-6 flex-shrink-0 text-[#C9A96A]" />
            <p className="text-sm text-muted-foreground">{disclaimer}</p>
          </ScrollReveal>
        </section>
      )}

      {/* FAQ */}
      <section className="container mx-auto px-4 py-16 text-center">
        <ScrollReveal>
          <h2 className="mb-8 text-3xl font-bold font-display text-[#C9A96A] sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1} className="mx-auto max-w-3xl">
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
        </ScrollReveal>
      </section>

      {/* Related programs */}
      {relatedLinks.length > 0 && (
        <section className="container mx-auto px-4 pb-16 text-center">
          <ScrollReveal>
            <h2 className="mb-6 text-2xl font-bold font-display text-foreground">
              Other Specialized Coaching
            </h2>
          </ScrollReveal>
          <StaggerGroup className="mx-auto flex max-w-3xl flex-wrap justify-center gap-4">
            {relatedLinks.map((link) => (
              <ScrollReveal key={link.href} as="div">
                <HoverLift tilt={false}>
                  <Button asChild className="rounded-full bg-[#C9A96A] px-6 hover:bg-[#C9A96A]/90 text-primary-foreground">
                    <Link href={link.href}>{link.label}</Link>
                  </Button>
                </HoverLift>
              </ScrollReveal>
            ))}
          </StaggerGroup>
        </section>
      )}

      <Footer />
    </div>
  )
}

export default NicheProgramPage
