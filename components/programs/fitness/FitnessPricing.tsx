"use client";

import React, { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BadgeCheck, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { PricingHeader } from "@/components/subscription/PricingHeader";
import { useRouter } from "next/navigation";
import { useCountryTier } from "@/hooks/useCountryTier";
import { CURRENCY_SYMBOLS } from "@/utils/pppPricing";
import {
  MIN_SESSIONS_PER_WEEK,
  MAX_SESSIONS_PER_WEEK,
  DEFAULT_SESSIONS_PER_WEEK,
  WEEKS_PER_MONTH,
  billingOptions,
  calculateCyclePriceForCountry,
  getLifetimePriceForCountry,
} from "@/utils/pricing/sessionPricing";

const trainingModes = [
  { label: "Trainer-Led", value: "ONLINE" as const },
  { label: "Self-Paced", value: "SELF_PACED" as const },
];

const cycleLabelText = (months: number) =>
  months === 1 ? "Billed monthly" : `Billed every ${months} months`;

const categoryGradients = {
  FITNESS: "from-[#C9A96A] to-[#B8935A]",
};

const categoryIcons = {
  FITNESS: (
    <div className={`rounded-full bg-gradient-to-r ${categoryGradients.FITNESS} w-12 h-12 flex items-center justify-center flex-shrink-0`}>
      <div className="relative w-8 h-8">
        <Image
          src="/fitness-dark.svg"
          alt="Fitness Training"
          fill
          sizes="32px"
          className="object-contain"
          priority
        />
      </div>
    </div>
  ),
};

const fitnessPlan = {
  name: "The Strength Rebuild Blueprint",
  description: "Build physical strength, mobility, and confidence — no matter your physical challenge",
  features: [
    "12 Weeks Intensive + Follow-Up Support",
    "Weekly Goal-Oriented Coaching Call",
    "Monthly 1:1 Strategy & Evaluation (3 total)",
    "Daily Accountability Submissions",
    "Unlimited WhatsApp/Text Support",
    "Results Guarantee",
    "Kickstart 1:1 Fitness Deep-Dive (30 min)",
    "Custom adaptive fitness blueprint and progression map",
    "Modified strength training suited to your condition",
    "Goal-based programs: muscle gain, fat loss, endurance, or rehab"
  ]
};

export default function FitnessPricing() {
  const [sessionsPerWeek, setSessionsPerWeek] = useState<number>(DEFAULT_SESSIONS_PER_WEEK);
  const [selectedCycle, setSelectedCycle] = useState<number>(3);
  const [trainingMode, setTrainingMode] = useState<typeof trainingModes[number]["value"]>("ONLINE");
  const router = useRouter();

  const handleGetStarted = () => {
    router.push(
      `/checkout?tier=recurring&sessionsPerWeek=${sessionsPerWeek}&planType=${trainingMode}&billingCycle=${selectedCycle}`
    );
  };

  const handleGetLifetime = () => {
    router.push(`/checkout?tier=lifetime&sessionsPerWeek=${sessionsPerWeek}&planType=${trainingMode}`);
  };

  // PPP-tier pricing (see utils/pppPricing.ts) — shows the visitor their
  // own region's price, in their own currency, before they ever reach
  // checkout (which independently recomputes the same way).
  const { countryCode } = useCountryTier();
  const selectedOption = billingOptions.find((option) => option.value === selectedCycle) ?? billingOptions[0];
  const { totalSessions, originalAmount: originalPrice, discountedAmount: discountedPrice, currency } =
    calculateCyclePriceForCountry(sessionsPerWeek, selectedOption.value, trainingMode, countryCode);
  const weeksInCycle = selectedOption.value * WEEKS_PER_MONTH;
  const currencySymbol = CURRENCY_SYMBOLS[currency];
  const pricePerSession = Math.round(originalPrice / totalSessions);
  const lifetime = getLifetimePriceForCountry(sessionsPerWeek, trainingMode, countryCode);
  const lifetimePrice = lifetime?.amount;

  const adjustSessionsPerWeek = (delta: number) => {
    setSessionsPerWeek((prev) => Math.min(MAX_SESSIONS_PER_WEEK, Math.max(MIN_SESSIONS_PER_WEEK, prev + delta)));
  };

  const handleSessionsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setSessionsPerWeek(
      Number.isNaN(value)
        ? MIN_SESSIONS_PER_WEEK
        : Math.min(MAX_SESSIONS_PER_WEEK, Math.max(MIN_SESSIONS_PER_WEEK, value))
    );
  };

  return (
    <div id="fitness-pricing-section" className="relative w-full overflow-hidden py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        {/* Pricing Header with Billing Cycle Tabs */}
        <PricingHeader
          title="Choose Your Fitness Plan"
          subtitle="Invest in your physical transformation with our comprehensive strength coaching program"
          options={billingOptions}
          selected={selectedCycle}
          onSelect={setSelectedCycle}
        />

        {/* Training Mode Toggle */}
        <div className="mx-auto mt-8 flex max-w-xs flex-col items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Training Mode</span>
          <div className="flex rounded-full border border-input p-1">
            {trainingModes.map((mode) => (
              <button
                key={mode.value}
                type="button"
                onClick={() => setTrainingMode(mode.value)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  trainingMode === mode.value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {currencySymbol}
            {pricePerSession.toLocaleString()} per session
          </p>
        </div>

        {/* Sessions Per Week Selector */}
        <div className="mx-auto mt-6 flex max-w-xs flex-col items-center gap-2">
          <label htmlFor="fitness-session-count" className="text-sm font-medium text-muted-foreground">
            Sessions per Week
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => adjustSessionsPerWeek(-1)}
              aria-label="Decrease sessions per week"
              disabled={sessionsPerWeek <= MIN_SESSIONS_PER_WEEK}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-input text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Minus className="h-4 w-4" />
            </button>
            <Input
              id="fitness-session-count"
              type="number"
              min={MIN_SESSIONS_PER_WEEK}
              max={MAX_SESSIONS_PER_WEEK}
              value={sessionsPerWeek}
              onChange={handleSessionsInputChange}
              className="w-20 text-center text-lg font-semibold"
            />
            <button
              type="button"
              onClick={() => adjustSessionsPerWeek(1)}
              aria-label="Increase sessions per week"
              disabled={sessionsPerWeek >= MAX_SESSIONS_PER_WEEK}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-input text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Lifetime Membership note */}
        {lifetimePrice !== undefined && (
          <p className="mx-auto mt-6 max-w-md text-center text-sm text-muted-foreground">
            Or pay once and lock in this rate for life:{" "}
            <span className="font-semibold text-primary">
              {currencySymbol}
              {lifetimePrice.toLocaleString()}
            </span>{" "}
            — no further billing, ever.{" "}
            <button
              type="button"
              onClick={handleGetLifetime}
              className="font-semibold text-primary underline hover:text-primary/80"
            >
              Get Lifetime Access
            </button>
          </p>
        )}

        {/* Single Fitness Card - Centered */}
        <div className="flex justify-center mt-10">
          <div className="w-full max-w-md">
            <Card className="h-full flex flex-col overflow-hidden rounded-2xl border p-8 shadow bg-background border-primary/30">
              {/* Header Section */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  {categoryIcons.FITNESS}
                  <CardTitle className="text-xl">{fitnessPlan.name}</CardTitle>
                </div>
                
                <p className="text-sm text-muted-foreground mb-6">
                  {fitnessPlan.description}
                </p>
                
                {/* Price Section */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    {selectedOption.discount > 0 && (
                      <span className="text-lg font-medium text-muted-foreground line-through">
                        {currencySymbol}
                        {originalPrice.toLocaleString()}
                      </span>
                    )}
                    <span className="text-4xl font-medium text-primary">
                      {currencySymbol}
                      {discountedPrice.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mt-2">
                    {totalSessions} session{totalSessions === 1 ? "" : "s"} ({sessionsPerWeek}/week × {weeksInCycle} weeks) · {cycleLabelText(selectedOption.value)}
                    {selectedOption.discount > 0 && ` · ${selectedOption.discount}% off`}
                  </p>
                </div>
              </div>
              
              {/* Features Section - Show All Features */}
              <div className="flex-1 mb-6">
                <ul className="space-y-3">
                  {fitnessPlan.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center gap-3 text-sm font-medium text-foreground/60">
                      <BadgeCheck strokeWidth={1} size={16} className="text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Button Section */}
              <div className="mt-auto">
                <Button
                  onClick={handleGetStarted}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3"
                >
                  Get Started with Fitness Plan
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}