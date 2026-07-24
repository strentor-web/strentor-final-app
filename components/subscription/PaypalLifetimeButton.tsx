"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { loadPaypalScript } from "@/utils/paypalClient";
import { toast } from "sonner";
import type { TrainingPlanType } from "@/utils/pricing/sessionPricing";

interface PaypalLifetimeButtonProps {
  sessionsPerWeek: number;
  planType: TrainingPlanType;
  countryCode: string | null;
  className?: string;
  onSuccess?: () => void;
}

// PayPal equivalent of LifetimeCheckoutButton. Renders PayPal's own Smart
// Button (a popup-based approval flow) instead of a themed <Button>, since
// PayPal's branding guidelines require using their button, not a lookalike.
export function PaypalLifetimeButton({ sessionsPerWeek, planType, countryCode, className, onSuccess }: PaypalLifetimeButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const loaded = await loadPaypalScript("capture");
      if (cancelled || !loaded || !containerRef.current || !window.paypal) return;

      containerRef.current.innerHTML = "";

      window.paypal
        .Buttons({
          style: { layout: "horizontal", color: "gold", label: "pay", height: 48 },
          createOrder: async () => {
            setIsProcessing(true);
            const response = await fetch("/api/paypal/lifetime/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sessionsPerWeek, planType, countryCode }),
            });

            if (response.status === 401) {
              router.push(`/sign-up?redirect=/settings`);
              throw new Error("Not signed in");
            }

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              toast.error(errorData.error || "Failed to start checkout");
              setIsProcessing(false);
              throw new Error(errorData.error || "Failed to start checkout");
            }

            const data = await response.json();
            return data.orderId;
          },
          onApprove: async (data: { orderID: string }) => {
            try {
              const response = await fetch("/api/paypal/lifetime/capture-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId: data.orderID }),
              });

              const result = await response.json();

              if (response.ok && result.status === "ok") {
                toast.success("Payment successful!", {
                  description: "Your Lifetime Membership is now active — welcome aboard.",
                  duration: 6000,
                });
                onSuccess?.();
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
            console.error("PayPal checkout error:", err);
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
  }, [sessionsPerWeek, planType, countryCode, router, onSuccess]);

  return (
    <div className={className}>
      {!isReady && <p className="text-center text-sm text-muted-foreground">Loading PayPal…</p>}
      {isProcessing && <p className="mb-2 text-center text-sm text-muted-foreground">Processing…</p>}
      <div ref={containerRef} />
    </div>
  );
}
