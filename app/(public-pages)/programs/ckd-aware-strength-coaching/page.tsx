"use client"

import { NicheProgramPage } from "@/components/programs/niche/NicheProgramPage"

export default function CkdAwareStrengthCoachingPage() {
  return (
    <NicheProgramPage
      eyebrow="Coordinated with your medical care"
      contactPlan="ckd-aware-strength-coaching"
      title="CKD-Aware"
      titleAccent="Strength Coaching"
      subtitle="Safe, adaptive strength training coaching for individuals managing chronic kidney disease (CKD) — designed to work alongside your medical team, not around them."
      intro={{
        heading: "Staying active with CKD, coordinated with your care team",
        paragraphs: [
          "Chronic kidney disease changes what safe exercise looks like — energy levels, fluid and dietary restrictions, and dialysis schedules all matter. STRENTOR's role is to provide general fitness coaching that respects those realities, built in coordination with guidance from your nephrologist or care team, not in place of it.",
          "Your coach builds a strength training plan around your current energy levels and physical ability, and adjusts pacing as needed on dialysis or low-energy days.",
          "General nutrition guidance is offered to support your training, but any kidney-specific dietary restrictions (protein, potassium, phosphorus, or fluid limits) should always come from your nephrologist or renal dietitian — STRENTOR coaching works around those limits, not instead of them.",
        ],
      }}
      benefits={[
        {
          title: "Training paced to your energy levels",
          description: "Programs adjust around dialysis schedules and low-energy days.",
        },
        {
          title: "Built to complement medical care",
          description: "Coaching designed to work alongside your nephrologist or care team's guidance.",
        },
        {
          title: "Fully virtual delivery",
          description: "Train from home with online coaching and regular check-ins.",
        },
        {
          title: "Experience with adaptive training",
          description: "Coaching informed by direct experience training clients managing chronic health conditions.",
        },
      ]}
      faqs={[
        {
          question: "Is strength training safe for someone with CKD?",
          answer: "General exercise is often encouraged for CKD patients, but the right intensity and type depends on your individual condition and stage. Please get clearance from your nephrologist before starting, and share their guidance with your coach so the program can respect it.",
        },
        {
          question: "Do you provide kidney-specific meal plans?",
          answer: "No. STRENTOR offers general nutrition guidance to support your training, but kidney-specific dietary limits (protein, potassium, phosphorus, or fluid intake) must come from your nephrologist or a renal dietitian. Your coach works within those limits, not instead of them.",
        },
        {
          question: "Can training be adjusted around dialysis days?",
          answer: "Yes — your coach paces the program around your energy levels, including lighter or rest days around dialysis sessions.",
        },
        {
          question: "How do I get started?",
          answer: "Book a free consultation and bring any relevant guidance from your care team, so your coach can build a plan that fits within it from day one.",
        },
      ]}
      disclaimer="STRENTOR provides general fitness and nutrition coaching only. It is not medical treatment, nephrology care, or renal dietary therapy. Please get clearance from your nephrologist or care team before starting any exercise program, and follow their guidance on diet, fluid intake, and activity limits."
      relatedLinks={[
        { label: "Wheelchair Fitness Coaching in India", href: "/programs/wheelchair-fitness-coaching-india" },
        { label: "Online Wheelchair Strength Training", href: "/programs/online-wheelchair-strength-training" },
        { label: "Spina Bifida Fitness Coaching", href: "/programs/spina-bifida-fitness-coaching" },
        { label: "Full Transformation Program", href: "/programs/fitness-training" },
      ]}
    />
  )
}
