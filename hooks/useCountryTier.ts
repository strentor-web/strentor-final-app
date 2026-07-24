"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getPppTier, getPppMultiplier, PppTier } from "@/utils/pppPricing";

const COUNTRY_STORAGE_KEY = "strentor_country";

// Best-effort client-side country detection for PPP pricing — the region
// subtag of the browser's locale (e.g. "en-GB" -> "GB", "fr-CA" -> "CA")
// generally lines up with the visitor's actual country far more often than
// not, without needing an IP-geolocation service. Not authoritative (VPNs,
// travelers, misconfigured browsers) — same "illustrative, not perfect"
// tradeoff already accepted elsewhere in this app (see useRegion()).
function detectCountryCode(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const locale = window.navigator.language;
    if (!locale) return null;
    // "en-GB" -> "GB"; "en" (no region subtag) -> null.
    const parts = locale.split("-");
    const region = parts.length > 1 ? parts[parts.length - 1] : null;
    if (region && /^[A-Za-z]{2}$/.test(region)) {
      return region.toUpperCase();
    }
  } catch {
    // navigator unavailable — fall through to null.
  }
  return null;
}

export function useCountryTier(): { countryCode: string | null; tier: PppTier; multiplier: number } {
  const searchParams = useSearchParams();
  const urlCountry = searchParams.get("country")?.toUpperCase() ?? null;
  const [savedCountry, setSavedCountry] = useLocalStorage<string | null>(COUNTRY_STORAGE_KEY, null);
  const [countryCode, setCountryCode] = useState<string | null>(null);

  useEffect(() => {
    if (urlCountry && /^[A-Z]{2}$/.test(urlCountry)) {
      setCountryCode(urlCountry);
      setSavedCountry(urlCountry);
      return;
    }
    if (savedCountry) {
      setCountryCode(savedCountry);
      return;
    }
    const detected = detectCountryCode();
    if (detected) {
      setCountryCode(detected);
      setSavedCountry(detected);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlCountry]);

  return {
    countryCode,
    tier: getPppTier(countryCode),
    multiplier: getPppMultiplier(countryCode),
  };
}
