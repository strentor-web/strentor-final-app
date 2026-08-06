"use client";

import { useEffect, useRef, useState } from "react";
import { Quote, ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import { testimonials as staticTestimonials } from "@/data/testimonials";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

const GOLD = "#D4AF37";

interface Story {
  key: string;
  quote: string;
  author: string;
  mediaUrl?: string;
}

const fallbackStories: Story[] = staticTestimonials.map((t) => ({
  key: t.author,
  quote: t.quote,
  author: t.author,
}));

/** Real client quotes in a scroll-snap carousel — the same interaction
 * pattern as ProgramsCarousel. Real client video doesn't exist yet, so
 * this stays text-only; mediaUrl (from live submissions) is rendered as a
 * "Watch video story" link out rather than an inline player when present. */
export function TestimonialsCarousel() {
  const [stories, setStories] = useState<Story[]>(fallbackStories);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/testimonials/featured")
      .then((res) => res.json())
      .then((data: { stories?: Story[] }) => {
        if (!cancelled && data.stories && data.stories.length > 0) {
          setStories(data.stories);
        }
      })
      .catch(() => {
        // Keep showing the static fallback.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function scrollByCard(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-testimonial-card]");
    const amount = (card?.offsetWidth ?? 320) + 24;
    el.scrollBy({ left: amount * direction, behavior: "smooth" });
  }

  return (
    <section className="relative bg-black px-6 py-24 md:px-12 lg:px-20 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <p className="mb-4 text-sm font-medium tracking-[0.3em]" style={{ color: GOLD }}>
            SUCCESS STORIES
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h2 className="mb-16 max-w-2xl text-4xl font-normal leading-tight text-[#FAFAFA] md:text-5xl lg:text-6xl">
            Real Clients. Real Transformation.
          </h2>
        </ScrollReveal>

        <div className="relative">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Scroll testimonials left"
            className="absolute -left-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/80 text-white transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37] sm:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Scroll testimonials right"
            className="absolute -right-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/80 text-white transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37] sm:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {stories.map((story) => (
              <div
                key={story.key}
                data-testimonial-card
                className="liquid-glass flex w-[300px] flex-shrink-0 snap-start flex-col rounded-2xl p-7 sm:w-[360px]"
              >
                <Quote className="mb-4 h-8 w-8" style={{ color: GOLD }} strokeWidth={1.5} />
                <p className="mb-6 flex-1 text-base leading-relaxed text-[#D9D9D9]">{story.quote}</p>
                {story.mediaUrl && (
                  <a
                    href={story.mediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors"
                    style={{ borderColor: `${GOLD}66`, color: GOLD }}
                  >
                    <PlayCircle className="h-4 w-4" />
                    Watch video story
                  </a>
                )}
                <p className="text-sm font-medium" style={{ color: GOLD }}>
                  {story.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsCarousel;
