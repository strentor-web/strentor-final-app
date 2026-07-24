// Purchasing-power-parity style tiered pricing, applied universally — every
// price on the site (Fitness recurring/Lifetime pricing, and the
// /programs offer-ladder) is the canonical USD Tier-1 price times a
// country's tier multiplier, converted into that country's display
// currency. India is included like any other country (see COUNTRY_TIERS)
// rather than having its own separately hand-set price table.
//
// Fixed, illustrative tier assignments per country (broadly following
// World Bank income-group / GNI-per-capita groupings) rather than a live
// PPP index lookup — same "fixed, hand-picked, not a live conversion"
// pattern already used elsewhere in this app. Review and adjust for your
// actual desired regional pricing.
//
// Isomorphic (no browser-only APIs) — used both client-side (to display a
// price) and server-side (to authoritatively compute the amount actually
// charged; the server never trusts a client-supplied price).

export type PppTier = 1 | 2 | 3 | 4;

export const TIER_MULTIPLIERS: Record<PppTier, number> = {
  1: 1,
  2: 0.75,
  3: 0.5,
  4: 0.3,
};

const DEFAULT_TIER: PppTier = 1;

// ISO 3166-1 alpha-2 country codes. Unlisted countries fall back to Tier 1
// (full price) — a conservative default that never under-charges.
export const COUNTRY_TIERS: Record<string, PppTier> = {
  // Tier 1 — full price
  US: 1, CA: 1, GB: 1, AU: 1, NZ: 1, IE: 1, DE: 1, FR: 1, NL: 1, BE: 1,
  LU: 1, AT: 1, CH: 1, SE: 1, NO: 1, DK: 1, FI: 1, IS: 1, SG: 1, AE: 1,
  QA: 1, KW: 1, SA: 1, BH: 1, IL: 1, JP: 1, KR: 1, HK: 1,

  // Tier 2 — 75% of full price
  ES: 2, IT: 2, PT: 2, GR: 2, CY: 2, MT: 2, PL: 2, CZ: 2, SK: 2, SI: 2,
  EE: 2, LV: 2, LT: 2, HR: 2, RU: 2, TR: 2, CN: 2, TW: 2, MY: 2, CL: 2,
  UY: 2, OM: 2, PA: 2,

  // Tier 3 — 50% of full price. India included here alongside peer
  // lower-middle-income economies (Vietnam, Philippines, Indonesia, Egypt).
  MX: 3, BR: 3, AR: 3, CO: 3, PE: 3, ZA: 3, TH: 3, ID: 3, VN: 3, PH: 3,
  LK: 3, EG: 3, MA: 3, JO: 3, UA: 3, CR: 3, DO: 3, KZ: 3, IN: 3,

  // Tier 4 — 30% of full price
  PK: 4, BD: 4, NG: 4, KE: 4, ET: 4, NP: 4, MM: 4, KH: 4, UZ: 4, GH: 4,
  TZ: 4, ZW: 4, UG: 4, ZM: 4, SN: 4, CI: 4, LA: 4, YE: 4, AF: 4, SD: 4,
};

export function isKnownCountryCode(code: string | null | undefined): boolean {
  return !!code && code.toUpperCase() in COUNTRY_TIERS;
}

export function getPppTier(countryCode: string | null | undefined): PppTier {
  if (!countryCode) return DEFAULT_TIER;
  return COUNTRY_TIERS[countryCode.toUpperCase()] ?? DEFAULT_TIER;
}

export function getPppMultiplier(countryCode: string | null | undefined): number {
  return TIER_MULTIPLIERS[getPppTier(countryCode)];
}

// ---------------------------------------------------------------------------
// Display/settlement currency per country, and USD conversion.
// ---------------------------------------------------------------------------

export type PppCurrency = "USD" | "INR" | "AED" | "SGD";

// Used by the real checkout flow (Fitness/Lifetime pricing) — only India
// and the UAE get a dedicated local display currency there; every other
// country displays (and, via PayPal, is actually charged) in USD. Razorpay
// only ever settles in INR, so India's currency here is also its real
// settlement currency, not just a display conversion.
//
// SGD exists in PppCurrency/FX_RATES/CURRENCY_SYMBOLS for the
// display-only /plans-pricing marketing page (config/regionalPlans.ts),
// which has no live checkout — this function deliberately does NOT map SG
// to SGD, so the real checkout keeps showing Singapore customers the same
// USD figure PayPal actually charges them.
export function getCurrencyForCountry(countryCode: string | null | undefined): PppCurrency {
  const code = countryCode?.toUpperCase();
  if (code === "IN") return "INR";
  if (code === "AE") return "AED";
  return "USD";
}

export const CURRENCY_SYMBOLS: Record<PppCurrency, string> = {
  USD: "$",
  INR: "₹",
  AED: "AED ",
  SGD: "S$",
};

// Fixed reference exchange rates — not live. Illustrative, rounded figures
// for INR and SGD, but a real, unmoving fact for AED: the UAE Central Bank
// has hard-pegged AED to USD at this rate since 1997.
export const FX_RATES: Record<PppCurrency, number> = {
  USD: 1,
  INR: 83,
  AED: 3.6725,
  SGD: 1.34,
};

export function convertFromUsd(usdAmount: number, currency: PppCurrency): number {
  return usdAmount * FX_RATES[currency];
}

// Rounds to a clean "…9"-ending figure (₹499, $1,799, AED 249) in whatever
// currency it's given, matching the hand-picked price style used
// throughout this app before PPP tiering existed.
export function roundNicely(amount: number): number {
  if (amount < 50) return Math.max(1, Math.round(amount));
  return Math.round(amount / 10) * 10 - 1;
}

// AED-specific helper retained for callers that only ever need a USD->AED
// conversion (e.g. displaying "charged as $X, shown as AED Y").
export function usdToAed(usdAmount: number): number {
  return Math.round(convertFromUsd(usdAmount, "AED"));
}
