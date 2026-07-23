"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { loadRazorpayScript, openRazorpayCheckout } from "@/utils/razorpay";
import { toast } from "sonner";
import type { RazorpayResponse, RazorpayErrorResponse } from "@/utils/razorpay";
import type { TrainingPlanType } from "@/utils/pricing/sessionPricing";

interface LifetimeCheckoutButtonProps {
  sessionsPerWeek: number;
  planType: TrainingPlanType;
  className?: string;
  onSuccess?: () => void;
}

export function LifetimeCheckoutButton({ sessionsPerWeek, planType, className, onSuccess }: LifetimeCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePurchase = async () => {
    try {
      setIsLoading(true);

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway script");
        return;
      }

      const response = await fetch("/api/lifetime/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionsPerWeek, planType }),
      });

      if (response.status === 401) {
        router.push(`/sign-up?redirect=/settings`);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to start checkout");
        return;
      }

      const orderDetails = await response.json();

      const razorpay = await openRazorpayCheckout({
        key: orderDetails.key,
        order_id: orderDetails.orderId,
        amount: orderDetails.amount,
        currency: orderDetails.currency,
        name: orderDetails.name,
        description: orderDetails.description,
        prefill: orderDetails.prefill,
        notes: orderDetails.notes,
        handler: function (response: RazorpayResponse) {
          (async () => {
            try {
              const verificationResponse = await fetch("/api/lifetime/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });

              const verificationData = await verificationResponse.json();

              if (verificationResponse.ok && verificationData.status === "ok") {
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
            } catch (error) {
              toast.error("Payment verification pending", {
                description:
                  "We're manually verifying your payment. You'll receive confirmation via email within 10-15 minutes.",
                duration: 10000,
              });
            } finally {
              setIsLoading(false);
            }
          })();
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
          },
          onError: (error: RazorpayErrorResponse) => {
            toast.error("Payment failed", {
              description: error.error?.description || "Your payment could not be processed.",
            });
            setIsLoading(false);
          },
        },
      });

      razorpay.on("payment.failed", function (response: RazorpayErrorResponse) {
        toast.error("Payment failed", {
          description: response.error?.description || "Your payment could not be processed.",
          duration: 5000,
        });
        setIsLoading(false);
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to start checkout");
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePurchase}
      disabled={isLoading}
      className={className ?? "w-full bg-[#C9A96A] text-black hover:bg-[#C9A96A]/90"}
    >
      {isLoading ? "Processing..." : "Get Lifetime Access"}
    </Button>
  );
}
