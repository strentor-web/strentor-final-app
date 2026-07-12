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
import { ShieldAlert, ArrowRight, Check } from "lucide-react"
import Link from "next/link"

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
          <span className="text-sm font-bold uppercase tracking-widest text-[#C9A96A]">
            {eyebrow}
          </span>
          <h1 className="mt-4 text-4xl font-bold font-display text-white sm:text-5xl md:text-6xl">
            {title} <span className="text-[#C9A96A]">{titleAccent}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
            {subtitle}
          </p>
          {priceRange && (
            <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
              {priceRange} · Final pricing confirmed on your discovery call
            </p>
          )}
          <div className="mt-8">
            <Button
              className="h-14 rounded-full bg-[#C9A96A] px-8 text-lg font-bold hover:bg-[#C9A96A]/90"
              onClick={() => window.open("https://calendly.com/strentor/strentor-services", "_blank")}
            >
              Book a Free Consultation
            </Button>
          </div>
        </div>
      </div>

      {/* Intro */}
      <section className="container mx-auto max-w-3xl px-4 py-16 text-center">
        <h2 className="text-3xl font-bold font-display text-foreground sm:text-4xl">
          {intro.heading}
        </h2>
        <div className="mt-6 space-y-4 text-left text-lg font-medium text-muted-foreground">
          {intro.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex gap-4 rounded-xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A96A]">
                  <Check className="h-5 w-5 text-strentor-black" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-card-foreground">{benefit.title}</h3>
                  <p className="mt-1 text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Medical/safety disclaimer */}
      {disclaimer && (
        <section className="container mx-auto px-4 py-10">
          <div className="mx-auto flex max-w-3xl gap-4 rounded-xl border border-[#C9A96A]/30 bg-[#C9A96A]/5 p-6">
            <ShieldAlert className="h-6 w-6 flex-shrink-0 text-[#C9A96A]" />
            <p className="text-sm text-muted-foreground">{disclaimer}</p>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="mb-8 text-3xl font-bold font-display text-[#C9A96A] sm:text-4xl">
          Frequently Asked Questions
        </h2>
        <div className="mx-auto max-w-3xl">
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
        </div>
      </section>

      {/* Related programs */}
      {relatedLinks.length > 0 && (
        <section className="container mx-auto px-4 pb-16 text-center">
          <h2 className="mb-6 text-2xl font-bold font-display text-foreground">
            Other Specialized Coaching
          </h2>
          <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-4">
            {relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group inline-flex items-center gap-1 rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:border-[#C9A96A] hover:text-[#C9A96A]"
              >
                {link.label}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Final CTA */}
      <div className="bg-black py-20 text-center">
        <h2 className="mb-4 text-4xl font-bold font-display text-white sm:text-5xl">
          Ready to Begin Your <span className="text-[#C9A96A]">Journey</span>?
        </h2>
        <p className="mx-auto max-w-[700px] pb-8 pt-2 text-gray-300 md:text-xl">
          Take the first step towards transformation with our expert coaching team.
        </p>
        <Button
          className="rounded-full bg-[#C9A96A] px-8 py-6 text-lg font-bold text-primary-foreground hover:bg-[#C9A96A]/90"
          onClick={() => window.open("https://calendly.com/strentor/strentor-services", "_blank")}
        >
          Start Your Transformation
        </Button>
      </div>

      <Footer />
    </div>
  )
}

export default NicheProgramPage
