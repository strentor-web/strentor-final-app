"use client";

import React, { useState, useEffect } from "react";
import { Quote } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  author: string;
}

const TestimonialCard = ({ quote, author }: TestimonialCardProps) => (
  <div className="p-8 bg-card rounded-xl shadow-lg text-center flex flex-col items-center h-full">
    <Quote className="w-10 h-10 text-[#B8935A] mb-6" />
    <p className="text-card-foreground font-semibold text-lg leading-relaxed mb-6">{quote}</p>
    <div className="mt-auto flex flex-col items-center">
      <div className="h-1 w-16 bg-gradient-to-r from-[#C9A96A] via-[#2FA366] to-[#C9C0B4] mb-4"></div>
      <p className="font-semibold">
        <span className="text-[#C9A96A] text-lg">{author}</span>
      </p>
    </div>
  </div>
);

const TestimonialCardMobile = ({ quote, author }: TestimonialCardProps) => (
  <div className="p-6 bg-card rounded-xl shadow-lg text-center flex flex-col items-center h-full">
    <Quote className="w-8 h-8 text-[#B8935A] mb-4" />
    <p className="text-card-foreground font-semibold text-base leading-relaxed mb-4">{quote}</p>
    <div className="mt-auto flex flex-col items-center">
      <div className="h-1 w-12 bg-gradient-to-r from-[#C9A96A] via-[#2FA366] to-[#C9C0B4] mb-3"></div>
      <p className="font-semibold text-sm">
        <span className="text-[#C9A96A]">{author}</span>
      </p>
    </div>
  </div>
);

export default function Testimonials() {
   
  const testimonials = [
    {
      quote:
        "Working with Aditya for over a year now and he is arguably the best fitness coach you could ask for. From personalized workouts to diet, he takes care of everything. Having Spina Bifida, I had my doubts whether lifting heaving weights is for me but he helped overcome those hurdles with ease!",
      author: "Chaitanya Shetty",
    },
    {
      quote:
        "Aditya is a brilliant trainer. He pushed me when it was needed and cherished every fitness milestone that I achieved.",
      author: "Tanushree Das",
    },
    {
      quote:
        "Working with Aditya I've seen good results in the past few months! My workouts are constantly increasing in difficulty and scope focused to match my fitness goals. Aditya suggests exercise routines that are individualized and challenging, but not more than I handle.",
      author: "Promila Dsilva",
    },
  ];

  const [position, setPosition] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const cardWidth = isMobile ? 100 : 100 / 3;
  const totalWidth = testimonials.length * cardWidth;

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth < 768); // Adjust breakpoint for mobile
    };
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    const animation = () => {
      setPosition((prevPosition) => {
        const newPosition = prevPosition - 0.3; // Adjust the speed
        return Math.abs(newPosition) >= totalWidth ? 0 : newPosition;
      });
    };
    const animationFrame = setInterval(animation, 50);
    return () => clearInterval(animationFrame);
  }, [totalWidth]);

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
            {testimonials.map((testimonial, idx) => (
              <div key={`first-${idx}`} className={`${isMobile ? "w-full px-2" : "w-1/3 px-4"} flex-shrink-0`}>
                {isMobile ? (
                  <TestimonialCardMobile quote={testimonial.quote} author={testimonial.author} />
                ) : (
                  <TestimonialCard quote={testimonial.quote} author={testimonial.author} />
                )}
              </div>
            ))}
            {/* Duplicate first three cards for smooth transition */}
            {testimonials.slice(0, 3).map((testimonial, idx) => (
              <div key={`duplicate-${idx}`} className={`${isMobile ? "w-full px-2" : "w-1/3 px-4"} flex-shrink-0`}>
                {isMobile ? (
                  <TestimonialCardMobile quote={testimonial.quote} author={testimonial.author} />
                ) : (
                  <TestimonialCard quote={testimonial.quote} author={testimonial.author} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
