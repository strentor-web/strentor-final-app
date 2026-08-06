"use client";

import { useEffect, useState, type ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

/** Time-delayed fade-in (not scroll-triggered) — for content already in the
 * initial viewport on load, e.g. a hero, where ScrollReveal's `whileInView`
 * would fire immediately anyway and can't express a hand-tuned stagger. */
export function FadeIn({ children, delay = 0, duration = 800, className }: FadeInProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-opacity ${visible ? "opacity-100" : "opacity-0"} ${className ?? ""}`}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}
