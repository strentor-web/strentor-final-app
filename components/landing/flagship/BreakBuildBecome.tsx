"use client";

import { ScrollStory } from "@/components/motion/ScrollStory";

const GOLD = "#D4AF37";

const BEATS = [
  {
    word: "BREAK",
    copy: "Break the assumption that your wheelchair sets the ceiling. Break the habits that came from training programs that were never built for you.",
  },
  {
    word: "BUILD",
    copy: "Build real strength through a program designed around your body, not against it — progressive, measured, and adapted every step of the way.",
  },
  {
    word: "BECOME",
    copy: "Become stronger than you were yesterday — in the gym, and everywhere that strength shows up in your life.",
  },
];

export function BreakBuildBecome() {
  return (
    <ScrollStory
      className="bg-black"
      vhPerBeat={100}
      background={
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${GOLD}0D, transparent 70%)`,
            }}
          />
        </div>
      }
      beats={BEATS.map((beat) => (
        <div key={beat.word} className="mx-auto max-w-3xl px-6 text-center">
          <h2
            className="mb-6 text-6xl font-normal tracking-[-0.03em] text-[#FAFAFA] md:text-7xl lg:text-8xl"
            style={{ WebkitTextStroke: "1px rgba(212,175,55,0.3)" }}
          >
            {beat.word}
            <span style={{ color: GOLD }}>.</span>
          </h2>
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-[#D9D9D9] md:text-xl">
            {beat.copy}
          </p>
        </div>
      ))}
    />
  );
}

export default BreakBuildBecome;
