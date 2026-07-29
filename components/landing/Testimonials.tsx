"use client";

import React, { useState, useEffect } from "react";
import { useReducedMotion } from "motion/react";
import { Quote, PlayCircle } from "lucide-react";
import { testimonials as staticTestimonials } from "@/data/testimonials";

export interface TestimonialStory {
  key: string;
  quote: string;
  author: string;
  mediaUrl?: string;
}

const fallbackStories: TestimonialStory[] = staticTestimonials.map((t) => ({
  key: t.author,
  quote: t.quote,
  author: t.author,
}));

interface TestimonialCardProps {
  quote: string;
  author: string;
  mediaUrl?: string;
}

const TestimonialCard = ({ quote, author, mediaUrl }: TestimonialCardProps) => (
  <div className="p-8 bg-card rounded-xl shadow-lg text-center flex flex-col items-center h-full">
    <Quote className="w-10 h-10 text-[#B8935A] mb-6" />
    <p className="text-card-foreground font-semibold text-lg leading-relaxed mb-6">{quote}</p>
    <div className="mt-auto flex flex-col items-center">
      {mediaUrl && (
        <a
          href={mediaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[#C9A96A]/40 px-3 py-1 text-xs font-semibold text-[#C9A96A] transition-colors hover:bg-[#C9A96A]/10"
        >
          <PlayCircle className="h-4 w-4" />
          Watch video story
        </a>
      )}
      <div className="h-1 w-16 bg-gradient-to-r from-[#C9A96A] via-[#B8935A] to-[#C9C0B4] mb-4"></div>
      <p className="font-semibold">
        <span className="text-[#C9A96A] text-lg">{author}</span>
      </p>
    </div>
  </div>
);

const TestimonialCardMobile = ({ quote, author, mediaUrl }: TestimonialCardProps) => (
  <div className="p-6 bg-card rounded-xl shadow-lg text-center flex flex-col items-center h-full">
    <Quote className="w-8 h-8 text-[#B8935A] mb-4" />
    <p className="text-card-foreground font-semibold text-base leading-relaxed mb-4">{quote}</p>
    <div className="mt-auto flex flex-col items-center">
      {mediaUrl && (
        <a
          href={mediaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#C9A96A]/40 px-3 py-1 text-xs font-semibold text-[#C9A96A]"
        >
          <PlayCircle className="h-4 w-4" />
          Watch video story
        </a>
      )}
      <div className="h-1 w-12 bg-gradient-to-r from-[#C9A96A] via-[#B8935A] to-[#C9C0B4] mb-3"></div>
      <p className="font-semibold text-sm">
        <span className="text-[#C9A96A]">{author}</span>
      </p>
    </div>
  </div>
);

export default function Testimonials() {
  const shouldReduceMotion = useReducedMotion();
  const [position, setPosition] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  // Render the static quotes immediately (no loading flash below the fold),
  // then swap in real approved client testimonials — photos/video where
  // submitted — once they've loaded.
  const [stories, setStories] = useState<TestimonialStory[]>(fallbackStories);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/testimonials/featured")
      .then((res) => res.json())
      .then((data: { stories?: TestimonialStory[] }) => {
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

  const cardWidth = isMobile ? 100 : 100 / 3;
  const totalWidth = stories.length * cardWidth;

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth < 768); // Adjust breakpoint for mobile
    };
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const animation = () => {
      setPosition((prevPosition) => {
        const newPosition = prevPosition - 0.3; // Adjust the speed
        return Math.abs(newPosition) >= totalWidth ? 0 : newPosition;
      });
    };
    const animationFrame = setInterval(animation, 50);
    return () => clearInterval(animationFrame);
  }, [totalWidth, shouldReduceMotion]);

  if (stories.length === 0) return null;

  if (shouldReduceMotion) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-12 text-center text-foreground">
            Transforming Lives, <span className="text-[#C9A96A]">One Story</span> at a Time
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {stories.map((story) => (
              <TestimonialCard key={story.key} quote={story.quote} author={story.author} mediaUrl={story.mediaUrl} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold font-display mb-12 text-center text-foreground">
          Transforming Lives, <span className="text-[#C9A96A]">One Story</span> at a Time
        </h2>

        <div className="relative w-full overflow-hidden">
          {/* Fade effect overlays */}
          <div className="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-background to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-background to-transparent z-10"></div>

          {/* Testimonial cards */}
          <div
            className="flex gap-4 transition-transform duration-75 ease-linear"
            style={{
              transform: `translateX(${position}%)`,
            }}
          >
            {stories.map((story) => (
              <div key={`first-${story.key}`} className={`${isMobile ? "w-full px-2" : "w-1/3 px-4"} flex-shrink-0`}>
                {isMobile ? (
                  <TestimonialCardMobile quote={story.quote} author={story.author} mediaUrl={story.mediaUrl} />
                ) : (
                  <TestimonialCard quote={story.quote} author={story.author} mediaUrl={story.mediaUrl} />
                )}
              </div>
            ))}
            {/* Duplicate first three cards for smooth transition */}
            {stories.slice(0, 3).map((story) => (
              <div key={`duplicate-${story.key}`} className={`${isMobile ? "w-full px-2" : "w-1/3 px-4"} flex-shrink-0`}>
                {isMobile ? (
                  <TestimonialCardMobile quote={story.quote} author={story.author} mediaUrl={story.mediaUrl} />
                ) : (
                  <TestimonialCard quote={story.quote} author={story.author} mediaUrl={story.mediaUrl} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
