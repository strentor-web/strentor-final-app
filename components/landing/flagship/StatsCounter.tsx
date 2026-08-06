"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Users, Globe, Sparkles, Dumbbell } from "lucide-react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

const GOLD = "#D4AF37";

// Same real numbers already live on the homepage — not different figures
// invented for this page.
const STATS = [
  { icon: Users, value: 500, suffix: "+", label: "Lives Transformed" },
  { icon: Globe, value: 20, suffix: "+", label: "Countries" },
  { icon: Sparkles, value: 98, suffix: "%", label: "Client Satisfaction" },
  { icon: Dumbbell, value: 1000, suffix: "+", label: "Sessions Delivered" },
];

function useCountUp(target: number, active: boolean, duration = 1500) {
  const shouldReduceMotion = useReducedMotion();
  const [value, setValue] = useState(shouldReduceMotion ? target : 0);

  useEffect(() => {
    if (!active) return;
    if (shouldReduceMotion) {
      setValue(target);
      return;
    }
    let raf: number;
    const start = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration, shouldReduceMotion]);

  return value;
}

function Stat({ stat, active }: { stat: (typeof STATS)[number]; active: boolean }) {
  const Icon = stat.icon;
  const value = useCountUp(stat.value, active);

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <Icon className="h-7 w-7" style={{ color: GOLD }} strokeWidth={1.5} />
      <span className="text-4xl font-normal text-[#FAFAFA] md:text-5xl">
        {value}
        {stat.suffix}
      </span>
      <span className="text-sm text-[#B8B8B8]">{stat.label}</span>
    </div>
  );
}

export function StatsCounter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-black px-6 py-20 md:px-12 lg:px-20">
      <ScrollReveal className="mx-auto grid max-w-5xl grid-cols-2 gap-10 md:grid-cols-4">
        {STATS.map((stat) => (
          <Stat key={stat.label} stat={stat} active={inView} />
        ))}
      </ScrollReveal>
    </section>
  );
}

export default StatsCounter;
