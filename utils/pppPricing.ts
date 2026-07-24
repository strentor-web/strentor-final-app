// Purchasing-power-parity style tiered pricing, applied globally — every
// price on the site is the canonical USD base times a location's tier
// multiplier times a customer segment's multiplier, converted into the
// customer's display currency. Three inputs decide a price:
//
//   1. Country            (required)   — COUNTRY_TIERS
//   2. City / region      (optional)   — CITY_TIER_OVERRIDES, layered on
//                                         top of the country's tier
//   3. Customer segment   (optional)   — SEGMENT_MULTIPLIERS, layered on
//                                         top of the location tier
//
// Tier scale (5 bands, matching a Tier A-E purchasing-power framework):
//   1 = A = Premium   (very high purchasing power — priced ABOVE the
//                       standard rate, not just "full price")
//   2 = B = Standard  (the baseline "full price" rate)
//   3 = C = Mid
//   4 = D = Lower
//   5 = E = Emerging  (deepest discount)
//
// Fixed, hand-curated assignments (broadly following World Bank
// income-group / GNI-per-capita groupings, plus well-known cost-of-living
// disparities within large countries) rather than a live PPP index, FX
// feed, or inflation-adjusted lookup — this is a static, illustrative
// table, not a connection to World Bank/IMF/OECD data or any real-time
// economic indicator. It intentionally does not cover every city on
// earth — no hand-curated table can — unlisted cities/regions fall back
// to their country's tier. Extend COUNTRY_TIERS / CITY_TIER_OVERRIDES
// directly to add more locations.
//
// Isomorphic (no browser-only APIs) — used both client-side (to display a
// price) and server-side (to authoritatively compute the amount actually
// charged; the server never trusts a client-supplied price).

export type PppTier = 1 | 2 | 3 | 4 | 5;

export const TIER_MULTIPLIERS: Record<PppTier, number> = {
  1: 1.15, // Premium / Band A
  2: 1.0, // Standard / Band B
  3: 0.75, // Mid / Band C
  4: 0.5, // Lower / Band D
  5: 0.3, // Emerging / Band E
};

export const TIER_LABELS: Record<PppTier, string> = {
  1: "Premium",
  2: "Standard",
  3: "Mid",
  4: "Lower",
  5: "Emerging",
};

const DEFAULT_TIER: PppTier = 2;

// ISO 3166-1 alpha-2 country codes. Unlisted countries fall back to Tier 2
// (standard/full price) — a conservative default that neither under- nor
// over-charges an unrecognized market.
export const COUNTRY_TIERS: Record<string, PppTier> = {
  // Tier 1 (A) — small, exceptionally high-purchasing-power markets.
  CH: 1, LU: 1, NO: 1, QA: 1, AE: 1, SG: 1, IS: 1,

  // Tier 2 (B) — standard full price.
  US: 2, CA: 2, GB: 2, AU: 2, NZ: 2, IE: 2, DE: 2, FR: 2, NL: 2, BE: 2,
  AT: 2, SE: 2, DK: 2, FI: 2, KW: 2, SA: 2, BH: 2, IL: 2, JP: 2, KR: 2,
  HK: 2,

  // Tier 3 (C).
  ES: 3, IT: 3, PT: 3, GR: 3, CY: 3, MT: 3, PL: 3, CZ: 3, SK: 3, SI: 3,
  EE: 3, LV: 3, LT: 3, HR: 3, RU: 3, TR: 3, CN: 3, TW: 3, MY: 3, CL: 3,
  UY: 3, OM: 3, PA: 3,

  // Tier 4 (D). India included here alongside peer lower-middle-income
  // economies (Vietnam, Philippines, Indonesia, Egypt).
  MX: 4, BR: 4, AR: 4, CO: 4, PE: 4, ZA: 4, TH: 4, ID: 4, VN: 4, PH: 4,
  LK: 4, EG: 4, MA: 4, JO: 4, UA: 4, CR: 4, DO: 4, KZ: 4, IN: 4,

  // Tier 5 (E).
  PK: 5, BD: 5, NG: 5, KE: 5, ET: 5, NP: 5, MM: 5, KH: 5, UZ: 5, GH: 5,
  TZ: 5, ZW: 5, UG: 5, ZM: 5, SN: 5, CI: 5, LA: 5, YE: 5, AF: 5, SD: 5,
};

