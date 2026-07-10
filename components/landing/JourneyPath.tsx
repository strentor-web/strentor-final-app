"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Phone, ClipboardList, Dumbbell, CalendarCheck, Users } from "lucide-react";
import type { JourneyStage } from "./JourneyPathScene";

const stages: JourneyStage[] = [
  {
    icon: Phone,
    title: "Discovery Call",
    description:
      'A free call to understand your goals, your body, and what "stronger" means for you.',
  },
  {
    icon: ClipboardList,
    title: "Week 1: Deep-Dive Assessment",
    description:
      "A 1:1 kickstart session to map an adaptive blueprint built around your condition, not a generic program.",
  },
  {
    icon: Dumbbell,
    title: "12-Week Adaptive Blueprint",
    description:
      "Weekly goal-oriented coaching calls and daily accountability, adjusted as you progress.",
  },
  {
    icon: CalendarCheck,
    title: "Monthly Evaluations",
    description:
      "Structured 1:1 strategy sessions to track results and recalibrate your plan.",
  },
  {
    icon: Users,
    title: "Ongoing Community",
    description:
      "Unlimited WhatsApp support and a community that trains alongside you, long after week 12.",
  },
];

const JourneyPathScene = dynamic(
  () => import("./JourneyPathScene").then((mod) => mod.JourneyPathScene),
  { ssr: false }
);

function useReducedMotionPreference() {
  const [prefersReduced, setPrefersReduced] = useState<boolean | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(query.matches);
    const listener = (event: MediaQueryListEvent) => setPrefersReduced(event.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  return prefersReduced;
}

function StaticJourneyList() {
  return (
    <section className="relative py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold font-display text-foreground">
            Your Journey, Mapped Out
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            From your first call to a community that keeps you going
          </p>
        </div>
        <ol className="relative max-w-2xl mx-auto border-l border-[#C9A96A]/40 pl-8 space-y-10">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            return (
              <li key={stage.title} className="relative">
                <span className="absolute -left-[41px] flex h-8 w-8 items-center justify-center rounded-full bg-[#C9A96A]/15 border border-[#C9A96A]/40">
                  <Icon className="h-4 w-4 text-[#C9A96A]" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide text-[#C9A96A]">
                  Step {index + 1} of {stages.length}
                </span>
                <h3 className="text-lg font-bold font-display text-foreground mt-1 mb-1">
                  {stage.title}
                </h3>
                <p className="text-sm text-muted-foreground">{stage.description}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export default function JourneyPath() {
  const prefersReduced = useReducedMotionPreference();

  // Render the static, accessible version until we know the user's motion
  // preference (avoids a flash of the 3D scene) or if they prefer less motion.
  if (prefersReduced !== false) {
    return <StaticJourneyList />;
  }

  return <JourneyPathScene stages={stages} />;
}
