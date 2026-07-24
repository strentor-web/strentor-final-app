"use client";

import { useEffect, useState } from "react";
import { SubscribeButton } from "./subscribe-button";
import { Button } from "@/components/ui/button";
import type { TrainingPlanType } from "@/utils/pricing/sessionPricing";

interface RecurringCheckoutButtonProps {
  sessionsPerWeek: number;
  planType: TrainingPlanType;
  billingCycle: number;
  city?: string | null;
  segment?: string | null;
  className?: string;
  onSuccess?: () => void;
}

// Reuses the existing ensure-plan (provision/reuse a Razorpay Plan) + real
// SubscribeButton flow — the same authenticated pipeline Settings already
// uses — so the recurring path on /checkout stays a single source of truth
// with the in-app plan-change UI.
export function RecurringCheckoutButton({
  sessionsPerWeek,
  planType,
  billingCycle,
  city,
  segment,
  className,
  onSuccess,
}: RecurringCheckoutButtonProps) {
  const [plan, setPlan] = useState<{ razorpayPlanId: string; price: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setPlan(null);
    setError(null);

    (async () => {
      try {
        const response = await fetch("/api/subscriptions/ensure-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionsPerWeek, billingCycle, planType, city, segment }),
        });
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          if (!cancelled) setError(data.error || "Failed to prepare pricing");
          return;
        }
        const data = await response.json();
        if (!cancelled) setPlan({ razorpayPlanId: data.razorpayPlanId, price: data.price });
      } catch {
        if (!cancelled) setError("Failed to prepare pricing");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionsPerWeek, planType, billingCycle, city, segment]);

  if (error) {
    return <p className="text-center text-sm text-destructive">{error}</p>;
  }

  if (!plan) {
    return (
      <Button disabled className={className}>
        Preparing pricing…
      </Button>
    );
  }

  return (
    <SubscribeButton
      razorpayPlanId={plan.razorpayPlanId}
      selectedCycle={billingCycle}
      buttonText={`Pay ₹${plan.price.toLocaleString()} — Subscribe`}
      className={className}
      onSuccess={onSuccess}
    />
  );
}
