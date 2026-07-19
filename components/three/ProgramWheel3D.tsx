"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

export interface WheelSegmentSpec {
  color: string
}

/**
 * A real rotating 3D disc for the Programs "wheel of focus," built with
 * plain Three.js (no react-reconciler / @react-three/fiber — see
 * FloatingLogoScene.tsx for why). Layered on top of the existing static
 * conic-gradient wheel as a progressive enhancement: renders nothing until
 * mounted client-side and nothing under prefers-reduced-motion, so the CSS
 * wheel underneath is always the guaranteed fallback.
 */
export function ProgramWheel3D({ segments, className }: { segments: WheelSegmentSpec[]; className?: string }) {
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

    const width = container.clientWidth || 300
    const height = container.clientHeight || 300

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100)
    camera.position.z = 3

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    container.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffffff, 0.65))
    const key = new THREE.DirectionalLight(0xffffff, 1.3)
    key.position.set(2, 3, 4)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xc9c0b4, 0.35)
    fill.position.set(-2, -1, -2)
    scene.add(fill)

    const tiltGroup = new THREE.Group()
    tiltGroup.rotation.x = -0.6
    scene.add(tiltGroup)

    const rim = new THREE.Mesh(
      new THREE.RingGeometry(0.52, 1.05, 64),
      new THREE.MeshStandardMaterial({ color: 0x0a0a0a, metalness: 0.4, roughness: 0.6, side: THREE.DoubleSide })
    )
    rim.position.z = -0.02
    tiltGroup.add(rim)

    const spinGroup = new THREE.Group()
    tiltGroup.add(spinGroup)

    const count = segments.length
    const arc = (Math.PI * 2) / count
    const gap = 0.025
    segments.forEach((seg, i) => {
      const geometry = new THREE.RingGeometry(0.55, 1, 48, 1, 0, arc - gap)
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(seg.color),
        metalness: 0.7,
        roughness: 0.3,
        side: THREE.DoubleSide,
      })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.rotation.z = i * arc
      spinGroup.add(mesh)
    })

    let frameId: number
    const animate = () => {
      spinGroup.rotation.z += 0.0022
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
      scene.traverse((obj: THREE.Object3D) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose()
          const material = obj.material as THREE.Material | THREE.Material[]
          if (Array.isArray(material)) material.forEach((m) => m.dispose())
          else material.dispose()
        }
      })
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [mounted, reducedMotion, segments])

  if (!mounted || reducedMotion) return null

  return <div ref={containerRef} className={className} aria-hidden="true" />
}
