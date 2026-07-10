"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";
import { Button } from "@/components/ui/button";
import { CalendlyEmbedModal } from "@/components/forms/CalendlyEmbedModal";
import { EmailCaptureModal } from "@/components/forms/EmailCaptureModal";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";

export type JourneyStage = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const GOLD = "#C9A96A";
const GOLD_LIGHT = "#EDE0C8";

// Control points for a rising path, one per stage, front-loaded toward camera.
const CONTROL_POINTS = [
  new THREE.Vector3(-3.4, 2.1, -1.5),
  new THREE.Vector3(-1.7, 1.0, -0.5),
  new THREE.Vector3(0, -0.2, 0.4),
  new THREE.Vector3(1.7, -1.3, -0.3),
  new THREE.Vector3(3.4, -2.4, -1.2),
];

function buildCurve() {
  return new THREE.CatmullRomCurve3(CONTROL_POINTS, false, "catmullrom", 0.4);
}

function PathLine({ curve }: { curve: THREE.CatmullRomCurve3 }) {
  const points = useMemo(() => curve.getPoints(120), [curve]);
  return (
    <Line
      points={points}
      color={GOLD}
      lineWidth={2}
      transparent
      opacity={0.55}
    />
  );
}

function NodeMarker({
  position,
  progress,
  nodeT,
}: {
  position: THREE.Vector3;
  progress: MotionValue<number>;
  nodeT: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(() => {
    const p = progress.get();
    const reached = p >= nodeT - 0.02;
    const active = Math.abs(p - nodeT) < 0.08;
    const targetScale = active ? 1.5 : reached ? 1.1 : 0.7;
    if (meshRef.current) {
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.15
      );
    }
    if (materialRef.current) {
      const targetIntensity = active ? 1.4 : reached ? 0.7 : 0.15;
      materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        materialRef.current.emissiveIntensity,
        targetIntensity,
        0.15
      );
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.14, 20, 20]} />
      <meshStandardMaterial
        ref={materialRef}
        color={GOLD_LIGHT}
        emissive={GOLD}
        emissiveIntensity={0.15}
        roughness={0.35}
        metalness={0.4}
      />
    </mesh>
  );
}

function Traveler({ curve, progress }: { curve: THREE.CatmullRomCurve3; progress: MotionValue<number> }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const t = THREE.MathUtils.clamp(progress.get(), 0, 1);
    const point = curve.getPointAt(t);
    groupRef.current.position.lerp(point, 0.35);
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[0.16, 0]} />
        <meshStandardMaterial
          color={GOLD_LIGHT}
          emissive={GOLD_LIGHT}
          emissiveIntensity={1.1}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>
      <pointLight color={GOLD} intensity={2} distance={2.5} />
    </group>
  );
}

function Scene({ progress }: { progress: MotionValue<number> }) {
  const curve = useMemo(() => buildCurve(), []);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={0.8} color={GOLD_LIGHT} />
      <PathLine curve={curve} />
      {CONTROL_POINTS.map((point, index) => (
        <NodeMarker
          key={index}
          position={point}
          progress={progress}
          nodeT={index / (CONTROL_POINTS.length - 1)}
        />
      ))}
      <Traveler curve={curve} progress={progress} />
    </>
  );
}

function NodeCopy({
  stage,
  index,
  total,
  scrollYProgress,
}: {
  stage: JourneyStage;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const t = index / (total - 1);
  const gap = 1 / (total - 1) / 2;
  const range: number[] =
    index === 0
      ? [0, 0, t + gap]
      : index === total - 1
      ? [t - gap, 1, 1]
      : [t - gap, t, t + gap];
  const output = index === 0 || index === total - 1 ? [1, 1, 0] : [0, 1, 0];
  const opacity = useTransform(scrollYProgress, range, index === 0 ? [1, 1, 0] : output);
  const y = useTransform(scrollYProgress, range, [16, 0, index === total - 1 ? 0 : -16]);

  const isLeft = index % 2 === 0;
  const Icon = stage.icon;

  return (
    <motion.div
      style={{ opacity, y }}
      className={`pointer-events-none absolute top-1/2 -translate-y-1/2 max-w-xs sm:max-w-sm ${
        isLeft ? "left-4 sm:left-10 text-left" : "right-4 sm:right-10 text-right"
      }`}
    >
      <div className={`flex items-center gap-2 mb-2 ${isLeft ? "" : "flex-row-reverse"}`}>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C9A96A]/15 border border-[#C9A96A]/40 flex-shrink-0">
          <Icon className="h-4 w-4 text-[#C9A96A]" />
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide text-[#C9A96A]">
          Step {index + 1} of {total}
        </span>
      </div>
      <h3 className="text-xl sm:text-2xl font-bold font-display text-foreground mb-1">
        {stage.title}
      </h3>
      <p className="text-sm sm:text-base text-muted-foreground">{stage.description}</p>
    </motion.div>
  );
}

export function JourneyPathScene({ stages }: { stages: JourneyStage[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const ctaOpacity = useTransform(scrollYProgress, [0.85, 1], [0, 1]);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [showCalendlyEmbed, setShowCalendlyEmbed] = useState(false);
  const [capturedEmail, setCapturedEmail] = useState("");

  const handleBookingClick = () => setShowEmailCapture(true);
  const handleEmailCaptured = (email: string) => {
    setCapturedEmail(email);
    setShowEmailCapture(false);
    setShowCalendlyEmbed(true);
  };

  return (
    <section ref={containerRef} className="relative h-[400vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-background">
        <div className="absolute inset-0">
          <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 7.5], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
          >
            <Scene progress={scrollYProgress} />
          </Canvas>
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

        <div className="relative h-full w-full">
          <div className="absolute top-10 left-0 right-0 text-center px-4">
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-foreground">
              Your Journey, Mapped Out
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              From your first call to a community that keeps you going
            </p>
          </div>

          {stages.map((stage, index) => (
            <NodeCopy
              key={stage.title}
              stage={stage}
              index={index}
              total={stages.length}
              scrollYProgress={scrollYProgress}
            />
          ))}

          <motion.div
            style={{ opacity: ctaOpacity }}
            className="absolute bottom-12 left-0 right-0 flex justify-center px-4"
          >
            <Button
              onClick={handleBookingClick}
              className="h-12 px-8 rounded-full font-bold bg-[#C9A96A] hover:bg-[#C9A96A]/90 text-background"
            >
              Start Your Journey — Book a Free Call
            </Button>
          </motion.div>
        </div>
      </div>

      <EmailCaptureModal
        open={showEmailCapture}
        onOpenChange={setShowEmailCapture}
        onEmailCaptured={handleEmailCaptured}
      />
      <CalendlyEmbedModal
        open={showCalendlyEmbed}
        onOpenChange={setShowCalendlyEmbed}
        userEmail={capturedEmail}
      />
    </section>
  );
}
