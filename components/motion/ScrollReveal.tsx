"use client"

import { motion, useReducedMotion, Variants } from "motion/react"
import { ReactNode } from "react"

type Direction = "up" | "down" | "left" | "right" | "none"

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  direction?: Direction
  delay?: number
  duration?: number
  /** Extra distance (px) the element travels in from. */
  distance?: number
  once?: boolean
  as?: "div" | "section" | "li"
}

const OFFSETS: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 1 },
  down: { y: -1 },
  left: { x: 1 },
  right: { x: -1 },
  none: {},
}

/**
 * Fade+slide element into place as it scrolls into view. Reduces to a plain
 * fade (or no motion at all) when the user prefers reduced motion, since a
 * meaningful share of STRENTOR's audience is managing health conditions
 * where large scroll-driven motion can be uncomfortable.
 */
export function ScrollReveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.5,
  distance = 24,
  once = true,
  as = "div",
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion()
  const offset = OFFSETS[direction]

  const variants: Variants = shouldReduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : {
        hidden: {
          opacity: 0,
          x: offset.x ? offset.x * distance : 0,
          y: offset.y ? offset.y * distance : 0,
        },
        visible: { opacity: 1, x: 0, y: 0 },
      }

  const MotionTag = motion[as]

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
      variants={variants}
      transition={{ duration: shouldReduceMotion ? 0.3 : duration, delay, ease: "easeOut" }}
    >
      {children}
    </MotionTag>
  )
}

interface StaggerGroupProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
  as?: "div" | "ul"
}

/** Wrap a group of ScrollReveal (or motion) children to stagger their entrance. */
export function StaggerGroup({ children, className, staggerDelay = 0.08, as = "div" }: StaggerGroupProps) {
  const shouldReduceMotion = useReducedMotion()
  const MotionTag = motion[as]

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: shouldReduceMotion ? 0 : staggerDelay },
        },
      }}
    >
      {children}
    </MotionTag>
  )
}
