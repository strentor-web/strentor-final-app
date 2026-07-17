"use client";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  Check,
  Building2,
  Users,
  HeartHandshake,
  ClipboardList,
  LineChart,
  Sparkles,
  Briefcase,
  Presentation,
  ShieldCheck,
  UserCheck,
  BarChart3,
  FileText,
} from "lucide-react";
import Link from "next/link";

const designedForOrganizations = [
  {
    icon: ClipboardList,
    title: "CSR Teams",
    description:
      "Looking for a structured, outcome-based program that satisfies reporting requirements without defaulting to one-off awareness events.",
  },
  {
    icon: Building2,
    title: "Companies",
    description:
      "Building genuinely inclusive workplace wellness benefits for employees with disabilities, chronic conditions, or mobility limitations.",
  },
  {
    icon: HeartHandshake,
    title: "NGOs & Foundations",
    description:
      "Running disability-focused programs that want a strength and confidence component delivered by a credentialed, adaptive-training specialist.",
  },
];

const designedForOutcomes = [
  {
    icon: Sparkles,
    title: "Structured Program Design",
    description:
      "A defined curriculum with clear phases, timelines, and coaching touchpoints — not an unstructured series of sessions.",
  },
  {
    icon: LineChart,
    title: "Human Impact Tracking",
    description:
      "Individual and cohort-level data on strength, consistency, and confidence, collected systematically from day one.",
  },
  {
    icon: ShieldCheck,
    title: "Premium Brand Experience",
    description:
      "Delivery quality, communication, and presentation that reflect well on your organization's name, not a bare-bones volunteer effort.",
  },
];

const deliverables = [
  "A founder-led relationship — every partnership is designed and overseen directly by Aditya Mandan, a national-level para powerlifter and adaptive training specialist.",
  "A structured curriculum built around the physical realities of your participants, not a generic fitness template adapted at the last minute.",
  "Coaches trained specifically in adaptive strength methodology for wheelchair users and people managing chronic health conditions.",
  "Clear onboarding, safety screening, and readiness assessment for every participant before training begins.",
  "Ongoing check-ins, video-based form feedback, and progress reviews built into the program structure.",
  "Documentation your team can use internally and externally — case summaries, participant outcomes, and program reporting.",
];

const corporateImpact = [
  {
    title: "For Employees",
    description:
      "Employees with disabilities or chronic conditions get access to coaching designed for their actual physical context — something most corporate wellness benefits don't offer.",
  },
  {
    title: "For CSR Reporting",
    description:
      "Program participation, milestones, and outcomes are tracked in a form your team can reference in ESG disclosures, CSR reports, or foundation updates.",
  },
  {
    title: "For Brand Perception",
    description:
      "A visible, well-run partnership signals genuine commitment to disability inclusion — distinct from a single-day awareness event or a logo on a poster.",
  },
  {
    title: "For Internal Culture",
    description:
      "Founder-led workshops and sessions give teams direct exposure to adaptive strength training, building understanding that extends beyond the program itself.",
  },
];

const programOutcomes = [
  "Participants complete a structured strength program with documented starting point and progress",
  "Measurable gains in functional strength, training consistency, and self-reported confidence",
  "A cohort-level summary your organization can use for internal reporting or public communication",
  "A repeatable model that can scale to additional locations, departments, or partner NGOs in future cycles",
  "A working relationship with a specialist coach who understands your participants, not a rotating pool of generalists",
];

