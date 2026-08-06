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

const NAV_LINKS = [
  { label: "Method", href: "/the-strentor-method" },
  { label: "Programs", href: "/programs" },
  { label: "Stories", href: "/transformation-stories" },
  { label: "Corporate", href: "/corporate" },
];

export function VideoHero() {
  return (
    <div className={`relative min-h-screen w-full overflow-hidden bg-black ${inter.className}`}>
      {/* Background photo — Aditya Mandan, STRENTOR's founder, a national-level
          para powerlifter. A slow Ken Burns zoom stands in for a true video
          background until a real training-footage video is provided. No
          overlay/gradient beyond the site's existing gold ambient glow, so
          the photo stays the focal point. */}
      <div className="absolute inset-0">
        <Image
          src="/Aditya-transparent.png"
          alt=""
          fill
          priority
          className="object-cover object-top opacity-70 [animation:kenburns_24s_ease-in-out_infinite_alternate]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col px-6 pt-6 md:px-12 lg:px-16">
        {/* Navbar */}
        <nav className="liquid-glass flex items-center justify-between rounded-xl px-4 py-2">
          <span className="text-2xl font-semibold tracking-tight text-white">STRENTOR</span>
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white transition-colors hover:text-gray-300"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link
            href="/contact?type=personal"
            className="hidden rounded-lg bg-[#C9A96A] px-6 py-2 text-sm font-medium text-black transition-colors hover:bg-[#C9A96A]/90 sm:block"
          >
            Book Fit Assessment
          </Link>
        </nav>

        {/* Hero content, pinned to bottom of viewport */}
        <div className="flex flex-1 flex-col justify-end pb-12 lg:pb-16">
          <div className="lg:grid lg:grid-cols-2 lg:items-end">
            <div>
              <AnimatedHeading
                text={"Redefining strength\nwithout limits."}
                initialDelay={200}
                className="mb-4 text-4xl font-normal leading-[1.05] text-white md:text-5xl lg:text-6xl xl:text-7xl"
                as="h1"
              />
              {/* Tailwind can't express arbitrary letter-spacing cleanly for
                  this exact value, matching the spec's -0.04em tracking. */}
              <style jsx>{`
                h1 {
                  letter-spacing: -0.04em;
                }
              `}</style>

              <FadeIn delay={800} duration={1000}>
                <p className="mb-5 text-base text-gray-300 md:text-lg">
                  We coach wheelchair users to build adaptive strength, resilience, and a life
                  without limits — led by a national-level para powerlifter.
                </p>
              </FadeIn>

              <FadeIn delay={1200} duration={1000}>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/contact?type=personal"
                    className="rounded-lg bg-[#C9A96A] px-8 py-3 font-medium text-black transition-colors hover:bg-[#C9A96A]/90"
                  >
                    Book Fit Assessment
                  </Link>
                  <Link
                    href="/programs"
                    className="liquid-glass rounded-lg border border-white/20 px-8 py-3 font-medium text-white transition-colors hover:bg-white hover:text-black"
                  >
                    Explore Programs
                  </Link>
                </div>
              </FadeIn>
            </div>

            <div className="mt-8 flex items-end justify-start lg:mt-0 lg:justify-end">
              <FadeIn delay={1400} duration={1000}>
                <div className="liquid-glass rounded-xl border border-white/20 px-6 py-3">
                  <span className="text-lg font-light text-white md:text-xl lg:text-2xl">
                    Strength. Purpose. Progress.
                  </span>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoHero;
