"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { loadPaypalScript } from "@/utils/paypalClient";
import { toast } from "sonner";
import type { TrainingPlanType } from "@/utils/pricing/sessionPricing";

interface PaypalRecurringButtonProps {
  sessionsPerWeek: number;
  planType: TrainingPlanType;
  billingCycle: number;
  countryCode: string | null;
  className?: string;
  onSuccess?: () => void;
}

// PayPal equivalent of RecurringCheckoutButton — ensures a USD PayPal
// Billing Plan exists (server-provisioned) then renders PayPal's Smart
// Button configured for subscription intent.
export function PaypalRecurringButton({
  sessionsPerWeek,
  planType,
  billingCycle,
  countryCode,
  className,
  onSuccess,
}: PaypalRecurringButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);

    (async () => {
      const loaded = await loadPaypalScript("subscription");
      if (cancelled || !loaded || !containerRef.current || !window.paypal) return;

      containerRef.current.innerHTML = "";

      window.paypal
        .Buttons({
          style: { layout: "horizontal", color: "gold", label: "subscribe", height: 48 },
          createSubscription: async () => {
            setIsProcessing(true);

            const planResponse = await fetch("/api/paypal/subscriptions/ensure-plan", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sessionsPerWeek, billingCycle, planType, countryCode }),
            });

            if (planResponse.status === 401) {
              router.push(`/sign-up?redirect=/settings`);
              throw new Error("Not signed in");
            }

            if (!planResponse.ok) {
              const errorData = await planResponse.json().catch(() => ({}));
              toast.error(errorData.error || "Failed to prepare pricing");
              setIsProcessing(false);
              throw new Error(errorData.error || "Failed to prepare pricing");
            }

            const planData = await planResponse.json();

            const subscriptionResponse = await fetch("/api/paypal/subscriptions/create", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paypalPlanId: planData.paypalPlanId }),
            });

            if (!subscriptionResponse.ok) {
              const errorData = await subscriptionResponse.json().catch(() => ({}));
              toast.error(errorData.error || "Failed to create subscription");
              setIsProcessing(false);
              throw new Error(errorData.error || "Failed to create subscription");
            }

            const subscriptionData = await subscriptionResponse.json();
            return subscriptionData.subscriptionId;
          },
          onApprove: async (data: { subscriptionID: string }) => {
            try {
              const response = await fetch("/api/paypal/subscriptions/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paypal_subscription_id: data.subscriptionID }),
              });

              const result = await response.json();

              if (response.ok && result.status === "ok") {
                toast.success("Payment verified! Your subscription is now active.", {
                  description: "You can now access all premium features.",
                  duration: 5000,
                });
                if (onSuccess) {
                  onSuccess();
                } else {
                  window.location.reload();
                }
              } else {
                toast.error("Payment verification pending", {
                  description:
                    "We're manually verifying your payment. You'll receive confirmation via email within 10-15 minutes.",
                  duration: 10000,
                });
              }
            } catch {
              toast.error("Payment verification pending", {
                description:
                  "We're manually verifying your payment. You'll receive confirmation via email within 10-15 minutes.",
                duration: 10000,
              });
            } finally {
              setIsProcessing(false);
            }
          },
          onCancel: () => {
            setIsProcessing(false);
          },
          onError: (err: unknown) => {
            console.error("PayPal subscription error:", err);
            toast.error("Payment failed", {
              description: "Your payment could not be processed.",
            });
            setIsProcessing(false);
          },
        })
        .render(containerRef.current);

      if (!cancelled) setIsReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionsPerWeek, planType, billingCycle, countryCode, router, onSuccess]);

  if (error) {
    return <p className="text-center text-sm text-destructive">{error}</p>;
  }

  return (
    <div className={className}>
      {!isReady && <p className="text-center text-sm text-muted-foreground">Loading PayPal…</p>}
      {isProcessing && <p className="mb-2 text-center text-sm text-muted-foreground">Processing…</p>}
      <div ref={containerRef} />
    </div>
  );
}