const programFormats = [
  {
    icon: Briefcase,
    title: "Sponsored Coaching Access",
    description:
      "Your organization funds individual coaching slots for employees or program beneficiaries, who then go through STRENTOR's standard 1:1 or group coaching tracks.",
  },
  {
    icon: Users,
    title: "Corporate Wellness Sessions",
    description:
      "Recurring group sessions for employees, run on-site or online, focused on adaptive strength fundamentals and inclusive movement practices.",
  },
  {
    icon: HeartHandshake,
    title: "CSR Transformation Cohorts",
    description:
      "A defined cohort of participants — typically 10 to 30 people — goes through a multi-week transformation program with shared start and end dates, suited to annual CSR cycles.",
  },
  {
    icon: Building2,
    title: "NGO or Foundation Programs",
    description:
      "STRENTOR partners directly with your existing beneficiary network, layering adaptive strength coaching onto programs you already run.",
  },
  {
    icon: Presentation,
    title: "Founder-Led Workshops",
    description:
      "In-person or virtual sessions with Aditya Mandan on adaptive training, resilience, and disability-inclusive fitness — for all-hands events, leadership offsites, or awareness weeks.",
  },
  {
    icon: UserCheck,
    title: "Readiness Assessments",
    description:
      "A structured intake process for every participant, covering training readiness, safety signals, and mobility context before any program begins.",
  },
  {
    icon: BarChart3,
    title: "Participant Tracking",
    description:
      "Ongoing logging of attendance, effort, and progress markers for each participant, consolidated into a format your team can review.",
  },
  {
    icon: FileText,
    title: "Outcome Summaries",
    description:
      "End-of-cycle reports summarizing individual and cohort outcomes, suitable for internal review, CSR documentation, or stakeholder updates.",
  },
];

const measurementPoints = [
  {
    title: "Baseline Assessment",
    description:
      "Every participant starts with a documented readiness and capability baseline — training history, mobility context, and initial goals.",
  },
  {
    title: "Ongoing Session Data",
    description:
      "Attendance, effort levels, and exercise progression are logged per session, giving a running record rather than a single end-point snapshot.",
  },
  {
    title: "Milestone Reviews",
    description:
      "At defined intervals (typically every 2-4 weeks), coaches conduct structured progress reviews against each participant's baseline.",
  },
  {
    title: "Cohort Reporting",
    description:
      "For CSR cohorts, individual data is aggregated into a program-level report — completion rates, strength gains, consistency metrics, and qualitative feedback.",
  },
  {
    title: "Final Summary",
    description:
      "A closing report at the end of each cycle, formatted for internal circulation or inclusion in your organization's CSR or ESG documentation.",
  },
];

const partnershipProcess = [
  {
    step: "01",
    title: "Initial Conversation",
    description:
      "A call to understand your organization's goals — employee wellness, CSR mandate, NGO partnership, or brand initiative — and whether STRENTOR is the right fit.",
  },
  {
    step: "02",
    title: "Needs Assessment",
    description:
      "We review your participant population, timeline, budget, and reporting requirements to scope a program format that actually fits.",
  },
  {
    step: "03",
    title: "Program Design",
    description:
      "STRENTOR builds a specific curriculum, timeline, and measurement plan for your partnership, reviewed and approved before anything launches.",
  },
  {
    step: "04",
    title: "Pilot",
    description:
      "Most partnerships start with a smaller pilot cohort or session series — enough to validate delivery quality and participant fit before scaling.",
  },
  {
    step: "05",
    title: "Measurement & Reporting",
    description:
      "Once live, participant data is tracked continuously, with milestone reviews and a structured report delivered at the end of the pilot.",
  },
  {
    step: "06",
    title: "Renewal & Scale",
    description:
      "Based on pilot outcomes, we scope the next cycle — expanding cohort size, extending duration, or adding new formats like workshops or on-site sessions.",
  },
];

