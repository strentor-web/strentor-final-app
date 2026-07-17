export const REGIONS = ["IN", "SG", "AE", "US"] as const;
export type RegionCode = (typeof REGIONS)[number];

export const DEFAULT_REGION: RegionCode = "US";

export const REGION_CONFIG: Record<
  RegionCode,
  { label: string; currency: string; symbol: string }
> = {
  IN: { label: "India", currency: "INR", symbol: "₹" },
  SG: { label: "Singapore", currency: "SGD", symbol: "S$" },
  AE: { label: "UAE", currency: "AED", symbol: "AED " },
  US: { label: "Global", currency: "USD", symbol: "$" },
};

export function isRegionCode(value: string | null | undefined): value is RegionCode {
  return !!value && (REGIONS as readonly string[]).includes(value);
}

// Maps a subset of common locale/timezone signals to a supported region.
// Anything unrecognized falls through to the Global/USD default.
export function regionFromLocale(locale: string): RegionCode | null {
  const lower = locale.toLowerCase();
  if (lower.includes("in") && (lower.startsWith("en-in") || lower.startsWith("hi"))) return "IN";
  if (lower.startsWith("en-sg") || lower.startsWith("zh-sg")) return "SG";
  if (lower.startsWith("ar-ae") || lower.startsWith("en-ae")) return "AE";
  return null;
}

export function regionFromTimezone(timezone: string): RegionCode | null {
  if (timezone === "Asia/Kolkata" || timezone === "Asia/Calcutta") return "IN";
  if (timezone === "Asia/Singapore") return "SG";
  if (timezone === "Asia/Dubai") return "AE";
  return null;
}

export const REGION_STORAGE_KEY = "strentor_region";
