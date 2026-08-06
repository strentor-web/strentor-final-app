"use client";

import {
  Dumbbell,
  Frown,
  HeartCrack,
  ShieldAlert,
  UserX,
  Users,
  CalendarX,
} from "lucide-react";
import { ScrollReveal, StaggerGroup } from "@/components/motion/ScrollReveal";
import { HoverLift } from "@/components/motion/HoverLift";

const GOLD = "#D4AF37";

const PAIN_POINTS = [
  {
    icon: Dumbbell,
    title: "Lack of Strength",
    body: "Generic programs that never account for your actual range of motion or ability.",
  },
  {
    icon: HeartCrack,
    title: "Shoulder Pain",
    body: "Years of manual wheeling and transfers, with no plan built to protect your joints.",
  },
  {
    icon: Frown,
    title: "Poor Confidence",
    body: "Feeling unsure in a gym that was never designed with you in mind.",
  },
  {
    icon: UserX,
    title: "Isolation",
    body: "Training alone, without a community that understands what you're working with.",
  },
  {
    icon: Users,
    title: "No Adaptive Trainers",
    body: "Coaches who mean well but don't know how to program around your body.",
  },
  {
    icon: ShieldAlert,
    title: "Fear of Injury",
    body: "Holding back because no one's shown you what's actually safe to push.",
  },
  {
    icon: CalendarX,
    title: "Lack of Accountability",
    body: "Starting and stopping, with nobody tracking whether you're actually progressing.",
  },
];

export function PainPoints() {
  return (
    <section className="relative bg-black px-6 py-24 md:px-12 lg:px-20 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <p
            className="mb-4 text-sm font-medium tracking-[0.3em]"
            style={{ color: GOLD }}
          >
            THE PROBLEM
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h2 className="mb-16 max-w-2xl text-4xl font-normal leading-tight text-[#FAFAFA] md:text-5xl lg:text-6xl">
            Tired of Being Told What You Can&apos;t Do?
          </h2>
        </ScrollReveal>

        <StaggerGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PAIN_POINTS.map((point) => {
            const Icon = point.icon;
            return (
              <ScrollReveal key={point.title} className="h-full">
                <HoverLift className="h-full rounded-2xl" scale={1.015} lift={3}>
                  <div className="liquid-glass flex h-full flex-col gap-4 rounded-2xl p-7">
                    <Icon className="h-7 w-7" style={{ color: GOLD }} strokeWidth={1.5} />
                    <h3 className="text-lg font-medium text-[#FAFAFA]">{point.title}</h3>
                    <p className="text-sm leading-relaxed text-[#B8B8B8]">{point.body}</p>
                  </div>
                </HoverLift>
              </ScrollReveal>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}

export default PainPoints;
