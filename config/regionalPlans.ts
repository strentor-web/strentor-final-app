import { getPppMultiplier, getCurrencyForCountry, convertFromUsd, roundNicely, CURRENCY_SYMBOLS, PppCurrency } from "@/utils/pppPricing";

export interface RegionalPlan {
  id: string;
  name: string;
  positioning: string;
  frequency: string;
  description: string;
  features: string[];
  href: string;
  // Canonical USD (Tier 1 / full price) base — a single number for a flat
  // price, or [min, max] for a range. Every displayed price is derived
  // from this via the same PPP-tier + currency system used everywhere
  // else on the site (see utils/pppPricing.ts). Not a live checkout —
  // these are marketing/comparison pages — so treat the numbers as
  // illustrative starting points, per the disclaimer shown alongside them.
  basePriceUSD: number | [number, number];
  suffix?: string;
}

export const regionalPlans: RegionalPlan[] = [
  {
    id: "starter-kit",
    name: "7-Day Starter Kit",
    positioning: "A safe, structured first experience of STRENTOR coaching.",
    frequency: "One-time",
    description:
      "A low-commitment way to experience adaptive, health-respecting coaching before enrolling in a full program.",
    features: [
      "7 days of guided adaptive sessions",
      "Baseline readiness check-in",
      "Starter nutrition context",
      "Direct access to a STRENTOR coach",
    ],
    href: "/programs/starter-kit",
    basePriceUSD: 49,
  },
  {
    id: "flagship-transformation",
    name: "8-Week Flagship Transformation",
    positioning: "Our core coached program — strength, nutrition, and mindset.",
    frequency: "8-week program",
    description:
      "A structured, four-phase coaching program covering strength, nutrition context, mindset, and habit formation.",
    features: [
      "Weekly 1:1 coaching",
      "Custom adaptive training plan",
      "Nutrition context guidance",
      "Progress tracking and check-ins",
    ],
    href: "/programs/flagship-transformation",
    basePriceUSD: [799, 1499],
  },
  {
    id: "elite-mentorship",
    name: "12-Week Elite Mentorship",
    positioning: "High-touch, deeply personalized mentorship.",
    frequency: "12-week program",
    description:
      "Direct, high-touch access to STRENTOR's founder for clients who want the most intensive level of support.",
    features: [
      "Direct founder access",
      "Highly personalized programming",
      "Priority scheduling",
      "Ongoing mindset and discipline coaching",
    ],
    href: "/programs/elite-mentorship",
    basePriceUSD: [1999, 4999],
  },
  {
    id: "membership",
    name: "Strength Circle Membership",
    positioning: "Ongoing community, coaching, and accountability.",
    frequency: "Monthly",
    description:
      "A recurring membership for ongoing group coaching, an adaptive workout library, and community accountability.",
    features: [
      "Adaptive workout library",
      "Monthly group coaching",
      "Community and accountability",
      "Move up or down tiers anytime",
    ],
    href: "/programs/membership",
    basePriceUSD: [59, 179],
    suffix: "/mo",
  },
];

// Renders a plan's basePriceUSD for a given country: a PPP-tier multiplier
// applied to the USD base, converted into that country's currency
// (config/regionalPlans.ts's own SGD mapping — see the comment on
// getCurrencyForCountry for why the live checkout doesn't use SGD).
function currencyForRegionalDisplay(countryCode: string | null | undefined): PppCurrency {
  if (countryCode?.toUpperCase() === "SG") return "SGD";
  return getCurrencyForCountry(countryCode);
}

export function formatRegionalPlanPrice(plan: RegionalPlan, countryCode: string | null | undefined): string {
  const multiplier = getPppMultiplier(countryCode);
  const currency = currencyForRegionalDisplay(countryCode);
  const symbol = CURRENCY_SYMBOLS[currency];

  const toDisplay = (usd: number) => {
    const tiered = usd * multiplier;
    const converted = currency === "USD" ? tiered : convertFromUsd(tiered, currency);
    return roundNicely(converted).toLocaleString();
  };

  const suffix = plan.suffix ?? "";

  if (Array.isArray(plan.basePriceUSD)) {
    const [min, max] = plan.basePriceUSD;
    return `${symbol}${toDisplay(min)}–${symbol}${toDisplay(max)}${suffix}`;
  }

  return `${symbol}${toDisplay(plan.basePriceUSD)}${suffix}`;
}
