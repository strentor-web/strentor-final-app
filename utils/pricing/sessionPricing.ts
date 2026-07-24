// Single source of truth for STRENTOR's per-session Fitness pricing model.
// Previously this rate table, sessions/week bounds, and billing-cycle
// discount table were hand-copied across FitnessPricing.tsx,
// landing/Pricing.tsx, settings-pricing-section.tsx, and
// app/api/subscriptions/ensure-plan/route.ts — a change to one wouldn't
// reach the others. Import from here instead of redeclaring these values.

export type TrainingPlanType = "ONLINE" | "SELF_PACED";

export const RATE_PER_SESSION: Record<TrainingPlanType, number> = {
  ONLINE: 1000,
  SELF_PACED: 500,
};

export const PLAN_TYPE_LABELS: Record<TrainingPlanType, string> = {
  ONLINE: "Trainer-Led",
  SELF_PACED: "Self-Paced",
};

export const MIN_SESSIONS_PER_WEEK = 3;
export const MAX_SESSIONS_PER_WEEK = 5;
export const DEFAULT_SESSIONS_PER_WEEK = 3;
export const WEEKS_PER_MONTH = 4;

export interface BillingOption {
  label: string;
  value: number; // months
  discount: number; // percent
}

export const billingOptions: BillingOption[] = [
  { label: "Monthly", value: 1, discount: 0 },
  { label: "Quarterly", value: 3, discount: 10 },
  { label: "Semi-Annual", value: 6, discount: 20 },
  { label: "Annual", value: 12, discount: 30 },
];

export const CYCLE_DISCOUNTS: Record<number, number> = Object.fromEntries(
  billingOptions.map((o) => [o.value, o.discount])
);

export const CYCLE_LABELS: Record<number, string> = {
  1: "monthly",
  3: "quarterly",
  6: "semi_annual",
  12: "annual",
};

export interface CyclePriceBreakdown {
  totalSessions: number;
  originalAmount: number;
  discountedAmount: number;
}

export function calculateCyclePrice(
  sessionsPerWeek: number,
  billingCycleMonths: number,
  planType: TrainingPlanType
): CyclePriceBreakdown {
  const discount = CYCLE_DISCOUNTS[billingCycleMonths] ?? 0;
  const totalSessions = sessionsPerWeek * billingCycleMonths * WEEKS_PER_MONTH;
  const originalAmount = totalSessions * RATE_PER_SESSION[planType];
  const discountedAmount = Math.round(originalAmount * (1 - discount / 100));
  return { totalSessions, originalAmount, discountedAmount };
}

// Lifetime Membership — a one-time payment (Razorpay Order, not a recurring
// Subscription/Plan), priced at 3 years of the Annual (30%-off) rate for
// that sessions/week + training-mode combo, then no further billing ever.
// Fixed, hand-rounded price points rather than a live formula off
// RATE_PER_SESSION, since a "locked forever" price shouldn't silently
// shift if the base per-session rate ever changes.
export const LIFETIME_YEARS_EQUIVALENT = 3;

export const LIFETIME_PRICES: Record<TrainingPlanType, Record<number, number>> = {
  ONLINE: {
    3: 299999,
    4: 399999,
    5: 499999,
  },
  SELF_PACED: {
    3: 149999,
    4: 199999,
    5: 249999,
  },
};

export function getLifetimePrice(sessionsPerWeek: number, planType: TrainingPlanType): number | undefined {
  return LIFETIME_PRICES[planType]?.[sessionsPerWeek];
}

// Sentinel billing_cycle value for Lifetime subscription_plans rows. Never
// matches a real recurring cycle (1/3/6/12), so Lifetime rows are
// automatically excluded from every recurring-billing-cycle tab/filter
// without needing any changes to that matrix-rendering code.
export const LIFETIME_BILLING_CYCLE = 0;
export const LIFETIME_BILLING_PERIOD = "lifetime";

// USD pricing for PayPal (international / non-Indian customers). Fixed,
// hand-picked price points — not a live currency conversion off the INR
// rates above — matching the existing precedent in config/regionalPlans.ts
// of illustrative per-region prices rather than raw FX math.
export const RATE_PER_SESSION_USD: Record<TrainingPlanType, number> = {
  ONLINE: 12,
  SELF_PACED: 6,
};

export function calculateCyclePriceUSD(
  sessionsPerWeek: number,
  billingCycleMonths: number,
  planType: TrainingPlanType
): CyclePriceBreakdown {
  const discount = CYCLE_DISCOUNTS[billingCycleMonths] ?? 0;
  const totalSessions = sessionsPerWeek * billingCycleMonths * WEEKS_PER_MONTH;
  const originalAmount = totalSessions * RATE_PER_SESSION_USD[planType];
  const discountedAmount = Math.round(originalAmount * (1 - discount / 100));
  return { totalSessions, originalAmount, discountedAmount };
}

export const LIFETIME_PRICES_USD: Record<TrainingPlanType, Record<number, number>> = {
  ONLINE: {
    3: 3599,
    4: 4799,
    5: 5999,
  },
  SELF_PACED: {
    3: 1799,
    4: 2399,
    5: 2999,
  },
};

export function getLifetimePriceUSD(sessionsPerWeek: number, planType: TrainingPlanType): number | undefined {
  return LIFETIME_PRICES_USD[planType]?.[sessionsPerWeek];
}

// PPP-tier-adjusted USD pricing (see utils/pppPricing.ts) — applies a
// tier multiplier to the base USD price above, then rounds to a clean
// "…9"-ending number to match the hand-picked LIFETIME_PRICES_USD style.
function roundToNiceUsd(amount: number): number {
  return Math.max(1, Math.round(amount / 10) * 10 - 1);
}

export function calculateCyclePriceUSDForTier(
  sessionsPerWeek: number,
  billingCycleMonths: number,
  planType: TrainingPlanType,
  multiplier: number
): CyclePriceBreakdown {
  const base = calculateCyclePriceUSD(sessionsPerWeek, billingCycleMonths, planType);
  return {
    ...base,
    discountedAmount: roundToNiceUsd(base.discountedAmount * multiplier),
  };
}

export function getLifetimePriceUSDForTier(
  sessionsPerWeek: number,
  planType: TrainingPlanType,
  multiplier: number
): number | undefined {
  const base = getLifetimePriceUSD(sessionsPerWeek, planType);
  return base === undefined ? undefined : roundToNiceUsd(base * multiplier);
}