// City/region overrides — layered on top of a country's base tier for
// well-known, large within-country purchasing-power gaps. Keys are
// "<ISO country code>|<normalized city/region name>". Not exhaustive by
// design (see file header); covers major metros across ~20 countries.
export const CITY_TIER_OVERRIDES: Record<string, PppTier> = {
  // United States (country baseline: 2)
  "US|new york": 1, "US|new york city": 1, "US|nyc": 1,
  "US|san francisco": 1, "US|sf": 1, "US|bay area": 1,
  "US|los angeles": 1, "US|la": 1,
  "US|seattle": 1, "US|boston": 1, "US|washington dc": 1, "US|washington": 1,
  "US|san jose": 1,
  "US|austin": 2, "US|chicago": 2, "US|miami": 2, "US|denver": 2, "US|san diego": 2,
  "US|detroit": 3, "US|cleveland": 3, "US|st louis": 3, "US|memphis": 3,
  "US|rural midwest": 3, "US|midwest": 3,

  // India (country baseline: 4)
  "IN|mumbai": 3, "IN|south mumbai": 2, "IN|bandra": 2, "IN|navi mumbai": 4, "IN|thane": 4,
  "IN|delhi": 3, "IN|delhi ncr": 3, "IN|new delhi": 3, "IN|gurgaon": 3, "IN|gurugram": 3, "IN|noida": 4,
  "IN|bengaluru": 3, "IN|bangalore": 3,
  "IN|hyderabad": 3, "IN|pune": 3, "IN|chennai": 3,
  "IN|kolkata": 4, "IN|ahmedabad": 4, "IN|chandigarh": 4,
  "IN|jaipur": 5, "IN|lucknow": 5, "IN|indore": 5, "IN|kochi": 5, "IN|coimbatore": 5,
  "IN|tier 2": 5, "IN|tier 3": 5, "IN|tier-2": 5, "IN|tier-3": 5,

  // United Kingdom (country baseline: 2)
  "GB|london": 1, "GB|manchester": 2, "GB|birmingham": 3, "GB|edinburgh": 2, "GB|glasgow": 3,

  // UAE (country baseline: 1)
  "AE|dubai": 1, "AE|abu dhabi": 1, "AE|sharjah": 2,

  // Australia (country baseline: 2)
  "AU|sydney": 1, "AU|melbourne": 1, "AU|perth": 2, "AU|brisbane": 2, "AU|adelaide": 3,

  // Canada (country baseline: 2)
  "CA|toronto": 1, "CA|vancouver": 1, "CA|montreal": 2, "CA|calgary": 2,

  // Germany (country baseline: 2)
  "DE|munich": 1, "DE|münchen": 1, "DE|frankfurt": 1, "DE|berlin": 2, "DE|hamburg": 2,

  // France (country baseline: 2)
  "FR|paris": 1, "FR|lyon": 2, "FR|marseille": 2,

  // Japan (country baseline: 2)
  "JP|tokyo": 1, "JP|osaka": 2, "JP|kyoto": 2,

  // China (country baseline: 3)
  "CN|shanghai": 2, "CN|beijing": 2, "CN|shenzhen": 2, "CN|guangzhou": 3,

  // Brazil (country baseline: 4)
  "BR|sao paulo": 3, "BR|são paulo": 3, "BR|rio de janeiro": 3,

  // Mexico (country baseline: 4)
  "MX|mexico city": 3, "MX|cdmx": 3, "MX|monterrey": 3,

  // South Africa (country baseline: 4)
  "ZA|cape town": 3, "ZA|johannesburg": 3,

  // Netherlands (country baseline: 2)
  "NL|amsterdam": 1,

  // Ireland (country baseline: 2)
  "IE|dublin": 1,

  // Israel (country baseline: 2)
  "IL|tel aviv": 1,

  // Switzerland (country baseline: 1)
  "CH|zurich": 1, "CH|zürich": 1, "CH|geneva": 1,

  // Singapore is a city-state — no sub-division needed (whole country: 1).

  // Indonesia (country baseline: 4)
  "ID|jakarta": 3,

  // Philippines (country baseline: 4)
  "PH|manila": 3,

  // Turkey (country baseline: 3)
  "TR|istanbul": 2,

  // Nigeria (country baseline: 5)
  "NG|lagos": 4,

  // Kenya (country baseline: 5)
  "KE|nairobi": 4,

  // Egypt (country baseline: 4)
  "EG|cairo": 3,
};

