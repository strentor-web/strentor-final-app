"use client"

import { NicheProgramPage } from "@/components/programs/niche/NicheProgramPage"

export default function SpinaBifidaFitnessCoachingPage() {
  return (
    <NicheProgramPage
      eyebrow="Adaptive coaching, delivered online"
      contactPlan="spina-bifida-fitness-coaching"
      title="Spina Bifida"
      titleAccent="Fitness Coaching"
      subtitle="Personalized, adaptive fitness and nutrition coaching for individuals with spina bifida — built around your ability level, not a generic program."
      intro={{
        heading: "Training that adapts to spina bifida, not around it",
        paragraphs: [
          "Spina bifida affects everyone differently, so STRENTOR doesn't start from a fixed program. Your coach builds a plan around your current mobility, strength, and goals, and adjusts it as you progress.",
          "STRENTOR has worked with clients managing spina bifida to build customized fitness plans that support comfortable movement and participation in the activities they care about, alongside nutrition guidance tailored to their needs.",
          "Coaching is led by Aditya Mandan, a national-level para powerlifter, and delivered entirely online so you can train consistently from home.",
        ],
      }}
      benefits={[
        {
          title: "Programs built around your ability level",
          description: "No fixed routine — your plan adapts to your current mobility and strength.",
        },
        {
          title: "Nutrition guidance included",
          description: "Personalized nutrition support alongside your training plan.",
        },
        {
          title: "Fully virtual delivery",
          description: "Train from home with online coaching and regular check-ins.",
        },
        {
          title: "Experience with adaptive training",
          description: "Coaching informed by direct experience training para-athletes.",
        },
      ]}
      faqs={[
        {
          question: "Can fitness coaching really adapt to spina bifida, which affects everyone differently?",
          answer: "Yes — programs start with an assessment of your current mobility, strength, and goals, and your coach adjusts the plan as you progress rather than following a fixed routine.",
        },
        {
          question: "Is this coaching a replacement for physiotherapy?",
          answer: "No. STRENTOR provides fitness and nutrition coaching, not medical treatment or physiotherapy. It's designed to complement guidance from your physician or physiotherapist, not replace it.",
        },
        {
          question: "Do you work with clients who use mobility aids or wheelchairs?",
          answer: "Yes, coaching is adapted to however you move, whether that includes a wheelchair, mobility aids, or another approach.",
        },
        {
          question: "How do I get started?",
          answer: "Book a free consultation so your coach can understand your current activity level, goals, and any health considerations before building your plan.",
        },
      ]}
      disclaimer="STRENTOR provides fitness and nutrition coaching, not medical treatment or physiotherapy. Please consult your physician before beginning any new exercise program."
      relatedLinks={[
        { label: "Wheelchair Fitness Coaching in India", href: "/programs/wheelchair-fitness-coaching-india" },
        { label: "Online Wheelchair Strength Training", href: "/programs/online-wheelchair-strength-training" },
        { label: "CKD-Aware Strength Coaching", href: "/programs/ckd-aware-strength-coaching" },
        { label: "Full Transformation Program", href: "/programs/fitness-training" },
      ]}
    />
  )
}
