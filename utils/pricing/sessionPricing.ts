// Single source of truth for STRENTOR's per-session Fitness pricing model.
// Previously this rate table, sessions/week bounds, and billing-cycle
// discount table were hand-copied across FitnessPricing.tsx,
// landing/Pricing.tsx, settings-pricing-section.tsx, and
// app/api/subscriptions/ensure-plan/route.ts — a change to one wouldn't
// reach the others. Import from here instead of redeclaring these values.
//
// Every price is derived from ONE canonical USD (Tier 1 / full price) base
// — RATE_PER_SESSION_USD / LIFETIME_PRICES_USD below — run through the
// PPP-tier + currency conversion in utils/pppPricing.ts for whichever
// country is asking. There is no separately hand-set India/INR price table
// any more: India is just another country in that tier system (Tier 3).

import {
  getPppMultiplier,
  getSegmentMultiplier,
  getCurrencyForCountry,
  convertFromUsd,
  roundNicely,
  PppCurrency,
} from "@/utils/pppPricing";

export type TrainingPlanType = "ONLINE" | "SELF_PACED";

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

// Sentinel billing_cycle value for Lifetime subscription_plans rows. Never
// matches a real recurring cycle (1/3/6/12), so Lifetime rows are
// automatically excluded from every recurring-billing-cycle tab/filter
// without needing any changes to that matrix-rendering code.
export const LIFETIME_BILLING_CYCLE = 0;
export const LIFETIME_BILLING_PERIOD = "lifetime";
export const LIFETIME_YEARS_EQUIVALENT = 3;

// ---------------------------------------------------------------------------
// Canonical USD (Tier 1 / full price) base rates. Every other price on the
// site — every country, every currency — is derived from these two tables.
// ---------------------------------------------------------------------------

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

// Lifetime Membership — a one-time payment, priced at 3 years of the
// Annual (30%-off) rate for that sessions/week + training-mode combo, then
// no further billing ever. Fixed, hand-rounded price points rather than a
// live formula off RATE_PER_SESSION_USD, since a "locked forever" price
// shouldn't silently shift if the base per-session rate ever changes.
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

// ---------------------------------------------------------------------------
// PPP-tier-adjusted USD pricing (see utils/pppPricing.ts) — the USD base
// times a country's tier multiplier, still in USD. This is what a PayPal
// charge actually settles as, even for countries (like the UAE) whose
// display currency below isn't USD.
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Country-aware display/settlement pricing — the USD-tier price above,
// converted into that country's own currency (INR for India, AED for the
// UAE, USD for everyone else) and re-rounded to a clean figure in that
// currency. India's result here is also its real Razorpay settlement
// amount, not just a display conversion.
// ---------------------------------------------------------------------------

export interface CountryCyclePrice extends CyclePriceBreakdown {
  currency: PppCurrency;
}

// city and segment are optional refinements layered on top of the country
// tier (see utils/pppPricing.ts) — a free-text city/region name and one of
// CUSTOMER_SEGMENTS. Callers handling a sponsored segment must check
// isSponsoredSegment() themselves before calling this — sponsored pricing
// isn't a multiplier, it's a "route to a contact form instead" decision.
export function calculateCyclePriceForCountry(
  sessionsPerWeek: number,
  billingCycleMonths: number,
  planType: TrainingPlanType,
  countryCode: string | null | undefined,
  city?: string | null,
  segment?: string | null
): CountryCyclePrice {
  const multiplier = getPppMultiplier(countryCode, city) * getSegmentMultiplier(segment);
  const currency = getCurrencyForCountry(countryCode);
  const usd = calculateCyclePriceUSDForTier(sessionsPerWeek, billingCycleMonths, planType, multiplier);

  if (currency === "USD") {
    return { ...usd, currency };
  }

  return {
    totalSessions: usd.totalSessions,
    originalAmount: Math.round(convertFromUsd(usd.originalAmount, currency)),
    discountedAmount: roundNicely(convertFromUsd(usd.discountedAmount, currency)),
    currency,
  };
}

export function getLifetimePriceForCountry(
  sessionsPerWeek: number,
  planType: TrainingPlanType,
  countryCode: string | null | undefined,
  city?: string | null,
  segment?: string | null
): { amount: number; currency: PppCurrency } | undefined {
  const multiplier = getPppMultiplier(countryCode, city) * getSegmentMultiplier(segment);
  const currency = getCurrencyForCountry(countryCode);
  const usdAmount = getLifetimePriceUSDForTier(sessionsPerWeek, planType, multiplier);
  if (usdAmount === undefined) return undefined;

  const amount = currency === "USD" ? usdAmount : roundNicely(convertFromUsd(usdAmount, currency));
  return { amount, currency };
}
