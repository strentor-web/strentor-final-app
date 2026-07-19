"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

export interface WheelSegmentSpec {
  color: string
}

function Segments({ segments }: { segments: WheelSegmentSpec[] }) {
  const spinRef = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (spinRef.current) {
      spinRef.current.rotation.z += delta * 0.18
    }
  })

  const count = segments.length
  const arc = (Math.PI * 2) / count
  const gap = 0.025

  return (
    <group rotation={[-0.6, 0, 0]}>
      {/* Rim */}
      <mesh position={[0, 0, -0.02]}>
        <ringGeometry args={[0.52, 1.05, 64]} />
        <meshStandardMaterial color="#0A0A0A" metalness={0.4} roughness={0.6} side={THREE.DoubleSide} />
      </mesh>
      <group ref={spinRef}>
        {segments.map((seg, i) => (
          <mesh key={i} rotation={[0, 0, i * arc]}>
            <ringGeometry args={[0.55, 1, 48, 1, 0, arc - gap]} />
            <meshStandardMaterial color={seg.color} metalness={0.7} roughness={0.3} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/**
 * A real rotating 3D disc for the Programs "wheel of focus," layered on top
 * of the existing static conic-gradient wheel as a progressive enhancement.
 * Renders nothing until mounted client-side and nothing under
 * prefers-reduced-motion, so the CSS wheel underneath is always the
 * guaranteed fallback.
 */
export function ProgramWheel3D({ segments, className }: { segments: WheelSegmentSpec[]; className?: string }) {
  const [mounted, setMounted] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setMounted(true)
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  if (!mounted || reducedMotion) return null

  return (
    <div className={className} aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 3], fov: 40 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.65} />
        <directionalLight position={[2, 3, 4]} intensity={1.3} />
        <directionalLight position={[-2, -1, -2]} intensity={0.35} color="#C9C0B4" />
        <Segments segments={segments} />
      </Canvas>
    </div>
  )
}
