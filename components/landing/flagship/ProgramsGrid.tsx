"use client";

import Link from "next/link";
import {
  Crown,
  Sparkles,
  Dumbbell,
  Users,
  Rocket,
  Building2,
  ArrowRight,
} from "lucide-react";
import { ScrollReveal, StaggerGroup } from "@/components/motion/ScrollReveal";
import { HoverLift } from "@/components/motion/HoverLift";

const GOLD = "#D4AF37";

// Same six real, already-built programs listed on /programs — nothing
// invented here, and every href resolves to a real page.
const PROGRAMS = [
  {
    icon: Crown,
    title: "Elite Mentorship",
    description:
      "Private, high-touch coaching with direct founder access — for clients seeking fully integrated physical, mental, emotional, and purpose development.",
    href: "/programs/elite-mentorship",
  },
  {
    icon: Sparkles,
    title: "Flagship Transformation",
    description:
      "A structured, four-phase program: assess and stabilise, build the foundation, progress strength, build independence.",
    href: "/programs/flagship-transformation",
  },
  {
    icon: Dumbbell,
    title: "Strength & Performance Coaching",
    description:
      "Focused adaptive strength training, nutrition guidance, and progress tracking — the core STRENTOR coaching program.",
    href: "/programs/fitness-training",
  },
  {
    icon: Users,
    title: "Strength Circle",
    description:
      "Education, community, and group support — structured coaching for clients who prefer a group environment.",
    href: "/programs/membership",
  },
  {
    icon: Rocket,
    title: "7-Day Starter Kit",
    description:
      "A low-commitment introduction to adaptive strength training — exercise plan, video feedback, and daily tracking.",
    href: "/programs/starter-kit",
  },
  {
    icon: Building2,
    title: "Corporate & Institutional Programs",
    description:
      "Programs for companies, institutions, and organizations seeking wheelchair-first performance, wellbeing, or inclusion initiatives.",
    href: "/corporate",
  },
];

export function ProgramsGrid() {
  return (
    <section className="relative bg-black px-6 py-24 md:px-12 lg:px-20 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <p className="mb-4 text-sm font-medium tracking-[0.3em]" style={{ color: GOLD }}>
            PROGRAMS
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h2 className="mb-16 max-w-2xl text-4xl font-normal leading-tight text-[#FAFAFA] md:text-5xl lg:text-6xl">
            Find Your Path Forward
          </h2>
        </ScrollReveal>

        <StaggerGroup className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map((program) => {
            const Icon = program.icon;
            return (
              <ScrollReveal key={program.title} className="h-full">
                <HoverLift className="h-full rounded-2xl" scale={1.015} lift={3}>
                  <Link
                    href={program.href}
                    className="liquid-glass flex h-full flex-col gap-4 rounded-2xl p-7"
                  >
                    <Icon className="h-7 w-7" style={{ color: GOLD }} strokeWidth={1.5} />
                    <h3 className="text-lg font-medium text-[#FAFAFA]">{program.title}</h3>
                    <p className="flex-1 text-sm leading-relaxed text-[#B8B8B8]">
                      {program.description}
                    </p>
                    <span
                      className="flex items-center gap-2 text-sm font-medium"
                      style={{ color: GOLD }}
                    >
                      Learn more <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                </HoverLift>
              </ScrollReveal>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}

export default ProgramsGrid;
