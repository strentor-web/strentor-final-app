import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

const GOLD = "#D4AF37";

// Curated subset of the real 13 questions on /faq — same data, not a
// duplicate FAQ system. Chosen for credibility/scope/accessibility, the
// questions a first-time visitor is most likely to have.
const FAQS = [
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
    question: "How does the application process work?",
    answer:
      "You complete the Performance Assessment, STRENTOR reviews your goals, readiness, and coaching fit, qualified applicants are invited to a discovery conversation, the right coaching pathway is recommended, and onboarding with a baseline assessment begins from there.",
  },
  {
    question: "Are results guaranteed?",
    answer:
      "No. Individual outcomes vary and depend on participation, starting condition, available equipment, medical considerations, and other personal factors. STRENTOR does not guarantee weight loss, strength gains, medical improvement, independence, or the cure or reversal of any condition.",
  },
];

export function FaqPreview() {
  return (
    <section className="relative bg-black px-6 py-24 md:px-12 lg:px-20 lg:py-32">
      <div className="mx-auto max-w-3xl">
        <ScrollReveal>
          <p className="mb-4 text-sm font-medium tracking-[0.3em]" style={{ color: GOLD }}>
            FAQ
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h2 className="mb-12 text-4xl font-normal leading-tight text-[#FAFAFA] md:text-5xl">
            Questions, Answered Honestly
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <Accordion type="single" collapsible className="border-t border-white/10">
            {FAQS.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question} className="border-white/10">
                <AccordionTrigger className="text-left text-base font-medium text-[#FAFAFA] hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[#B8B8B8]">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <Link
            href="/faq"
            className="mt-8 inline-block text-sm font-medium"
            style={{ color: GOLD }}
          >
            See all FAQs →
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default FaqPreview;
