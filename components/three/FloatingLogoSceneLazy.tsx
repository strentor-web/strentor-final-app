"use client"

import dynamic from "next/dynamic"

// @react-three/fiber has import-time side effects that crash Next.js's
// server-side prerender pass, so the real Canvas-based component must never
// even be imported on the server — ssr:false is only legal from within a
// Client Component file, which is why this thin wrapper exists.
export const FloatingLogoScene = dynamic(
  () => import("./FloatingLogoScene").then((mod) => mod.FloatingLogoScene),
  { ssr: false }
)
