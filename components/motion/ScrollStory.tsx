"use client"

import { ReactNode, useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform, MotionValue } from "motion/react"

interface StoryBeatProps {
  children: ReactNode
  index: number
  total: number
  scrollYProgress: MotionValue<number>
}

/**
 * One "beat" of the story — crossfades in/out based on how far the parent
 * section has scrolled, with a slight upward drift for depth. Its own
 * component (not inlined in a .map()) so each instance can safely call
 * useTransform — calling hooks inside a loop within a single component body
 * would break the rules of hooks, but a list of separate component
 * instances is fine.
 */
function StoryBeat({ children, index, total, scrollYProgress }: StoryBeatProps) {
  const segment = 1 / total
  const segStart = index * segment
  const segEnd = segStart + segment
  const fadeIn = segStart + segment * 0.25
  const fadeOut = segEnd - segment * 0.25

  const isFirst = index === 0
  const isLast = index === total - 1

  const opacityInput = isFirst
    ? [0, 0, fadeOut, segEnd]
    : isLast
      ? [segStart, fadeIn, segEnd, segEnd]
      : [segStart, fadeIn, fadeOut, segEnd]
  const opacityOutput = isFirst ? [1, 1, 1, 0] : isLast ? [0, 1, 1, 1] : [0, 1, 1, 0]

  const opacity = useTransform(scrollYProgress, opacityInput, opacityOutput)
  const y = useTransform(scrollYProgress, [segStart, segEnd], [28, -28])

  return (
    <motion.div
      style={{ opacity, y }}
      className="pointer-events-none absolute inset-0 flex items-center justify-center px-4"
    >
      <div className="pointer-events-auto">{children}</div>
    </motion.div>
  )
}

interface ScrollStoryProps {
  /** Each entry is shown full-screen, crossfading into the next as the
   * visitor scrolls through the section. */
  beats: ReactNode[]
  /** Rendered once, behind every beat, pinned for the whole section (e.g.
   * a 3D scene or gradient) — doesn't crossfade with the text. */
  background?: ReactNode
  className?: string
  /** Scroll distance per beat, in viewport heights. Lower = faster pace. */
  vhPerBeat?: number
}

/**
 * Apple.com's signature effect: a section "pins" in place (via position:
 * sticky) while its content crossfades through several beats as the
 * visitor scrolls past it. Falls back to a plain stacked, non-pinned list
 * under prefers-reduced-motion — scroll-linked pinning is exactly the kind
 * of effect that's uncomfortable for vestibular-sensitive visitors, and a
 * meaningful share of STRENTOR's audience is managing health conditions.
 */
export function ScrollStory({ beats, background, className, vhPerBeat = 100 }: ScrollStoryProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  if (shouldReduceMotion) {
    return (
      <div className={className}>
        {background}
        <div className="relative space-y-16 py-16">
          {beats.map((beat, i) => (
            <div key={i} className="flex items-center justify-center px-4">
              {beat}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={className} style={{ height: `${beats.length * vhPerBeat}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden relative">
        {background}
        <div className="relative h-full w-full">
          {beats.map((beat, i) => (
            <StoryBeat key={i} index={i} total={beats.length} scrollYProgress={scrollYProgress}>
              {beat}
            </StoryBeat>
          ))}
        </div>
      </div>
    </div>
  )
}
