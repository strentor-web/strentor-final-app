import Image from "next/image";
import { ScrollReveal, StaggerGroup } from "@/components/motion/ScrollReveal";

const GOLD = "#D4AF37";

// Verified facts only — matches the checklist on /about. No unverified
// medical/biographical detail (e.g. dialysis) is asserted here.
const TIMELINE = [
  {
    label: "The Reality",
    beat: "A wheelchair user living with Spina Bifida, CKD-aware.",
  },
  {
    label: "The Discipline",
    beat: "Certified Fitness Trainer & Nutrition Consultant.",
  },
  {
    label: "The Proof",
    beat: "National-level Para Powerlifter.",
  },
  {
    label: "The Mission",
    beat: "Founded STRENTOR to build the coaching he wished had existed for him.",
  },
];

export function FounderStory() {
  return (
    <section className="relative bg-black px-6 py-24 md:px-12 lg:px-20 lg:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <ScrollReveal direction="right" className="order-2 lg:order-1">
          <p className="mb-4 text-sm font-medium tracking-[0.3em]" style={{ color: GOLD }}>
            THE FOUNDER
          </p>
          <h2 className="mb-10 text-4xl font-normal leading-tight text-[#FAFAFA] md:text-5xl">
            Built From Lived Experience
          </h2>

          <StaggerGroup className="space-y-8 border-l border-[#D4AF37]/20">
            {TIMELINE.map((item) => (
              <ScrollReveal key={item.label} direction="up" distance={12} className="relative pl-8">
                <span
                  className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full"
                  style={{ background: GOLD }}
                  aria-hidden
                />
                <p className="mb-1 text-xs font-medium tracking-[0.2em] text-[#B8B8B8]">
                  {item.label.toUpperCase()}
                </p>
                <p className="text-lg text-[#FAFAFA]">{item.beat}</p>
              </ScrollReveal>
            ))}
          </StaggerGroup>
        </ScrollReveal>

        <ScrollReveal direction="left" delay={0.15} className="order-1 lg:order-2">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl border border-[#D4AF37]/25 bg-[#101010]">
            <Image
              src="/Aditya-transparent.png"
              alt="Aditya Mandan, founder of STRENTOR, in his wheelchair"
              fill
              className="object-cover object-top"
            />
          </div>
          <p className="mt-4 text-center text-sm text-[#B8B8B8]">
            Aditya Mandan — Founder, STRENTOR
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default FounderStory;
