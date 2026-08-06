"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

interface AnimatedHeadingProps {
  text: string;
  className?: string;
  initialDelay?: number;
  charDelay?: number;
  charDuration?: number;
  as?: "h1" | "h2";
}

/** Splits `text` on \n into lines, then each line into words, then each word
 * into characters, and reveals each character (opacity + translateX) with a
 * staggered delay. Characters within a word are grouped in a `whitespace-nowrap`
 * span so the line can only wrap between words, never mid-word — individual
 * `inline-block` characters otherwise create a break opportunity anywhere.
 * Under prefers-reduced-motion, skips the per-character stagger/translate
 * entirely and renders the plain text with a single short fade. */
export function AnimatedHeading({
  text,
  className,
  initialDelay = 200,
  charDelay = 30,
  charDuration = 500,
  as = "h1",
}: AnimatedHeadingProps) {
  const shouldReduceMotion = useReducedMotion();
  const [started, setStarted] = useState(false);
  const lines = text.split("\n");

  useEffect(() => {
    if (shouldReduceMotion) {
      setStarted(true);
      return;
    }
    const timer = setTimeout(() => setStarted(true), initialDelay);
    return () => clearTimeout(timer);
  }, [initialDelay, shouldReduceMotion]);

  const Tag = as;

  if (shouldReduceMotion) {
    return (
      <Tag className={`transition-opacity duration-300 ${started ? "opacity-100" : "opacity-0"} ${className ?? ""}`}>
        {lines.map((line, lineIndex) => (
          <span key={lineIndex} className="block">
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag className={className}>
      {lines.map((line, lineIndex) => {
        const words = line.split(" ");
        let charCounter = 0;

        return (
          <span key={lineIndex} className="block">
            {words.map((word, wordIndex) => {
              const wordSpan = (
                <span key={wordIndex} className="inline-block whitespace-nowrap">
                  {word.split("").map((char, i) => {
                    const globalIndex = charCounter + i;
                    return (
                      <span
                        key={i}
                        className="inline-block transition-all ease-out"
                        style={{
                          opacity: started ? 1 : 0,
                          transform: started ? "translateX(0)" : "translateX(-18px)",
                          transitionDuration: `${charDuration}ms`,
                          transitionDelay: `${lineIndex * line.length * charDelay + globalIndex * charDelay}ms`,
                        }}
                      >
                        {char}
                      </span>
                    );
                  })}
                </span>
              );
              charCounter += word.length + 1; // +1 accounts for the space that follows
              return (
                <span key={`w-${wordIndex}`}>
                  {wordSpan}
                  {wordIndex < words.length - 1 ? " " : null}
                </span>
              );
            })}
          </span>
        );
      })}
    </Tag>
  );
}
