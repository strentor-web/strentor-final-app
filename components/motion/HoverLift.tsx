"use client"

import { motion, useReducedMotion } from "motion/react"
import { ReactNode } from "react"

interface HoverLiftProps {
  children: ReactNode
  className?: string
  /** Scale applied on hover/tap. */
  scale?: number
  lift?: number
}

/**
 * Subtle hover/tap affordance for cards and tiles — a small lift + scale,
 * skipped entirely under prefers-reduced-motion (hover color/border changes
 * defined in each card's own CSS still apply).
 */
export function HoverLift({ children, className, scale = 1.02, lift = 4 }: HoverLiftProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      whileHover={{ scale, y: -lift }}
      whileTap={{ scale: scale * 0.99 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  )
}
