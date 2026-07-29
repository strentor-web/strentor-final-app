"use client"

import Link from "next/link"
import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollReveal } from "@/components/motion/ScrollReveal"

const faqs = [
  {
    question: "Is STRENTOR physiotherapy or rehabilitation?",
    answer:
      "No. STRENTOR is fitness and performance coaching — not medical treatment, not physiotherapy, and not a substitute for care from a doctor, physiotherapist, or dietitian. Coaching is designed to work alongside your existing medical care, not in place of it.",
  },
  {
    question: "Who is STRENTOR designed for?",
    answer:
      "Ambitious wheelchair users focused on building strength, confidence, identity, and direction. STRENTOR doesn't define clients primarily by diagnosis; it's built for people who want structured progress and are willing to be coached, tracked, and held accountable.",
  },
  {
    question: "Do I need gym equipment?",
    answer:
      "It depends on your plan and goals. Many clients start with minimal equipment — resistance bands, light dumbbells, or bodyweight work adapted to a seated position. What you actually have access to is confirmed during your assessment, not assumed upfront.",
  },
  {
    question: "Can I train from home?",
    answer:
      "Yes. Coaching is delivered virtually — video-guided sessions, direct form feedback, and structured check-ins — so training fits into your existing space and schedule.",
  },
  {
    question: "Is coaching available outside India?",
    answer:
      "Yes. STRENTOR coaches clients across India, the UAE, Singapore, and selected international markets, with pricing and scheduling adapted to your region.",
  },
  {
    question: "How personalized is the program?",
    answer:
      "Every coaching plan is built around your current strength and movement capacity, the wheelchair and equipment you use, your training environment, daily routine, ambitions, and relevant health guidance — not a standing-body template with exercises swapped out.",
  },
  {
    question: "How are health considerations handled?",
    answer:
      "Your health context is discussed directly during your assessment, and programming is built around it. Where a condition requires medical clearance or ongoing monitoring, that stays with your treating doctor — coaching is designed to work alongside it, not replace it.",
  },
  {
    question: "Does STRENTOR provide medical or psychological treatment?",
    answer:
      "No. STRENTOR does not diagnose, treat, cure, or prevent any medical or psychological condition. Mental and emotional coaching support performance, consistency, and confidence, and are not a substitute for licensed mental-health treatment.",
  },
  {
    question: "What commitment is expected?",
    answer:
      "Consistent participation. STRENTOR is built for clients willing to follow a structured plan, track progress, and be coached and held accountable — meaningful transformation depends on consistency, not a single session.",
  },
  {
    question: "How does the application process work?",
    answer:
      "You complete the Performance Assessment, STRENTOR reviews your goals, readiness, and coaching fit, qualified applicants are invited to a discovery conversation, the right coaching pathway is recommended, and onboarding with a baseline assessment begins from there.",
  },
  {
    question: "Can a family member participate in the initial conversation?",
    answer:
      "Yes. Family members or caregivers are welcome to join the discovery conversation, which is especially common when a family member is helping evaluate or fund coaching for an adult wheelchair user.",
  },
  {
    question: "Are results guaranteed?",
    answer:
      "No. Individual outcomes vary and depend on participation, starting condition, available equipment, medical considerations, and other personal factors. STRENTOR does not guarantee weight loss, strength gains, medical improvement, independence, or the cure or reversal of any condition.",
  },
  {
    question: "How is personal and health-related information protected?",
    answer:
      "Information you share is used only to evaluate your application and build your coaching plan. See the Privacy Policy for full detail on what's collected and how it's handled.",
  },
]

export default function FAQPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
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
            FAQ
          </span>
          <h1 className="mt-4 text-4xl font-bold font-display text-white sm:text-5xl md:text-6xl">
            Questions, <span className="text-[#C9A96A]">answered honestly</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
            The questions people actually ask before applying — no vague
            answers, no medical claims.
          </p>
        </div>
      </div>

      {/* FAQ list */}
      <section className="container mx-auto px-4 py-16 md:py-24">
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
        <ScrollReveal className="container relative mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-display text-white sm:text-4xl">
            Still have questions?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-300">
            Take the Performance Assessment, or reach out directly.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild className="h-14 rounded-full bg-[#C9A96A] px-8 hover:bg-[#C9A96A]/90">
              <Link href="/apply-for-access">Take the Performance Assessment</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-14 rounded-full border-[#C9A96A]/40 text-white hover:bg-white/10"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  )
}
