"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, Loader2 } from "lucide-react";
import { PENDING_PLAN_KEY, type PendingPlan } from "@/utils/pending-plan";

const RATE_PER_SESSION = 1000;
const WEEKS_PER_MONTH = 4;

const CYCLE_DISCOUNTS: Record<number, number> = { 1: 0, 3: 10, 6: 20, 12: 30 };
const CYCLE_NAMES: Record<number, string> = {
  1: "Monthly",
  3: "Quarterly",
  6: "Semi-Annual",
  12: "Annual",
};

interface SubscribeConfirmClientProps {
  userEmail: string;
  userPhone: string | null;
}

export function SubscribeConfirmClient({ userEmail, userPhone }: SubscribeConfirmClientProps) {
  const [pendingPlan, setPendingPlan] = useState<PendingPlan | null | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PENDING_PLAN_KEY);
      if (!raw) {
        setPendingPlan(null);
        return;
      }
      const parsed = JSON.parse(raw);
      if (
        typeof parsed.sessionsPerWeek === "number" &&
        typeof parsed.billingCycle === "number" &&
        CYCLE_DISCOUNTS[parsed.billingCycle] !== undefined
      ) {
        setPendingPlan(parsed);
      } else {
        setPendingPlan(null);
      }
    } catch {
      setPendingPlan(null);
    }
  }, []);

  const handleSendLink = async () => {
    if (!pendingPlan) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/subscriptions/create-dynamic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pendingPlan),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        toast.error(data.error || "Failed to send payment link");
        return;
      }

      localStorage.removeItem(PENDING_PLAN_KEY);
      setSuccessMessage(data.message);
      toast.success("Payment link sent!");
    } catch (error) {
      console.error("Error creating dynamic subscription:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Still reading from localStorage
  if (pendingPlan === undefined) {
    return null;
  }

  if (successMessage) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BadgeCheck className="h-6 w-6 text-primary" />
            Payment Link Sent
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{successMessage}</p>
          <Button asChild className="w-full">
            <Link href="/settings/subscription">Go to My Subscription</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!pendingPlan) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">No Plan Selected</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Choose your sessions per week and billing cycle on the Fitness Training page first.
          </p>
          <Button asChild className="w-full">
            <Link href="/programs/fitness-training">Choose a Plan</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { sessionsPerWeek, billingCycle } = pendingPlan;
  const weeksInCycle = billingCycle * WEEKS_PER_MONTH;
  const totalSessions = sessionsPerWeek * weeksInCycle;
  const discount = CYCLE_DISCOUNTS[billingCycle];
  const originalPrice = totalSessions * RATE_PER_SESSION;
  const discountedPrice = Math.round(originalPrice * (1 - discount / 100));

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">Confirm Your Plan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-baseline gap-2">
            {discount > 0 && (
              <span className="text-lg font-medium text-muted-foreground line-through">
                ₹{originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-3xl font-medium text-primary">
              ₹{discountedPrice.toLocaleString()}
            </span>
          </div>
          <p className="text-sm font-medium text-muted-foreground mt-2">
            {totalSessions} sessions ({sessionsPerWeek}/week × {weeksInCycle} weeks) ·{" "}
            {CYCLE_NAMES[billingCycle]}
            {discount > 0 && ` · ${discount}% off`}
          </p>
        </div>

        {!userPhone && (
          <p className="text-sm text-destructive">
            Add a phone number in your{" "}
            <Link href="/settings" className="underline">
              profile settings
            </Link>{" "}
            first — Razorpay needs it to send your payment link.
          </p>
        )}

        <div className="text-sm text-muted-foreground">
          The payment link will be sent to <span className="font-medium text-foreground">{userEmail}</span>
          {userPhone && <> and <span className="font-medium text-foreground">{userPhone}</span></>}.
        </div>

        <Button
          onClick={handleSendLink}
          disabled={isSubmitting || !userPhone}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Me the Payment Link"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
