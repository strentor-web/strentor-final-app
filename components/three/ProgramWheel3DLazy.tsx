"use client"

import dynamic from "next/dynamic"
import { ThreeErrorBoundary } from "./ThreeErrorBoundary"
import type { WheelSegmentSpec } from "./ProgramWheel3D"

const ProgramWheel3DInner = dynamic(
  () => import("./ProgramWheel3D").then((mod) => mod.ProgramWheel3D),
  { ssr: false }
)

export function ProgramWheel3D(props: { segments: WheelSegmentSpec[]; className?: string }) {
  return (
    <ThreeErrorBoundary>
      <ProgramWheel3DInner {...props} />
    </ThreeErrorBoundary>
  )
}
