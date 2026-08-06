"use client";

import {
  ClipboardCheck,
  Dumbbell,
  Apple,
  Moon,
  Brain,
  Users,
  TrendingUp,
} from "lucide-react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

const GOLD = "#D4AF37";

const STEPS = [
  { icon: ClipboardCheck, label: "Assessment" },
  { icon: Dumbbell, label: "Strength Coaching" },
  { icon: Apple, label: "Nutrition" },
  { icon: Moon, label: "Recovery" },
  { icon: Brain, label: "Mindset" },
  { icon: Users, label: "Community" },
  { icon: TrendingUp, label: "Performance" },
];

/** The full coaching ecosystem, step by step — a horizontal connected flow
 * on desktop, stacked vertically on mobile. The connecting line is a plain
 * CSS gradient border rather than an animated SVG draw: simpler to keep
 * correct across the two very different desktop/mobile layouts, and reduced
 * motion doesn't need a separate code path as a result. */
export function EcosystemFlow() {
  return (
    <section className="relative bg-black px-6 py-24 md:px-12 lg:px-20 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <p className="mb-4 text-sm font-medium tracking-[0.3em]" style={{ color: GOLD }}>
            THE ECOSYSTEM
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h2 className="mb-16 max-w-2xl text-4xl font-normal leading-tight text-[#FAFAFA] md:text-5xl lg:text-6xl">
            One Coaching System. Every Part of You.
          </h2>
        </ScrollReveal>

        <div className="relative flex flex-col md:flex-row md:items-start md:justify-between">
          <div
            className="absolute left-6 top-6 bottom-6 hidden w-px md:block md:left-0 md:right-0 md:top-6 md:h-px md:w-auto md:bottom-auto"
            style={{ background: `linear-gradient(90deg, transparent, ${GOLD}66, transparent)` }}
            aria-hidden
          />
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <ScrollReveal
                key={step.label}
                delay={i * 0.08}
                className="relative z-10 mb-10 flex flex-1 flex-col items-center gap-3 text-center last:mb-0 md:mb-0"
              >
                <div
                  className="liquid-glass flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                  style={{ borderColor: `${GOLD}4D` }}
                >
                  <Icon className="h-5 w-5" style={{ color: GOLD }} strokeWidth={1.5} />
                </div>
                <span className="text-sm font-medium text-[#D9D9D9]">{step.label}</span>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default EcosystemFlow;
