"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

const GOLD = 0xc9a96a
const DEEP_GOLD = 0xb8935a
const SILVER = 0xc9c0b4

interface GemSpec {
  position: [number, number, number]
  scale: number
  color: number
  speed: number
}

const GEMS: GemSpec[] = [
  { position: [1.1, 0.6, 0], scale: 0.85, color: GOLD, speed: 0.25 },
  { position: [-1.3, -0.5, -1], scale: 0.5, color: SILVER, speed: 0.4 },
  { position: [0.4, -1.1, 0.5], scale: 0.35, color: DEEP_GOLD, speed: 0.55 },
]

/**
 * Ambient decorative 3D gem cluster for the homepage hero, built with plain
 * Three.js (no react-reconciler / @react-three/fiber) — this project's React
 * + React DOM versions aren't in lockstep, which react-reconciler's stricter
 * internals check doesn't tolerate. Renders nothing until mounted
 * client-side and nothing under prefers-reduced-motion; a pure background
 * flourish layered behind the real hero content, so skipping it entirely
 * degrades to exactly what the hero already looks like without it.
 */
export function FloatingLogoScene({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setMounted(true)
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!mounted || reducedMotion || !container) return

    const width = container.clientWidth || 400
    const height = container.clientHeight || 400

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.z = 4.5

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    container.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    const key = new THREE.DirectionalLight(0xffffff, 1.4)
    key.position.set(3, 4, 5)
    scene.add(key)
    const fill = new THREE.DirectionalLight(SILVER, 0.4)
    fill.position.set(-3, -2, -3)
    scene.add(fill)

    const meshes = GEMS.map((spec, i) => {
      const geometry = new THREE.IcosahedronGeometry(1, 0)
      const material = new THREE.MeshStandardMaterial({ color: spec.color, metalness: 0.85, roughness: 0.25 })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(...spec.position)
      mesh.scale.setScalar(spec.scale)
      scene.add(mesh)
      return { mesh, speed: spec.speed, floatOffset: i * 1.7, baseY: spec.position[1] }
    })

    let frameId: number
    const clock = new THREE.Clock()
    const animate = () => {
      const t = clock.getElapsedTime()
      for (const g of meshes) {
        g.mesh.rotation.x += 0.01 * g.speed
        g.mesh.rotation.y += 0.008 * g.speed
        g.mesh.position.y = g.baseY + Math.sin(t * 0.8 + g.floatOffset) * 0.15
      }
      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }
    animate()

    const handleResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      if (!w || !h) return
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener("resize", handleResize)
      for (const g of meshes) {
        g.mesh.geometry.dispose()
        ;(g.mesh.material as THREE.Material).dispose()
      }
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [mounted, reducedMotion])

  if (!mounted || reducedMotion) return null

  return <div ref={containerRef} className={className} aria-hidden="true" />
}
