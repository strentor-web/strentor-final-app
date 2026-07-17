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
import { ShieldAlert, ArrowRight, Check, HandCoins, Users, Building2, ClipboardCheck } from "lucide-react"
import Link from "next/link"

const sponsorshipFormats = [
  {
    icon: HandCoins,
    title: "Full Sponsorship",
    description:
      "Covers one applicant's coaching access in full for an agreed period, so they can begin training without any cost barrier.",
  },
  {
    icon: Users,
    title: "Partial Sponsorship",
    description:
      "Covers a portion of coaching access, with the remainder paid by the athlete. A practical middle ground for many sponsors.",
  },
  {
    icon: Check,
    title: "Sponsor-a-Session",
    description:
      "Contribute toward a set number of coaching sessions rather than an ongoing program — useful for a one-time contribution.",
  },
  {
    icon: Building2,
    title: "Corporate Sponsorship Pools",
    description:
      "Organizations contribute to a shared pool that Strentor allocates across multiple applicants as part of a CSR commitment.",
  },
]

const faqs = [
  {
    question: "Is my sponsorship contribution tax-deductible?",
    answer:
      "No. Pay It Forward sponsorships are not currently structured as tax-deductible donations. We use the word \"sponsorship\" deliberately rather than \"donation\" because no charitable tax status has been established. If this changes, it will be clearly communicated on this page.",
  },
  {
    question: "Who decides who receives sponsored coaching access?",
    answer:
      "Strentor reviews every application internally and allocates available sponsorship support based on need and fit with our coaching capacity. Sponsors do not select or interact with individual applicants — this keeps the process fair and keeps applicants' personal information private.",
  },
  {
    question: "Will my personal or health information be shared if I apply?",
    answer:
      "No. Anything you share as part of a support application — including health history or financial circumstances — is used only by Strentor's team to assess the application. It is never published, shared with sponsors, or used in marketing without your explicit, separate consent.",
  },
  {
    question: "How much does a sponsorship need to be?",
    answer:
      "There's no fixed minimum. Sponsorships range from a single session to a full coaching program, and corporate sponsors can contribute at scale through a pooled arrangement. We'll help you find a format that fits what you're able to give.",
  },
  {
    question: "What if I can only afford part of the coaching cost myself?",
    answer:
      "That's exactly what partial sponsorship is for. You apply for support, tell us what you're able to contribute, and Strentor works to allocate sponsorship funding to cover the rest, where available.",
  },
]

