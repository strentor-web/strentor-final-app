"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Sparkles } from "@react-three/drei"
import * as THREE from "three"

const CHAMPAGNE_GOLD = "#C9A96A"
const CHAMPAGNE_GOLD_DEEP = "#B8935A"
const CHAMPAGNE_PLATINUM = "#C9C0B4"
const CHAMPAGNE_DIAMOND = "#EDE0C8"

function Emblem({ reducedMotion }: { reducedMotion: boolean }) {
  const coreRef = useRef<THREE.Mesh>(null)
  const wireRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (reducedMotion) return
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.22
      coreRef.current.rotation.x += delta * 0.08
    }
    if (wireRef.current) {
      wireRef.current.rotation.y -= delta * 0.14
      wireRef.current.rotation.x -= delta * 0.05
    }
  })

  return (
    <group position={[0, 0.15, -1.2]}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.95, 0]} />
        <meshStandardMaterial
          color={CHAMPAGNE_GOLD}
          emissive={CHAMPAGNE_GOLD_DEEP}
          emissiveIntensity={0.15}
          metalness={0.9}
          roughness={0.18}
          flatShading
          transparent
          opacity={0.55}
        />
      </mesh>
      <mesh ref={wireRef} scale={1.35}>
        <icosahedronGeometry args={[0.95, 0]} />
        <meshBasicMaterial color={CHAMPAGNE_PLATINUM} wireframe transparent opacity={0.22} />
      </mesh>
    </group>
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 3, 5]} intensity={60} color={CHAMPAGNE_DIAMOND} />
      <pointLight position={[-4, -2, -3]} intensity={30} color={CHAMPAGNE_GOLD} />
    </>
  )
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])
  return reduced
}

export function IntroScene3D() {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      frameloop={reducedMotion ? "demand" : "always"}
    >
      <Lights />
      <Emblem reducedMotion={reducedMotion} />
      <Sparkles
        count={70}
        scale={[7, 4, 4]}
        size={2.5}
        speed={reducedMotion ? 0 : 0.25}
        color={CHAMPAGNE_DIAMOND}
        opacity={0.7}
      />
    </Canvas>
  )
}

export default IntroScene3D
