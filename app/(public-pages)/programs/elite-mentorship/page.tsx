"use client"

import { NicheProgramPage } from "@/components/programs/niche/NicheProgramPage"

export default function EliteMentorshipPage() {
  return (
    <NicheProgramPage
      eyebrow="STRENTOR's premium mentorship"
      contactPlan="elite-mentorship"
      title="Elite Adaptive"
      titleAccent="Transformation Mentorship"
      subtitle="A 12-week, high-touch mentorship for wheelchair users who want intensive, deeply personalized transformation — with direct founder access and priority support."
      priceRange="₹99,999–₹2,49,999"
      intro={{
        heading: "For clients who want everything, personalized",
        paragraphs: [
          "Elite Mentorship includes everything in the flagship program, plus deeper assessment, more frequent one-to-one sessions, higher-frequency video review, advanced mindset coaching, and detailed nutrition feedback.",
          "You get direct access to Aditya, priority messaging, and — where authorized — coordination with your clinicians, so your training plan stays aligned with your full health picture.",
          "This is a bespoke engagement, not a template. Final scope and pricing are confirmed together on your discovery call, based on your goals, health complexity, and the level of personalization you need.",
        ],
      }}
      benefits={[
        {
          title: "Direct founder access",
          description: "Work directly with Aditya, a national-level para powerlifter with lived experience of adaptive training.",
        },
        {
          title: "Higher-frequency coaching & review",
          description: "More one-to-one sessions and more frequent video review than the flagship program.",
        },
        {
          title: "Clinician coordination",
          description: "With your authorization, we coordinate with your physiotherapist or physician to keep your plan aligned with your care.",
        },
        {
          title: "Long-term maintenance roadmap",
          description: "A plan for what comes after the 12 weeks, so your progress compounds instead of resetting.",
        },
      ]}
      faqs={[
        {
          question: "Who is Elite Mentorship for?",
          answer: "Clients who want an intensive, highly personalized transformation, have more complex health or mobility considerations, and want direct founder access and priority support.",
        },
        {
          question: "How is pricing determined?",
          answer: "Elite Mentorship is priced based on your specific goals, health complexity, and the level of personalization required. We'll confirm exact scope and pricing together on your discovery call.",
        },
        {
          question: "Can my physiotherapist or doctor be involved?",
          answer: "With your explicit authorization, we can coordinate with your treating clinicians to keep your training aligned with your broader care plan.",
        },
        {
          question: "Is this a substitute for physiotherapy or medical care?",
          answer: "No. STRENTOR provides fitness and nutrition coaching, not medical treatment. It's designed to complement — not replace — guidance from your physician or physiotherapist.",
        },
      ]}
      disclaimer="STRENTOR provides fitness and nutrition coaching, not medical treatment or physiotherapy. Please consult your physician before beginning any new exercise program, especially if you have an existing health condition."
      relatedLinks={[
        { label: "8-Week Flagship Transformation", href: "/programs/flagship-transformation" },
        { label: "7-Day Starter Kit", href: "/programs/starter-kit" },
        { label: "Membership", href: "/programs/membership" },
        { label: "Wheelchair Fitness Coaching in India", href: "/programs/wheelchair-fitness-coaching-india" },
      ]}
    />
  )
}
