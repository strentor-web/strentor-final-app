"use client";

import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import { FadeIn } from "@/components/motion/FadeIn";
import { AnimatedHeading } from "@/components/motion/AnimatedHeading";

// Scoped to this component only — the rest of the site uses Satoshi/Playfair
// Display (set globally in app/layout.tsx). next/font avoids a render-blocking
// <link> request and self-hosts the font at build time.
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const GOLD = "#D4AF37";

const NAV_LINKS = [
  { label: "Programs", href: "/programs" },
  { label: "Coaching", href: "/coaching" },
  { label: "Success Stories", href: "/transformation-stories" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
];

// Real, verifiable facts only — no fabricated stats and no "AI Powered"
// framing (the AI Coaching program and all its marketing copy were
// deliberately removed from this site; reintroducing that language here
// would contradict that decision).
const STAT_CAPSULES = [
  { value: "Founder-Led", label: "National-Level Para Powerlifter" },
  { value: "1:1", label: "Elite Mentorship" },
  { value: "12-Week", label: "Flagship Transformation" },
];

export function VideoHero() {
  return (
    <div className={`relative min-h-screen w-full overflow-hidden bg-black ${inter.className}`}>
      {/* Background photo — Aditya Mandan, STRENTOR's founder, a national-level
          para powerlifter. A slow Ken Burns zoom stands in for true training
          footage until a real video is provided. Only a light bottom-anchored
          gradient for caption legibility — the photo itself is not dimmed. */}
      <div className="absolute inset-0">
        <Image
          src="/Aditya-transparent.png"
          alt=""
          fill
          priority
          className="object-cover object-top [animation:kenburns_24s_ease-in-out_infinite_alternate]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 60% 40% at 0% 100%, ${GOLD}1A, transparent 60%), radial-gradient(ellipse 50% 35% at 100% 0%, ${GOLD}14, transparent 60%)`,
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col px-6 pt-6 md:px-12 lg:px-20">
        {/* Navbar */}
        <nav className="liquid-glass flex items-center justify-between rounded-2xl px-6 py-3">
          <div className="flex items-center gap-3">
            <Image src="/strentor-icon.png" alt="" width={40} height={40} className="h-10 w-10" />
            <span className="text-xl font-semibold tracking-[0.15em] text-[#F5F5F5]">STRENTOR</span>
          </div>
          <div className="hidden items-center gap-10 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-300 transition duration-300 hover:text-[#D4AF37]"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link
            href="/apply-for-access"
            className="hidden rounded-xl px-7 py-3 text-sm font-medium text-black transition hover:brightness-110 sm:block"
            style={{ background: GOLD }}
          >
            Start Your Journey
          </Link>
        </nav>

        {/* Hero content, pinned to bottom of viewport */}
        <div className="flex flex-1 flex-col justify-end pb-14 lg:pb-20">
          <div className="lg:grid lg:grid-cols-2 lg:items-end">
            <div>
              <AnimatedHeading
                text={"BREAK.\nBUILD.\nBECOME."}
                initialDelay={250}
                charDelay={30}
                charDuration={550}
                className="mb-6 text-5xl font-normal leading-[1.02] text-[#FAFAFA] md:text-6xl lg:text-7xl xl:text-8xl"
                as="h1"
              />
              {/* Tailwind can't express this exact letter-spacing cleanly. */}
              <style jsx>{`
                h1 {
                  letter-spacing: -0.05em;
                }
              `}</style>

              <FadeIn delay={900} duration={1000}>
                <p className="mb-6 max-w-xl text-lg leading-relaxed text-[#D9D9D9] md:text-xl">
                  Adaptive strength coaching engineered for wheelchair users who refuse to let
                  circumstance define their future. Train smarter. Build resilience. Become
                  unstoppable.
                </p>
              </FadeIn>

              <FadeIn delay={1300} duration={1000}>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/apply-for-access"
                    className="rounded-xl px-9 py-4 font-semibold text-black transition hover:brightness-110"
                    style={{ background: GOLD }}
                  >
                    Book Your Assessment
                  </Link>
                  <Link
                    href="/programs"
                    className="liquid-glass rounded-xl px-9 py-4 font-medium text-white transition hover:bg-[#D4AF37] hover:text-black"
                    style={{ borderColor: `${GOLD}4D` }}
                  >
                    Explore Programs
                  </Link>
                </div>
              </FadeIn>
            </div>

            {/* Right column: premium tag card + floating stat capsules */}
            <div className="mt-10 flex flex-col items-start gap-6 lg:mt-0 lg:items-end">
              <FadeIn delay={1500} duration={1000}>
                <div className="liquid-glass rounded-2xl px-8 py-5" style={{ borderColor: `${GOLD}33` }}>
                  <p
                    className="text-xs uppercase tracking-[0.35em]"
                    style={{ color: GOLD }}
                  >
                    Transformation
                  </p>
                  <p className="mt-2 text-3xl font-light leading-tight text-white">
                    Strength.
                    <br />
                    Resilience.
                    <br />
                    Freedom.
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={1700} duration={1000} className="w-full">
                <div className="flex flex-wrap justify-start gap-3 lg:justify-end">
                  {STAT_CAPSULES.map((stat, i) => (
                    <div
                      key={stat.label}
                      className="liquid-glass rounded-full px-5 py-3"
                      style={{
                        borderColor: `${GOLD}26`,
                        animation: `float-capsule 6s ease-in-out infinite`,
                        animationDelay: `${i * 0.4}s`,
                      }}
                    >
                      <p className="text-sm font-semibold text-white">{stat.value}</p>
                      <p className="text-xs text-gray-400">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>

          {/* Scroll indicator */}
          <FadeIn delay={2000} duration={1000}>
            <div className="mt-10 flex flex-col items-center gap-2 lg:absolute lg:bottom-8 lg:left-1/2 lg:mt-0 lg:-translate-x-1/2">
              <span className="text-xs tracking-[0.3em] text-white/50">SCROLL</span>
              <span
                className="text-white/50 [animation:scroll-cue_2.5s_ease-in-out_infinite]"
                aria-hidden
              >
                ↓
              </span>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}

export default VideoHero;
