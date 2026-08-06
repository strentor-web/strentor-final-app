"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

/** Time-delayed fade-in (not scroll-triggered) — for content already in the
 * initial viewport on load, e.g. a hero, where ScrollReveal's `whileInView`
 * would fire immediately anyway and can't express a hand-tuned stagger.
 * Under prefers-reduced-motion, skips the delay/duration and shows content
 * immediately rather than staggering it in. */
export function FadeIn({ children, delay = 0, duration = 800, className }: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion) {
      setVisible(true);
      return;
    }
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay, shouldReduceMotion]);

  return (
    <div
      className={`transition-opacity ${visible ? "opacity-100" : "opacity-0"} ${className ?? ""}`}
      style={{ transitionDuration: `${shouldReduceMotion ? 0 : duration}ms` }}
    >
      {children}
    </div>
  );
}
