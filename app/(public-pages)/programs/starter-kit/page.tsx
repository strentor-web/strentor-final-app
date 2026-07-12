"use client";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ShieldAlert, Check } from "lucide-react";
import { StarterKitCheckoutButton } from "@/components/programs/starter-kit/StarterKitCheckoutButton";

const inclusions = [
  "Welcome & orientation",
  "Safety disclaimer and readiness assessment",
  "Goal-setting worksheet",
  "7-day adaptive exercise plan",
  "Exercise video demonstrations",
  "Basic nutrition & hydration guidance",
  "Daily pain, fatigue, energy and mood tracking",
  "Habit checklist",
  "Exercise video submission with basic form feedback",
  "End-of-program progress review",
  "Invitation to a discovery call for your next step",
];

const faqs = [
  {
    question: "Who is the Starter Kit for?",
    answer:
      "Wheelchair users who want a safe, structured first experience of adaptive strength training before committing to a longer coaching program. It's the lowest-friction way to see how STRENTOR coaches, without a large upfront commitment.",
  },
  {
    question: "What happens after the 7 days?",
    answer:
      "You'll get an end-of-program progress review and an invitation to a discovery call, where we'll recommend the right next step for you — whether that's self-paced coaching, the 8-week flagship program, or something else entirely.",
  },
  {
    question: "Do I need any equipment?",
    answer:
      "No. The 7-day plan is designed to work with minimal or no equipment, so you can start immediately regardless of what you currently have access to.",
  },
  {
    question: "Is this a substitute for physiotherapy or medical care?",
    answer:
      "No. STRENTOR provides fitness and nutrition coaching, not medical treatment. It's designed to complement — not replace — guidance from your physician or physiotherapist.",
  },
];

export default function StarterKitPage() {
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
            Your first step, low-risk and low-commitment
          </span>
          <h1 className="mt-4 text-4xl font-bold font-display text-white sm:text-5xl md:text-6xl">
            7-Day Wheelchair <span className="text-[#C9A96A]">Strength Starter Kit</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
            A safe, structured introduction to adaptive strength training — built around your
            body, tracked daily, and reviewed by a coach. See what STRENTOR coaching feels like
            before committing to a full program.
          </p>
          <div className="mt-8 flex justify-center">
            <StarterKitCheckoutButton />
          </div>
        </div>
      </div>

      {/* What's included */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold font-display text-foreground sm:text-4xl">
            What&apos;s Included
          </h2>
          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
            {inclusions.map((item, index) => (
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
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold font-display text-foreground sm:text-4xl">
          One price. Everything above included.
        </h2>
        <div className="mx-auto mt-8 max-w-sm rounded-2xl border border-[#C9A96A]/30 bg-card p-8 shadow-lg">
          <p className="text-5xl font-bold text-[#C9A96A]">₹1,999</p>
          <p className="mt-2 text-sm text-muted-foreground">One-time purchase, 7 days</p>
          <div className="mt-6">
            <StarterKitCheckoutButton className="w-full h-12 rounded-full bg-[#C9A96A] text-base font-bold text-primary-foreground hover:bg-[#C9A96A]/90" />
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="container mx-auto px-4 py-10">
        <div className="mx-auto flex max-w-3xl gap-4 rounded-xl border border-[#C9A96A]/30 bg-[#C9A96A]/5 p-6">
          <ShieldAlert className="h-6 w-6 flex-shrink-0 text-[#C9A96A]" />
          <p className="text-sm text-muted-foreground">
            STRENTOR provides fitness and nutrition coaching, not medical treatment or
            physiotherapy. Please consult your physician before beginning any new exercise
            program, especially if you have an existing health condition.
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

      <Footer />
    </div>
  );
}
