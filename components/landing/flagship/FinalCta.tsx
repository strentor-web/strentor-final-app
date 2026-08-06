import Link from "next/link";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

const GOLD = "#D4AF37";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-black px-6 py-24 text-center md:px-12 lg:py-32">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${GOLD}14, transparent 70%)`,
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-3xl">
        <ScrollReveal scale={0.96}>
          <h2 className="mb-8 text-4xl font-normal leading-tight text-[#FAFAFA] md:text-5xl lg:text-6xl">
            Ready to Break. Build. Become?
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <Link
            href="/apply-for-access"
            className="inline-block rounded-xl px-10 py-4 font-semibold text-black transition hover:brightness-110"
            style={{ background: GOLD }}
          >
            Apply for Coaching
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default FinalCta;
