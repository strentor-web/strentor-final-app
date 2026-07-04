"use client"

import { NicheProgramPage } from "@/components/programs/niche/NicheProgramPage"

export default function WheelchairFitnessCoachingIndiaPage() {
  return (
    <NicheProgramPage
      eyebrow="Serving clients across India, online"
      title="Wheelchair Fitness Coaching"
      titleAccent="in India"
      subtitle="Adaptive strength training and nutrition coaching for wheelchair users, delivered virtually to any city in India — coached by a national-level para powerlifter."
      intro={{
        heading: "Fitness coaching built around wheelchair use, not around a gym",
        paragraphs: [
          "Most fitness advice assumes a standing body. STRENTOR doesn't. Every program is designed from the ground up for wheelchair users, adapting seated strength training, mobility work, and nutrition guidance to your equipment, your routine, and your goals.",
          "Coaching is led by Aditya Mandan, a national-level para powerlifter, so the programming comes from lived experience with adaptive training — not a generic plan with the standing exercises removed.",
          "Sessions and check-ins happen entirely online, so location isn't a barrier — clients across India train with STRENTOR from home.",
        ],
      }}
      benefits={[
        {
          title: "Seated & adaptive strength training",
          description: "Programs built around wheelchair use from day one, not adapted as an afterthought.",
        },
        {
          title: "Nutrition guidance included",
          description: "Personalized nutrition support alongside your training plan.",
        },
        {
          title: "Fully virtual delivery",
          description: "Train from anywhere in India with online coaching and check-ins.",
        },
        {
          title: "Coached by a para-athlete",
          description: "Programming informed by a national-level para powerlifter's own training experience.",
        },
      ]}
      faqs={[
        {
          question: "Is wheelchair fitness coaching available outside major cities in India?",
          answer: "Yes. Since all coaching is delivered online, location isn't a barrier — clients across India train with STRENTOR from home, regardless of city.",
        },
        {
          question: "Do I need special equipment to start?",
          answer: "Most programs start with minimal equipment and adapt to whatever you already have access to. Your coach will guide you on what, if anything, is worth adding as you progress.",
        },
        {
          question: "Is this coaching a substitute for physiotherapy or medical care?",
          answer: "No. STRENTOR provides fitness and nutrition coaching, not medical treatment. It's designed to complement — not replace — guidance from your physician or physiotherapist.",
        },
        {
          question: "How do I get started?",
          answer: "Book a free consultation to discuss your goals, current activity level, and any health considerations, so your coach can build a plan around you.",
        },
      ]}
      disclaimer="STRENTOR provides fitness and nutrition coaching, not medical treatment or physiotherapy. Please consult your physician before beginning any new exercise program, especially if you have an existing health condition."
      relatedLinks={[
        { label: "Online Wheelchair Strength Training", href: "/programs/online-wheelchair-strength-training" },
        { label: "Spina Bifida Fitness Coaching", href: "/programs/spina-bifida-fitness-coaching" },
        { label: "CKD-Aware Strength Coaching", href: "/programs/ckd-aware-strength-coaching" },
        { label: "Full Transformation Program", href: "/programs/fitness-training" },
      ]}
    />
  )
}