const faqs = [
  {
    question: "What size of organization or budget does STRENTOR work with?",
    answer:
      "Partnerships range from single-department wellness sessions to multi-location CSR cohorts. We scope every engagement to your actual budget and participant count during the needs assessment call — there's no fixed minimum program size.",
  },
  {
    question: "Can this be delivered on-site, or is it online only?",
    answer:
      "Both. Founder-led workshops and select wellness sessions can be delivered on-site depending on location and scheduling. Ongoing coaching — the core of most CSR cohorts and sponsored access programs — is delivered online with structured video feedback and check-ins, which keeps delivery consistent regardless of participant location.",
  },
  {
    question: "How is this different from a one-day disability awareness event?",
    answer:
      "An awareness event creates a moment. A STRENTOR partnership creates a program — participants go through structured coaching over weeks, with tracked outcomes at the end. It's designed to produce measurable participant results, not just visibility for a single day.",
  },
  {
    question: "What does STRENTOR need from our organization to get started?",
    answer:
      "A point of contact, a rough sense of your participant population and timeline, and clarity on your reporting requirements. We handle program design, coaching delivery, and outcome tracking from there.",
  },
  {
    question: "Can the program be co-branded or reported under our organization's name?",
    answer:
      "Yes. Program materials, workshops, and reporting can be adapted to reflect your organization's branding and CSR narrative, developed together during the program design phase.",
  },
];

