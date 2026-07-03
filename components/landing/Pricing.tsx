"use client";

import React, { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck } from "lucide-react";
import Image from "next/image";
import { PricingHeader } from "@/components/subscription/PricingHeader";
import { useRouter } from "next/navigation";

const billingOptions = [
  { label: "Quarterly", value: 3, discount: 10 },
  { label: "Semi-Annual", value: 6, discount: 20 },
  { label: "Annual", value: 12, discount: 30 },
];

const categoryGradients = {
  FITNESS: "from-[#D4AF37] to-[#C9972B]",
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
    ],
    pricing: {
      3: { original: 75000, discounted: 67500 },
      6: { original: 150000, discounted: 120000 },
      12: { original: 300000, discounted: 210000 }
    }
  },
};

export default function Pricing() {
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

  const getDiscountPercentage = (cycle: number) => {
    return cycle === 3 ? 10 : cycle === 6 ? 20 : 30;
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

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 max-w-sm mx-auto mt-12">
          {Object.entries(pricingData).map(([category, plan]) => {
            const pricing = plan.pricing[selectedCycle as keyof typeof plan.pricing];
            const discountPercentage = getDiscountPercentage(selectedCycle);
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
                      <span className="text-lg font-medium text-muted-foreground line-through">
                        ₹{pricing.original.toLocaleString()}
                      </span>
                      <span className="text-3xl font-medium text-primary">
                        ₹{pricing.discounted.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Billed every {selectedCycle} months
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
