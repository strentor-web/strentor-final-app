"use client"

import {
  motion,
  useReducedMotion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
} from "motion/react"
import { PointerEvent as ReactPointerEvent, ReactNode } from "react"

interface HoverLiftProps {
  children: ReactNode
  className?: string
  /** Scale applied on hover/tap. */
  scale?: number
  lift?: number
  /** Cursor-tracked 3D tilt + glare (Apple-style), layered on top of the
   * lift/scale. On by default; pass false for cards where a flat lift reads
   * better (e.g. very wide/short rows). */
  tilt?: boolean
  /** Max tilt angle in degrees. */
  maxTilt?: number
}

/**
 * Hover/tap affordance for cards and tiles: a small lift + scale, plus (by
 * default) a cursor-tracked 3D tilt and gold glare highlight — the same
 * "leans toward the pointer" effect used across Apple's product pages.
 * Reduces to a plain, untransformed card under prefers-reduced-motion —
 * pointer-tracked 3D motion is exactly the kind of effect that can be
 * uncomfortable for vestibular-sensitive visitors.
 */
export function HoverLift({
  children,
  className,
  scale = 1.02,
  lift = 4,
  tilt = true,
  maxTilt = 8,
}: HoverLiftProps) {
  const shouldReduceMotion = useReducedMotion()

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const glareOpacity = useMotionValue(0)
  const springConfig = { stiffness: 300, damping: 25, mass: 0.5 }
  const spx = useSpring(px, springConfig)
  const spy = useSpring(py, springConfig)
  const sGlare = useSpring(glareOpacity, { stiffness: 300, damping: 30 })
  const rotateX = useTransform(spy, [0, 1], [maxTilt, -maxTilt])
  const rotateY = useTransform(spx, [0, 1], [-maxTilt, maxTilt])
  const glareX = useTransform(spx, [0, 1], ["0%", "100%"])
  const glareY = useTransform(spy, [0, 1], ["0%", "100%"])
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(201,169,106,0.18), transparent 60%)`

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  if (!tilt) {
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

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width)
    py.set((e.clientY - rect.top) / rect.height)
  }

  return (
    <motion.div
      className={className}
      style={{ position: "relative", transformPerspective: 800, rotateX, rotateY }}
      whileHover={{ scale, y: -lift }}
      whileTap={{ scale: scale * 0.99 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => glareOpacity.set(1)}
      onPointerLeave={() => {
        glareOpacity.set(0)
        px.set(0.5)
        py.set(0.5)
      }}
    >
      {children}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: glareBackground, opacity: sGlare }}
      />
    </motion.div>
  )
}
