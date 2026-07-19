"use client"

import dynamic from "next/dynamic"
import { ThreeErrorBoundary } from "./ThreeErrorBoundary"

// @react-three/fiber has import-time side effects that crash Next.js's
// server-side prerender pass, so the real Canvas-based component must never
// even be imported on the server — ssr:false is only legal from within a
// Client Component file, which is why this thin wrapper exists.
const FloatingLogoSceneInner = dynamic(
  () => import("./FloatingLogoScene").then((mod) => mod.FloatingLogoScene),
  { ssr: false }
)

export function FloatingLogoScene(props: { className?: string }) {
  return (
    <ThreeErrorBoundary>
      <FloatingLogoSceneInner {...props} />
    </ThreeErrorBoundary>
  )
}
