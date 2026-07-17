"use client"

import { NicheProgramPage } from "@/components/programs/niche/NicheProgramPage"

export default function FlagshipTransformationPage() {
  return (
    <NicheProgramPage
      eyebrow="STRENTOR's flagship program"
      contactPlan="flagship-transformation"
      title="8-Week Adaptive Strength"
      titleAccent="& Mindset Transformation"
      subtitle="A structured, four-phase transformation for wheelchair users — building strength, nutrition habits, and mindset together, so progress lasts well beyond week eight."
      priceRange="₹39,999–₹74,999"
      intro={{
        heading: "A method, not just a workout plan",
        paragraphs: [
          "The flagship program moves through four deliberate phases: Assess & Stabilise, Build the Foundation, Progress Strength, and Build Independence. Each phase has a clear purpose, so you always know why you're doing what you're doing.",
          "You get personalized workout programming, nutrition guidance, a weekly coaching session, exercise video review, and a progress dashboard — all built around your specific health realities, equipment, and goals, not a generic template.",
          "By the end of eight weeks, the goal isn't just visible strength — it's the confidence and self-monitoring skills to keep progressing on your own.",
        ],
      }}
      benefits={[
        {
          title: "Four-phase structure",
          description: "Assess & Stabilise → Build the Foundation → Progress Strength → Build Independence.",
        },
        {
          title: "Weekly coaching + video review",
          description: "A weekly coaching session and exercise video feedback keep your program accurate and safe.",
        },
        {
          title: "Nutrition guidance included",
          description: "Meal and hydration habits built alongside your training, not as an afterthought.",
        },
        {
          title: "Mindset & resilience work",
          description: "Confidence, consistency, and setback planning are part of the program, not optional extras.",
        },
      ]}
      faqs={[
        {
          question: "How is this different from the Self-Paced program?",
          answer: "The flagship program is a fully personalized, coach-led 8-week journey with weekly live sessions, structured phases, and mindset coaching — built for clients who want a complete guided transformation rather than a self-directed plan.",
        },
        {
          question: "What's included each week?",
          answer: "A weekly coaching session, exercise video review with feedback, nutrition check-in, progress dashboard updates, and messaging support during defined hours.",
        },
        {
          question: "How do I know if I'm ready for this program?",
          answer: "Book a discovery call. We'll assess your current reality, health considerations, and goals together, and recommend the flagship program only if it's genuinely the right fit.",
        },
        {
          question: "Is this a substitute for physiotherapy or medical care?",
          answer: "No. STRENTOR provides fitness and nutrition coaching, not medical treatment. It's designed to complement — not replace — guidance from your physician or physiotherapist.",
        },
      ]}
      disclaimer="STRENTOR provides fitness and nutrition coaching, not medical treatment or physiotherapy. Please consult your physician before beginning any new exercise program, especially if you have an existing health condition."
      relatedLinks={[
        { label: "7-Day Starter Kit", href: "/programs/starter-kit" },
        { label: "Elite Mentorship", href: "/programs/elite-mentorship" },
        { label: "Membership", href: "/programs/membership" },
        { label: "Wheelchair Fitness Coaching in India", href: "/programs/wheelchair-fitness-coaching-india" },
      ]}
    />
  )
}
