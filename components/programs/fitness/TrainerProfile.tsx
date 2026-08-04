"use client"

import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { ScrollReveal } from '@/components/motion/ScrollReveal';

const TrainerProfile = () => {
  return (
    <section className="container mx-auto px-4 py-20">
      {/* Headline Section */}
      <ScrollReveal className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
          Meet Your <span className="text-[#C9A96A]">Champion</span> Coach
        </h2>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
          From breaking barriers as a para powerlifter to transforming lives through fitness
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <ScrollReveal direction="left" className="space-y-8">
          <div>
            <h2 className="text-5xl font-bold mb-4">Aditya Mandan</h2>
            <div className="inline-block bg-primary px-4 py-2 rounded-full">
              <span className="text-primary-foreground font-semibold">Fitness and Nutrition Coaching</span>
            </div>
          </div>

          {/* Qualifications */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-[#C9A96A]">Qualifications</h3>
            <div className="space-y-3">
              {[
                "National-level Para Powerlifter",
                "Certified Fitness Trainer (Level 2, PEPT) and Nutrition Consultant"
              ].map((qualification, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-[#EDE0C8] flex-shrink-0" />
                  <span className="text-lg text-foreground">{qualification}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What We Offer */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-[#C9C0B4]">What We Offer</h3>
            <div className="space-y-3">
              {[
                "Tailored Fitness Programs: From fat loss to powerlifting",
                "Holistic Transformation: Integrating physical, mental, and emotional well-being",
                "Inclusive Approach: Accessible and empowering fitness for everyone"
              ].map((offering, index) => (
                <div key={index} className="flex items-center gap-3">
                  <svg
                    className="w-6 h-6 text-[#C9C0B4] flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span className="text-lg text-foreground">{offering}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Right Image */}
        <ScrollReveal direction="right" delay={0.1} className="relative h-[600px] w-full">
          <Image
            src="/Aditya-transparent.png"
            alt="Aditya Mandan - Fitness and Nutrition Coach"
            fill
            className="object-cover object-top rounded-lg"
            priority
          />
        </ScrollReveal>
      </div>
    </section>
  );
};

export default TrainerProfile; 