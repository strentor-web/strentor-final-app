"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";
import { Button } from "@/components/ui/button";
import { CalendlyEmbedModal } from "@/components/forms/CalendlyEmbedModal";
import { EmailCaptureModal } from "@/components/forms/EmailCaptureModal";
import type { LucideIcon } from "lucide-react";

export type JourneyStage = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const GOLD = 0xc9a96a;
const GOLD_LIGHT = 0xede0c8;

// Control points for a rising path, one per stage, front-loaded toward camera.
const CONTROL_POINTS = [
  new THREE.Vector3(-3.4, 2.1, -1.5),
  new THREE.Vector3(-1.7, 1.0, -0.5),
  new THREE.Vector3(0, -0.2, 0.4),
  new THREE.Vector3(1.7, -1.3, -0.3),
  new THREE.Vector3(3.4, -2.4, -1.2),
];

// Drives the WebGL scene imperatively (no react-reconciler) so it has no
// dependency on React's internal APIs — avoids the known Next.js 15 +
// @react-three/fiber compatibility break entirely.
function useJourneyScene(
  containerRef: RefObject<HTMLDivElement | null>,
  progressRef: RefObject<number>
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const curve = new THREE.CatmullRomCurve3(CONTROL_POINTS, false, "catmullrom", 0.4);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(GOLD_LIGHT, 0.4));
    const directional = new THREE.DirectionalLight(GOLD_LIGHT, 0.8);
    directional.position.set(3, 4, 5);
    scene.add(directional);

    const linePoints = curve.getPoints(120);
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    const lineMaterial = new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.55 });
    scene.add(new THREE.Line(lineGeometry, lineMaterial));

    const nodeMeshes = CONTROL_POINTS.map((point) => {
      const geometry = new THREE.SphereGeometry(0.14, 20, 20);
      const material = new THREE.MeshStandardMaterial({
        color: GOLD_LIGHT,
        emissive: GOLD,
        emissiveIntensity: 0.15,
        roughness: 0.35,
        metalness: 0.4,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(point);
      scene.add(mesh);
      return mesh;
    });

    const travelerGroup = new THREE.Group();
    const travelerMesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.16, 0),
      new THREE.MeshStandardMaterial({
        color: GOLD_LIGHT,
        emissive: GOLD_LIGHT,
        emissiveIntensity: 1.1,
        roughness: 0.2,
        metalness: 0.6,
      })
    );
    const travelerLight = new THREE.PointLight(GOLD, 2, 2.5);
    travelerGroup.add(travelerMesh, travelerLight);
    scene.add(travelerGroup);

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      if (clientWidth === 0 || clientHeight === 0) return;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    let frameId: number;
    const tmpScale = new THREE.Vector3();
    const animate = () => {
      const progress = progressRef.current ?? 0;

      nodeMeshes.forEach((mesh, index) => {
        const nodeT = index / (nodeMeshes.length - 1);
        const reached = progress >= nodeT - 0.02;
        const active = Math.abs(progress - nodeT) < 0.08;
        const targetScale = active ? 1.5 : reached ? 1.1 : 0.7;
        tmpScale.set(targetScale, targetScale, targetScale);
        mesh.scale.lerp(tmpScale, 0.15);
        const material = mesh.material as THREE.MeshStandardMaterial;
        const targetIntensity = active ? 1.4 : reached ? 0.7 : 0.15;
        material.emissiveIntensity = THREE.MathUtils.lerp(material.emissiveIntensity, targetIntensity, 0.15);
      });

      const t = THREE.MathUtils.clamp(progress, 0, 1);
      travelerGroup.position.lerp(curve.getPointAt(t), 0.35);

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      nodeMeshes.forEach((mesh) => {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });
      travelerMesh.geometry.dispose();
      (travelerMesh.material as THREE.Material).dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [containerRef, progressRef]);
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
  // Full neighbor-spacing (not half) so each node's fade window overlaps
  // its neighbors' by 50%, leaving no dead zone where every node is
  // simultaneously at zero opacity.
  const gap = 1 / (total - 1);
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const range: number[] = isFirst ? [t, t + gap] : isLast ? [t - gap, t] : [t - gap, t, t + gap];
  const opacity = useTransform(scrollYProgress, range, isFirst ? [1, 0] : isLast ? [0, 1] : [0, 1, 0]);
  const y = useTransform(scrollYProgress, range, isFirst ? [0, -16] : isLast ? [16, 0] : [16, 0, -16]);

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
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const progressRef = useRef(0);
  useEffect(() => {
    return scrollYProgress.on("change", (value) => {
      progressRef.current = value;
    });
  }, [scrollYProgress]);

  useJourneyScene(canvasHostRef, progressRef);

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
        <div ref={canvasHostRef} className="absolute inset-0" />

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
