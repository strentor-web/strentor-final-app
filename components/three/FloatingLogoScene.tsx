"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float } from "@react-three/drei"
import * as THREE from "three"

const GOLD = "#C9A96A"
const DEEP_GOLD = "#B8935A"
const SILVER = "#C9C0B4"

function Gem({
  position,
  scale,
  color,
  speed,
}: {
  position: [number, number, number]
  scale: number
  color: string
  speed: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * speed
      ref.current.rotation.y += delta * speed * 0.7
    }
  })
  return (
    <Float speed={1.4} rotationIntensity={0.3} floatIntensity={1.1}>
      <mesh ref={ref} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={color} metalness={0.85} roughness={0.25} />
      </mesh>
    </Float>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} color="#ffffff" />
      <directionalLight position={[-3, -2, -3]} intensity={0.4} color={SILVER} />
      <Gem position={[1.1, 0.6, 0]} scale={0.85} color={GOLD} speed={0.25} />
      <Gem position={[-1.3, -0.5, -1]} scale={0.5} color={SILVER} speed={0.4} />
      <Gem position={[0.4, -1.1, 0.5]} scale={0.35} color={DEEP_GOLD} speed={0.55} />
    </>
  )
}

/**
 * Ambient decorative 3D gem cluster for the homepage hero. Renders nothing
 * until mounted client-side, and nothing at all under prefers-reduced-motion
 * — this is a pure background flourish layered behind the real hero content,
 * so skipping it entirely degrades to exactly what the hero already looks
 * like without it.
 */
export function FloatingLogoScene({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mq.matches)
  }, [])

  if (!mounted || reducedMotion) return null

  return (
    <div className={className} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
