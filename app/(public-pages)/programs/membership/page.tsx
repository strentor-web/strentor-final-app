"use client"

import { NicheProgramPage } from "@/components/programs/niche/NicheProgramPage"

export default function MembershipPage() {
  return (
    <NicheProgramPage
      eyebrow="Ongoing community & continuity"
      contactPlan="membership"
      title="STRENTOR"
      titleAccent="Strength Circle"
      subtitle="A recurring membership for wheelchair users who want ongoing coaching, community and accountability — whether you're just starting out or continuing after a flagship program."
      intro={{
        heading: "Strength doesn't stop at week eight or week twelve",
        paragraphs: [
          "Strength Circle is STRENTOR's membership — monthly group coaching, an adaptive workout library, habit and progress tracking, a form-check clinic, mindset sessions, and nutrition education, all in one recurring plan.",
          "It works as a lower-cost entry point for clients who aren't ready for one-to-one coaching yet, and as a continuation offer for flagship or elite mentorship clients who want to keep the accountability and community going.",
          "Membership is organized into four tiers — Community, Guided, Personalised, and Elite — so you can start where you are and move up as your needs change.",
        ],
      }}
      benefits={[
        {
          title: "Community",
          description: "Education, community and group support — the entry point to Strength Circle.",
        },
        {
          title: "Guided",
          description: "Structured programs, trackers, and group coaching to keep you consistent.",
        },
        {
          title: "Personalised",
          description: "Individual plan review and periodic one-to-one coaching within your membership.",
        },
        {
          title: "Elite",
          description: "High-touch mentorship-level access, for members who want the most support.",
        },
      ]}
      faqs={[
        {
          question: "What's included in every tier?",
          answer: "All tiers include access to the adaptive workout library, habit and progress tracker, community support, and monthly expert sessions. Higher tiers add more live coaching, form-check clinics, and personalization.",
        },
        {
          question: "Can I join Strength Circle without doing the Starter Kit or flagship program first?",
          answer: "Yes. Strength Circle works as a standalone entry point as well as a continuation offer after other STRENTOR programs.",
        },
        {
          question: "Can I move between tiers?",
          answer: "Yes. As your needs, goals, or availability change, you can move up or down between Community, Guided, Personalised, and Elite tiers.",
        },
        {
          question: "Is this a substitute for physiotherapy or medical care?",
          answer: "No. STRENTOR provides fitness and nutrition coaching, not medical treatment. It's designed to complement — not replace — guidance from your physician or physiotherapist.",
        },
      ]}
      disclaimer="STRENTOR provides fitness and nutrition coaching, not medical treatment or physiotherapy. Please consult your physician before beginning any new exercise program, especially if you have an existing health condition."
      relatedLinks={[
        { label: "7-Day Starter Kit", href: "/programs/starter-kit" },
        { label: "8-Week Flagship Transformation", href: "/programs/flagship-transformation" },
        { label: "STRENTOR AI Coaching", href: "/programs/ai-coaching" },
        { label: "Elite Mentorship", href: "/programs/elite-mentorship" },
        { label: "Wheelchair Fitness Coaching in India", href: "/programs/wheelchair-fitness-coaching-india" },
      ]}
    />
  )
}
