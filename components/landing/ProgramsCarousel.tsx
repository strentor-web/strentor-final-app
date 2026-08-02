"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { HoverLift } from "@/components/motion/HoverLift";
import { trackEvent } from "@/utils/analytics";

export interface CarouselProgram {
  icon: ReactNode;
  title: string;
  tagline: string;
  href: string;
}

export function ProgramsCarousel({ programs }: { programs: CarouselProgram[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-carousel-card]");
    const amount = (card?.offsetWidth ?? 280) + 24;
    el.scrollBy({ left: amount * direction, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scrollByCard(-1)}
        aria-label="Scroll programs left"
        className="absolute -left-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/80 text-white transition-colors hover:border-[#C9A96A] hover:text-[#C9A96A] sm:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => scrollByCard(1)}
        aria-label="Scroll programs right"
        className="absolute -right-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/80 text-white transition-colors hover:border-[#C9A96A] hover:text-[#C9A96A] sm:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {programs.map((program) => (
          <Link
            key={program.title}
            href={program.href}
            data-carousel-card
            onClick={() => trackEvent("program_view", { program: program.title, location: "home_carousel" })}
            className="group w-[240px] flex-shrink-0 snap-start sm:w-[260px]"
          >
            <HoverLift className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-[#101010] p-5 transition-colors hover:border-[#C9A96A]/50">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C9A96A]/10">
                  {program.icon}
                </div>
                <h3 className="mt-4 text-sm font-extrabold uppercase tracking-wide text-[#C9A96A]">
                  {program.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-gray-400">{program.tagline}</p>
              </div>
              <div className="mt-6 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition-colors group-hover:border-[#C9A96A]">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </HoverLift>
          </Link>
        ))}
      </div>
    </div>
  );
}
