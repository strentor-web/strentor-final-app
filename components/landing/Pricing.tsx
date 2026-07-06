"use client";

import React, { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BadgeCheck, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { PricingHeader } from "@/components/subscription/PricingHeader";
import { useRouter } from "next/navigation";

const RATE_PER_SESSION = 1000;
const MIN_SESSIONS = 1;
const DEFAULT_SESSIONS = 12;

const billingOptions = [
  { label: "Monthly", value: 1, discount: 0 },
  { label: "Quarterly", value: 3, discount: 10 },
  { label: "Semi-Annual", value: 6, discount: 20 },
  { label: "Annual", value: 12, discount: 30 },
];

const cycleLabelText = (months: number) =>
  months === 1 ? "Billed monthly" : `Billed every ${months} months`;

const categoryGradients = {
  FITNESS: "from-[#C9A96A] to-[#B8935A]",
};

const categoryIcons = {
  FITNESS: (
    <div className={`rounded-full bg-gradient-to-r ${categoryGradients.FITNESS} w-10 h-10 flex items-center justify-center flex-shrink-0`}>
      <div className="relative w-6 h-6">
        <Image
          src="/fitness-dark.svg"
          alt="Fitness Training"
          fill
          sizes="24px"
          className="object-contain"
          priority
        />
      </div>
    </div>
  ),
};

const pricingData = {
  FITNESS: {
    name: "The Strength Rebuild Blueprint",
    description: "Build physical strength, mobility, and confidence",
    features: [
      "12 Weeks Intensive + Follow-Up Support",
      "Weekly Goal-Oriented Coaching Call",
      "Monthly 1:1 Strategy & Evaluation (3 total)",
      "Daily Accountability Submissions",
      "Unlimited WhatsApp/Text Support",
      "Results Guarantee"
    ]
  },
};

export default function Pricing() {
  const [sessions, setSessions] = useState<number>(DEFAULT_SESSIONS);
  const [selectedCycle, setSelectedCycle] = useState<number>(3);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/sign-in');
  };

  const toggleExpansion = (category: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const getCategoryBorderClass = (category: string) => {
    switch (category) {
      case 'FITNESS': return 'border-primary/30';
      default: return 'border-border';
    }
  };

  const selectedOption = billingOptions.find((option) => option.value === selectedCycle) ?? billingOptions[0];
  const originalPrice = sessions * RATE_PER_SESSION;
  const discountedPrice = Math.round(originalPrice * (1 - selectedOption.discount / 100));

  const adjustSessions = (delta: number) => {
    setSessions((prev) => Math.max(MIN_SESSIONS, prev + delta));
  };

  const handleSessionsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setSessions(Number.isNaN(value) ? MIN_SESSIONS : Math.max(MIN_SESSIONS, value));
  };

  return (
    <div id="pricing-section" className="relative w-full overflow-hidden py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        {/* Pricing Header with Billing Cycle Tabs */}
        <PricingHeader
          title="Choose Your Transformation Plan"
          subtitle="Invest in yourself with our comprehensive coaching programs"
          options={billingOptions}
          selected={selectedCycle}
          onSelect={setSelectedCycle}
        />

        {/* Session Count Selector */}
        <div className="mx-auto mt-8 flex max-w-xs flex-col items-center gap-2">
          <label htmlFor="landing-session-count" className="text-sm font-medium text-muted-foreground">
            Number of Sessions
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => adjustSessions(-1)}
              aria-label="Decrease number of sessions"
              disabled={sessions <= MIN_SESSIONS}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-input text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Minus className="h-4 w-4" />
            </button>
            <Input
              id="landing-session-count"
              type="number"
              min={MIN_SESSIONS}
              value={sessions}
              onChange={handleSessionsInputChange}
              className="w-20 text-center text-lg font-semibold"
            />
            <button
              type="button"
              onClick={() => adjustSessions(1)}
              aria-label="Increase number of sessions"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-input text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground">₹{RATE_PER_SESSION.toLocaleString()} per session</p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 max-w-sm mx-auto mt-10">
          {Object.entries(pricingData).map(([category, plan]) => {
            const isAllInOne = category === 'ALL_IN_ONE';
            
            return (
              <Card 
                key={category}
                className={`h-full flex flex-col overflow-hidden rounded-2xl border p-6 shadow bg-background ${getCategoryBorderClass(category)} ${
                  isAllInOne ? 'ring-2 ring-green-500 bg-gradient-to-br from-green-50 to-emerald-50' : ''
                } relative`}
              >
                {/* Floating Most Popular Badge */}
                {isAllInOne && (
                  <Badge variant="default" className="absolute top-4 right-4 bg-green-500 z-10">
                    Most Popular
                  </Badge>
                )}
                
                {/* Header Section */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    {categoryIcons[category as keyof typeof categoryIcons]}
                    <CardTitle className={`text-lg leading-tight ${isAllInOne ? 'pr-20' : ''}`}>
                      {plan.name}
                    </CardTitle>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    {plan.description}
                  </p>
                  
                  {/* Price Section */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      {selectedOption.discount > 0 && (
                        <span className="text-lg font-medium text-muted-foreground line-through">
                          ₹{originalPrice.toLocaleString()}
                        </span>
                      )}
                      <span className="text-3xl font-medium text-primary">
                        ₹{discountedPrice.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">
                      {sessions} session{sessions === 1 ? "" : "s"} · {cycleLabelText(selectedOption.value)}
                      {selectedOption.discount > 0 && ` · ${selectedOption.discount}% off`}
                    </p>
                  </div>
                </div>
                
                {/* Features Section - Fixed Height */}
                <div className="flex-1 mb-6 min-h-[200px]">
                  <ul className="space-y-2">
                    {(() => {
                      const isExpanded = expandedCards.has(category);
                      const featuresToShow = isExpanded ? plan.features : plan.features.slice(0, 6);
                      
                      return featuresToShow.map((feature: string, index: number) => (
                        <li key={index} className="flex items-center gap-2 text-sm font-medium text-foreground/60">
                          <BadgeCheck strokeWidth={1} size={16} className="text-primary" />
                          {feature}
                        </li>
                      ));
                    })()}
                  </ul>
                  
                  {/* {plan.features.length > 3 && (
                    <button 
                      onClick={() => toggleExpansion(category)}
                      className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      {expandedCards.has(category) 
                        ? 'View Less' 
                        : `View ${plan.features.length - 3} More`
                      }
                    </button>
                  )} */}
                </div>
                
                {/* Button Section */}
                <div className="mt-auto">
                  <Button
                    onClick={handleGetStarted}
                    className={`w-full ${
                      isAllInOne
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    }`}
                  >
                    Get Started
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
