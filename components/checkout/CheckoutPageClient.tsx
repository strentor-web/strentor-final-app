"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus, Check } from "lucide-react";
import { RecurringCheckoutButton } from "@/components/subscription/RecurringCheckoutButton";
import { LifetimeCheckoutButton } from "@/components/subscription/LifetimeCheckoutButton";
import {
  MIN_SESSIONS_PER_WEEK,
  MAX_SESSIONS_PER_WEEK,
  DEFAULT_SESSIONS_PER_WEEK,
  billingOptions,
  calculateCyclePrice,
  getLifetimePrice,
  TrainingPlanType,
} from "@/utils/pricing/sessionPricing";

type Tier = "recurring" | "lifetime";

function parseIntParam(value: string | null, fallback: number): number {
  const parsed = value ? parseInt(value, 10) : NaN;
  return Number.isNaN(parsed) ? fallback : parsed;
}

export default function CheckoutPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [sessionsPerWeek, setSessionsPerWeek] = useState(
    parseIntParam(searchParams.get("sessionsPerWeek"), DEFAULT_SESSIONS_PER_WEEK)
  );
  const [planType, setPlanType] = useState<TrainingPlanType>(
    searchParams.get("planType") === "SELF_PACED" ? "SELF_PACED" : "ONLINE"
  );
  const [tier, setTier] = useState<Tier>(searchParams.get("tier") === "lifetime" ? "lifetime" : "recurring");
  const [billingCycle, setBillingCycle] = useState(parseIntParam(searchParams.get("billingCycle"), 3));
  const [paymentProvider] = useState<"razorpay">("razorpay");

  const [stage, setStage] = useState<"form" | "starting" | "ready">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const adjustSessionsPerWeek = (delta: number) => {
    setSessionsPerWeek((prev) => Math.min(MAX_SESSIONS_PER_WEEK, Math.max(MIN_SESSIONS_PER_WEEK, prev + delta)));
  };

  const selectedBillingOption = billingOptions.find((o) => o.value === billingCycle) ?? billingOptions[1];
  const recurringPrice = calculateCyclePrice(sessionsPerWeek, selectedBillingOption.value, planType);
  const lifetimePrice = getLifetimePrice(sessionsPerWeek, planType);

  const contactValid = fullName.trim() && email.trim() && phone.trim();

  async function handleContinue() {
    if (!contactValid) return;
    setIsSubmitting(true);
    setStage("starting");
    try {
      const response = await fetch("/api/checkout/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          sessionsPerWeek,
          planType,
          tier,
          billingCycle: tier === "recurring" ? billingCycle : undefined,
          paymentProvider,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Something went wrong. Please try again.");
        setStage("form");
        return;
      }

      if (data.status === "existing_account") {
        toast.info("You already have an account", {
          description: "Sign in to continue to payment.",
        });
        router.push(data.redirectTo || "/sign-in");
        return;
      }

      setStage("ready");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      setStage("form");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-2xl px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-display text-foreground sm:text-4xl">Checkout</h1>
          <p className="mt-2 text-muted-foreground">
            No account needed to get started — enter your details and pay. We'll set up your account automatically.
          </p>
        </div>

        <div className="mt-10 space-y-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
          {/* Plan selection */}
          <div className="space-y-6">
            <div>
              <Label>Membership type</Label>
              <div className="mt-2 flex rounded-full border border-input p-1">
                {(["recurring", "lifetime"] as Tier[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    disabled={stage !== "form"}
                    onClick={() => setTier(value)}
                    className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                      tier === value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {value === "recurring" ? "Recurring Billing" : "Lifetime Membership"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Training mode</Label>
              <div className="mt-2 flex rounded-full border border-input p-1">
                {(["ONLINE", "SELF_PACED"] as TrainingPlanType[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    disabled={stage !== "form"}
                    onClick={() => setPlanType(value)}
                    className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                      planType === value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {value === "ONLINE" ? "Trainer-Led" : "Self-Paced"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="checkout-sessions">Sessions per week</Label>
              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => adjustSessionsPerWeek(-1)}
                  disabled={stage !== "form" || sessionsPerWeek <= MIN_SESSIONS_PER_WEEK}
                  aria-label="Decrease sessions per week"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-input text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <Input
                  id="checkout-sessions"
                  type="number"
                  readOnly
                  min={MIN_SESSIONS_PER_WEEK}
                  max={MAX_SESSIONS_PER_WEEK}
                  value={sessionsPerWeek}
                  className="w-20 text-center text-lg font-semibold"
                />
                <button
                  type="button"
                  onClick={() => adjustSessionsPerWeek(1)}
                  disabled={stage !== "form" || sessionsPerWeek >= MAX_SESSIONS_PER_WEEK}
                  aria-label="Increase sessions per week"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-input text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {tier === "recurring" && (
              <div>
                <Label>Billing cycle</Label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {billingOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      disabled={stage !== "form"}
                      onClick={() => setBillingCycle(option.value)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                        billingCycle === option.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price summary */}
            <div className="rounded-xl border border-[#C9A96A]/40 bg-[#C9A96A]/5 p-4 text-center">
              {tier === "recurring" ? (
                <>
                  <p className="text-2xl font-bold text-primary">₹{recurringPrice.discountedAmount.toLocaleString()}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {recurringPrice.totalSessions} sessions ({sessionsPerWeek}/week) · {selectedBillingOption.label}
                    {selectedBillingOption.discount > 0 && ` · ${selectedBillingOption.discount}% off`}
                  </p>
                </>
              ) : lifetimePrice !== undefined ? (
                <>
                  <p className="text-2xl font-bold text-primary">₹{lifetimePrice.toLocaleString()}</p>
                  <p className="mt-1 text-xs text-muted-foreground">One-time payment — no further billing, ever</p>
                </>
              ) : null}
            </div>
          </div>

          {/* Contact details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="checkout-name">Full name</Label>
              <Input id="checkout-name" value={fullName} disabled={stage !== "form"} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="checkout-email">Email</Label>
              <Input id="checkout-email" type="email" value={email} disabled={stage !== "form"} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="checkout-phone">Phone / WhatsApp</Label>
              <Input id="checkout-phone" value={phone} disabled={stage !== "form"} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>

          {/* Payment method */}
          <div>
            <Label>Payment method</Label>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-primary bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
                <Check className="h-4 w-4" />
                Razorpay
              </div>
              <div className="flex items-center justify-between gap-2 rounded-lg border border-border px-4 py-3 text-sm font-medium text-muted-foreground opacity-60">
                PayPal
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>

          {stage !== "ready" ? (
            <Button
              onClick={handleContinue}
              disabled={!contactValid || isSubmitting}
              className="w-full rounded-full bg-[#C9A96A] py-6 text-base text-black hover:bg-[#C9A96A]/90"
            >
              {isSubmitting ? "Preparing checkout…" : "Continue to Payment"}
            </Button>
          ) : tier === "recurring" ? (
            <RecurringCheckoutButton
              sessionsPerWeek={sessionsPerWeek}
              planType={planType}
              billingCycle={billingCycle}
              className="w-full rounded-full bg-[#C9A96A] py-6 text-base text-black hover:bg-[#C9A96A]/90"
              onSuccess={() => router.push("/onboarding")}
            />
          ) : (
            <LifetimeCheckoutButton
              sessionsPerWeek={sessionsPerWeek}
              planType={planType}
              className="w-full rounded-full bg-[#C9A96A] py-6 text-base text-black hover:bg-[#C9A96A]/90"
              onSuccess={() => router.push("/onboarding")}
            />
          )}

          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <a href="/terms-of-service" className="underline hover:text-[#C9A96A]">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy-policy" className="underline hover:text-[#C9A96A]">
              Privacy Policy
            </a>
            . We'll email you a link to set your password after checkout.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