export default function PayItForwardPage() {
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
            Access Support
          </span>
          <h1 className="mt-4 text-4xl font-bold font-display text-white sm:text-5xl md:text-6xl">
            Each One, Pay One. <span className="text-[#C9A96A]">Pay It Forward.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
            Sponsor part or full coaching access for someone who wants Strentor coaching
            but faces a financial barrier to getting started. Or, if that's you, apply
            for sponsorship support.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              className="h-14 w-full rounded-full bg-[#C9A96A] px-8 hover:bg-[#C9A96A]/90 sm:w-auto"
            >
              <Link href="/contact?type=sponsor">Become a Sponsor</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-14 w-full rounded-full border-[#C9A96A]/40 bg-transparent px-8 text-white hover:bg-[#C9A96A]/10 sm:w-auto"
            >
              <Link href="/contact?type=sponsored_support">Apply for Support</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* How sponsorship works */}
      <section className="container mx-auto max-w-3xl px-4 py-16 text-center">
        <h2 className="text-3xl font-bold font-display text-foreground sm:text-4xl">
          How Sponsorship Works
        </h2>
        <div className="mt-6 space-y-4 text-left text-lg font-medium text-muted-foreground">
          <p>
            Pay It Forward is a straightforward mechanism: a sponsor contributes toward
            the cost of coaching access, and Strentor allocates that support to a
            vetted applicant who needs it. The sponsor isn't buying a specific person's
            program off a list — they're contributing to a pool of coaching access that
            Strentor directs to where it's needed most.
          </p>
          <p>
            The applicant, in turn, doesn't receive cash. They receive coaching —
            structured programming, trainer support, and the same standard of
            adaptive strength coaching every Strentor athlete gets, funded in part or
            in full by sponsorship support instead of out of their own pocket.
          </p>
          <p>
            The name captures the intent: each person who is able to sponsor, sponsors
            one. It's a direct, practical way to extend access without turning coaching
            into a charity program.
          </p>
          <p>
            Nothing about this changes how coaching is delivered. A sponsored athlete
            works with the same trainers, follows the same programming standards, and
            is held to the same expectations as anyone paying for coaching directly.
            Sponsorship changes who covers the cost — it doesn't change what's
            coached, or how seriously it's coached.
          </p>
        </div>
      </section>

      {/* Who can sponsor / Who can apply */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
              <h3 className="text-xl font-bold font-display text-card-foreground">
                Who Can Sponsor
              </h3>
              <p className="mt-3 text-muted-foreground">
                Sponsorship is open to individuals, companies, and community groups.
                An individual can sponsor a single session or a full program. A
                company can direct part of its CSR budget toward a sponsorship pool.
                A community group — a club, a workplace collective, an alumni
                network — can pool smaller contributions together toward one or more
                applicants. There's no minimum group size and no requirement to commit
                beyond what you choose upfront.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
              <h3 className="text-xl font-bold font-display text-card-foreground">
                Who Can Apply for Support
              </h3>
              <p className="mt-3 text-muted-foreground">
                Support is intended for people who want Strentor coaching — adaptive
                strength training built around real physical circumstances — but for
                whom cost is the barrier standing between them and getting started.
                If you're ready to train and finances are the obstacle, this program
                exists for you. There's no separate application track based on
                condition or disability type — the criterion is financial need, not
                diagnosis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsorship formats */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-10 text-center text-3xl font-bold font-display text-foreground sm:text-4xl">
          Sponsorship Formats
        </h2>
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
          {sponsorshipFormats.map((format) => (
            <div
              key={format.title}
              className="flex gap-4 rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A96A]">
                <format.icon className="h-5 w-5 text-strentor-black" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-card-foreground">{format.title}</h3>
                <p className="mt-1 text-muted-foreground">{format.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Review and allocation */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A96A]/10">
            <ClipboardCheck className="h-6 w-6 text-[#C9A96A]" />
          </div>
          <h2 className="mt-4 text-3xl font-bold font-display text-foreground sm:text-4xl">
            Review and Allocation
          </h2>
          <p className="mt-6 text-left text-lg font-medium text-muted-foreground">
            Every application for sponsorship support is reviewed by the Strentor team
            before any coaching access is allocated. We look at need, readiness to
            train, and how available sponsorship funds can be used fairly across
            everyone waiting for support. This isn't a heavy bureaucratic process —
            it's a reasonable check to make sure sponsorship support goes where it's
            needed and is allocated responsibly, session by session and program by
            program.
          </p>
          <p className="mt-4 text-left text-lg font-medium text-muted-foreground">
            Sponsors are never asked to review or approve individual applicants. That
            decision sits with Strentor alone, which keeps the process consistent and
            keeps every applicant's information out of a sponsor's hands.
          </p>
          <p className="mt-4 text-left text-lg font-medium text-muted-foreground">
            When sponsorship funds are limited, applications are prioritized by need
            and by how ready an applicant is to begin. When they open up, applicants
            who weren't allocated support the first time are kept in consideration
            rather than asked to start over.
          </p>
        </div>
      </section>

      {/* Dignity and privacy */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto flex max-w-3xl gap-4 rounded-xl border border-[#C9A96A]/30 bg-[#C9A96A]/5 p-6">
          <ShieldAlert className="h-6 w-6 flex-shrink-0 text-[#C9A96A]" />
          <div>
            <h3 className="text-lg font-bold text-foreground">Dignity and Privacy, By Design</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Applying for sponsorship support means sharing some personal and, at
              times, health-related context with us so we can assess your application
              fairly. That information stays private. It is never published, never
              shared with sponsors, and never used outside the review process without
              your explicit consent. Sponsored athletes train alongside every other
              Strentor client, with the same coaching standard and no public labeling
              of who is or isn't sponsored. Pay It Forward is built to extend access —
              not to put anyone's circumstances on display.
            </p>
          </div>
        </div>
      </section>

      {/* Corporate / CSR */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold font-display text-foreground sm:text-3xl">
            Corporate and CSR Sponsorship
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Organizations looking to sponsor coaching access at scale — as part of a
            CSR budget, an employee wellness initiative, or a broader inclusion
            commitment — can set up a corporate sponsorship pool with Strentor.
            Visit our corporate page to see how companies partner with us.
          </p>
          <Link
            href="/corporate"
            className="group mt-6 inline-flex items-center gap-1 rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:border-[#C9A96A] hover:text-[#C9A96A]"
          >
            Explore Corporate Partnerships
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Tax clarity */}
      <section className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-xl border border-border bg-card p-6 text-center">
          <h3 className="text-base font-bold text-card-foreground">A Note on Tax Benefits</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Pay It Forward sponsorships are not currently structured as tax-deductible
            donations. They are sponsorship contributions toward coaching access, not
            charitable donations, and no tax benefit is implied or promised. If this
            changes, it will be clearly communicated on this page.
          </p>
        </div>
      </section>

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

      {/* Final dual CTA */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-display text-white sm:text-4xl">
            Each One, <span className="text-[#C9A96A]">Pay One.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-300">
            Whether you're in a position to sponsor someone else's coaching access, or
            you're looking for support to start your own, the next step takes two
            minutes.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              className="h-14 w-full rounded-full bg-[#C9A96A] px-8 hover:bg-[#C9A96A]/90 sm:w-64"
            >
              <Link href="/contact?type=sponsor">Become a Sponsor</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-14 w-full rounded-full border-[#C9A96A]/40 bg-transparent px-8 text-white hover:bg-[#C9A96A]/10 sm:w-64"
            >
              <Link href="/contact?type=sponsored_support">Apply for Support</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