function normalizeCity(city: string): string {
  return city.trim().toLowerCase().replace(/\s+/g, " ");
}

export function isKnownCountryCode(code: string | null | undefined): boolean {
  return !!code && code.toUpperCase() in COUNTRY_TIERS;
}

export function getPppTier(countryCode: string | null | undefined, city?: string | null): PppTier {
  const country = countryCode?.toUpperCase();
  if (country && city) {
    const key = `${country}|${normalizeCity(city)}`;
    const override = CITY_TIER_OVERRIDES[key];
    if (override) return override;
  }
  if (!country) return DEFAULT_TIER;
  return COUNTRY_TIERS[country] ?? DEFAULT_TIER;
}

export function getPppMultiplier(countryCode: string | null | undefined, city?: string | null): number {
  return TIER_MULTIPLIERS[getPppTier(countryCode, city)];
}

// ---------------------------------------------------------------------------
// Customer segments (see Section 3 of the pricing framework) — layered
// multiplicatively on top of the location multiplier above. Sponsored
// segments (corporate/government/NGO/insurance) are deliberately NOT
// self-serve priced — real sponsorship deals are negotiated, not
// formula-driven, so those route to a contact flow instead of checkout.
// ---------------------------------------------------------------------------

export const CUSTOMER_SEGMENTS = [
  "INDIVIDUAL",
  "STUDENT",
  "WORKING_PROFESSIONAL",
  "EXECUTIVE",
  "ENTREPRENEUR",
  "ATHLETE",
  "CORPORATE_EMPLOYEE",
  "VETERAN",
  "PARALYMPIAN",
  "CORPORATE_SPONSORED",
  "GOVERNMENT_SPONSORED",
  "NGO_SPONSORED",
  "INSURANCE_SPONSORED",
] as const;

export type CustomerSegment = (typeof CUSTOMER_SEGMENTS)[number];

export const SEGMENT_LABELS: Record<CustomerSegment, string> = {
  INDIVIDUAL: "Individual",
  STUDENT: "Student",
  WORKING_PROFESSIONAL: "Working Professional",
  EXECUTIVE: "Executive",
  ENTREPRENEUR: "Entrepreneur",
  ATHLETE: "Athlete",
  CORPORATE_EMPLOYEE: "Corporate Employee (self-paying)",
  VETERAN: "Veteran",
  PARALYMPIAN: "Paralympian",
  CORPORATE_SPONSORED: "Corporate Sponsored",
  GOVERNMENT_SPONSORED: "Government Sponsored",
  NGO_SPONSORED: "NGO Sponsored",
  INSURANCE_SPONSORED: "Insurance Sponsored",
};

// Multiplier applied on top of the location multiplier. Segments not
// listed here (the four *_SPONSORED ones) never reach this — see
// isSponsoredSegment below.
const SEGMENT_MULTIPLIERS: Record<string, number> = {
  INDIVIDUAL: 1,
  STUDENT: 0.85,
  WORKING_PROFESSIONAL: 1,
  EXECUTIVE: 1.15,
  ENTREPRENEUR: 1.05,
  ATHLETE: 1,
  CORPORATE_EMPLOYEE: 1,
  VETERAN: 0.8,
  PARALYMPIAN: 0.7,
};

export function isSponsoredSegment(segment: string | null | undefined): boolean {
  return segment === "CORPORATE_SPONSORED" ||
    segment === "GOVERNMENT_SPONSORED" ||
    segment === "NGO_SPONSORED" ||
    segment === "INSURANCE_SPONSORED";
}

export function isKnownSegment(segment: string | null | undefined): segment is CustomerSegment {
  return !!segment && (CUSTOMER_SEGMENTS as readonly string[]).includes(segment);
}

// Returns 1 (no adjustment) for an unknown or sponsored segment — sponsored
// segments should never reach a price calculation at all (callers must
// check isSponsoredSegment first and route to the contact flow instead).
export function getSegmentMultiplier(segment: string | null | undefined): number {
  if (!segment) return 1;
  return SEGMENT_MULTIPLIERS[segment] ?? 1;
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