export default function CorporatePage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

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
            Corporate & CSR Partnerships
          </span>
          <h1 className="mt-4 text-4xl font-bold font-display text-white sm:text-5xl md:text-6xl">
            Adaptive strength programs for{" "}
            <span className="text-[#C9A96A]">inclusive workplaces and communities</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
            STRENTOR helps organizations move beyond awareness activities and build practical,
            dignity-first transformation programs — focused on strength, confidence, discipline,
            resilience, participation, and measurable human impact.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="w-full rounded-full bg-[#C9A96A] hover:bg-[#C9A96A]/90 sm:w-auto" asChild>
              <Link href="/contact?type=corporate">
                Discuss Corporate Program
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full rounded-full border-[#C9A96A]/40 text-white hover:bg-white/5 hover:text-white sm:w-auto"
              asChild
            >
              <Link href="/coaching">View Coaching</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* What the partnership creates */}
      <section className="container mx-auto max-w-3xl px-4 py-16 text-center">
        <h2 className="text-3xl font-bold font-display text-foreground sm:text-4xl">
          What the Partnership Creates
        </h2>
        <div className="mt-6 space-y-4 text-left text-lg font-medium text-muted-foreground">
          <p>
            Most corporate disability initiatives stop at awareness — a workshop, a poster
            campaign, a single event marking a day on the calendar. STRENTOR partnerships are
            built differently: they produce an actual, trackable transformation program for real
            participants, run by a coach who understands adaptive training from the inside.
          </p>
          <p>
            Every partnership is anchored by Aditya Mandan, a national-level para powerlifter and
            the founder of STRENTOR, who designs and oversees the program personally. That means
            your organization isn&apos;t buying a generic wellness vendor package — you&apos;re
            partnering with a specialist whose own training and coaching methodology were built
            around the exact population your program is meant to serve.
          </p>
          <p>
            The result is a program that gives participants something concrete — structured
            coaching, measurable progress, and a genuine sense of capability — while giving your
            organization something it can point to with confidence in a CSR report, a board
            update, or an internal comms piece.
          </p>
          <p>
            STRENTOR is deliberately not positioned as a charity initiative or an inspirational
            campaign. Participants are treated as athletes working toward specific, trackable
            goals — strength benchmarks, training consistency, functional independence — and the
            program is run with the same rigor and structure as any premium coaching engagement.
          </p>
        </div>
      </section>

      {/* Designed for - two balanced columns */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center text-3xl font-bold font-display text-foreground sm:text-4xl">
            Designed For
          </h2>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            {/* Left column: who it's for */}
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-[#C9A96A]">
                Who We Partner With
              </h3>
              <div className="space-y-4">
                {designedForOrganizations.map((item) => (
                  <div
                    key={item.title}
                    className="flex gap-4 rounded-xl border border-border bg-card p-6 shadow-sm"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A96A]">
                      <item.icon className="h-5 w-5 text-strentor-black" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-card-foreground">{item.title}</h4>
                      <p className="mt-1 text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column: what it delivers */}
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-[#C9A96A]">
                What Every Partnership Includes
              </h3>
              <div className="space-y-4">
                {designedForOutcomes.map((item) => (
                  <div
                    key={item.title}
                    className="flex gap-4 rounded-xl border border-border bg-card p-6 shadow-sm"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A96A]">
                      <item.icon className="h-5 w-5 text-strentor-black" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-card-foreground">{item.title}</h4>
                      <p className="mt-1 text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What STRENTOR delivers */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-4 text-center text-3xl font-bold font-display text-foreground sm:text-4xl">
          What STRENTOR Delivers
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-center text-muted-foreground">
          A partnership is not a one-off vendor engagement — it is a working relationship with a
          coach and a system built to serve your participants for the full length of the program.
        </p>
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
          {deliverables.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A96A]">
                <Check className="h-3.5 w-3.5 text-strentor-black" />
              </div>
              <span className="text-sm font-medium text-card-foreground">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Corporate impact */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-center text-3xl font-bold font-display text-foreground sm:text-4xl">
            Corporate Impact
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-muted-foreground">
            A well-run partnership creates value on more than one level — for the individuals in
            the program, for the organization funding it, and for the culture around it.
          </p>
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
            {corporateImpact.map((item) => (
              <div key={item.title} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-bold text-card-foreground">{item.title}</h3>
                <p className="mt-2 text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program outcomes */}
      <section className="container mx-auto max-w-3xl px-4 py-16">
        <h2 className="mb-4 text-center text-3xl font-bold font-display text-foreground sm:text-4xl">
          Program Outcomes
        </h2>
        <p className="mb-8 text-center text-muted-foreground">
          Every cycle is designed to end with outcomes your organization can point to, not just
          activity your organization can describe.
        </p>
        <div className="space-y-4">
          {programOutcomes.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A96A]">
                <Check className="h-3.5 w-3.5 text-strentor-black" />
              </div>
              <span className="font-medium text-muted-foreground">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Program formats */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-center text-3xl font-bold font-display text-foreground sm:text-4xl">
            Program Formats
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-muted-foreground">
            Partnerships are built modularly — most organizations combine two or three of these
            formats into a single program.
          </p>
          <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {programFormats.map((format) => (
              <div
                key={format.title}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A96A]">
                  <format.icon className="h-5 w-5 text-strentor-black" />
                </div>
                <h3 className="text-base font-bold text-card-foreground">{format.title}</h3>
                <p className="text-sm text-muted-foreground">{format.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Measurement and reporting */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-4 text-center text-3xl font-bold font-display text-foreground sm:text-4xl">
          Measurement & Reporting
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-center text-muted-foreground">
          Every partnership is tracked from the first session to the final report — not measured
          only by attendance, but by documented individual and cohort-level progress.
        </p>
        <div className="mx-auto max-w-3xl space-y-4">
          {measurementPoints.map((point, index) => (
            <div key={point.title} className="flex gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A96A]/10 text-sm font-bold text-[#C9A96A]">
                {index + 1}
              </span>
              <div>
                <h3 className="font-bold text-card-foreground">{point.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{point.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Partnership process */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center text-3xl font-bold font-display text-foreground sm:text-4xl">
            Partnership Process
          </h2>
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {partnershipProcess.map((item) => (
              <div key={item.step} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <span className="text-3xl font-bold font-display text-[#C9A96A]/40">
                  {item.step}
                </span>
                <h3 className="mt-2 text-lg font-bold text-card-foreground">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
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

      {/* Final CTA */}
      <section className="relative bg-black py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-black to-black" />
        <div className="container relative mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-display text-white sm:text-4xl">
            Ready to build a program that creates{" "}
            <span className="text-[#C9A96A]">real, measurable impact?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-300">
            Tell us about your organization and goals — we&apos;ll scope a partnership that fits
            your participants, timeline, and reporting needs.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="w-full rounded-full bg-[#C9A96A] hover:bg-[#C9A96A]/90 sm:w-auto" asChild>
              <Link href="/contact?type=corporate">
                Discuss Corporate Program
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full rounded-full border-[#C9A96A]/40 text-white hover:bg-white/5 hover:text-white sm:w-auto"
              asChild
            >
              <Link href="/coaching">View Coaching</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
