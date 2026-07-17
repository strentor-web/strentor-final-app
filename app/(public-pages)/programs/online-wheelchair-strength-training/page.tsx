"use client"

import { NicheProgramPage } from "@/components/programs/niche/NicheProgramPage"

export default function OnlineWheelchairStrengthTrainingPage() {
  return (
    <NicheProgramPage
      eyebrow="100% online coaching"
      contactPlan="online-wheelchair-strength-training"
      title="Online Strength Training"
      titleAccent="for Wheelchair Users"
      subtitle="Seated strength training, progression tracking, and coach check-ins — all delivered online, so you can train consistently without needing an accessible gym nearby."
      intro={{
        heading: "Strength training that doesn't depend on finding the right gym",
        paragraphs: [
          "Finding a gym with the right equipment, accessible layout, and a trainer who understands adaptive training is hard. STRENTOR removes that barrier entirely by coaching seated and adaptive strength training online, from wherever you already are.",
          "Your coach designs a progressive strength program around the equipment you have access to, reviews your form through video check-ins, and adjusts the plan as you get stronger — the same structure a good in-person coach would provide, without the accessibility constraints of a physical gym.",
          "This is strength training specifically, with nutrition guidance built in to support recovery and progress.",
        ],
      }}
      benefits={[
        {
          title: "Progressive seated strength programs",
          description: "Structured strength training that builds over time, not a static routine.",
        },
        {
          title: "Video form check-ins",
          description: "Regular check-ins to review technique and adjust your program safely.",
        },
        {
          title: "No gym required",
          description: "Train with whatever equipment you have — home, hospital gym, or elsewhere.",
        },
        {
          title: "Nutrition support included",
          description: "Guidance to support recovery and strength gains alongside training.",
        },
      ]}
      faqs={[
        {
          question: "What equipment do I need for online wheelchair strength training?",
          answer: "Programs are built around whatever equipment you already have access to, from resistance bands to a full home setup. Your coach will work with what's available and suggest additions only if useful.",
        },
        {
          question: "How does coaching work if it's fully online?",
          answer: "You'll receive a structured program, submit video check-ins for form review, and have regular check-ins with your coach to adjust the plan as you progress.",
        },
        {
          question: "Is online strength training safe for wheelchair users?",
          answer: "Programs are adapted to your ability level and reviewed by your coach through video check-ins. That said, this is fitness coaching, not medical supervision — please consult your physician before starting, especially with an existing health condition.",
        },
        {
          question: "Who is this program for?",
          answer: "Wheelchair users looking to build strength consistently, whether starting from scratch or progressing an existing routine, without needing an accessible gym nearby.",
        },
      ]}
      disclaimer="STRENTOR provides fitness and nutrition coaching, not medical supervision. Please consult your physician before beginning any new strength training program, especially if you have an existing health condition."
      relatedLinks={[
        { label: "Wheelchair Fitness Coaching in India", href: "/programs/wheelchair-fitness-coaching-india" },
        { label: "Spina Bifida Fitness Coaching", href: "/programs/spina-bifida-fitness-coaching" },
        { label: "CKD-Aware Strength Coaching", href: "/programs/ckd-aware-strength-coaching" },
        { label: "Full Transformation Program", href: "/programs/fitness-training" },
      ]}
    />
  )
}
