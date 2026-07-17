"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  DEFAULT_REGION,
  REGION_STORAGE_KEY,
  RegionCode,
  isRegionCode,
  regionFromLocale,
  regionFromTimezone,
} from "@/utils/region";

function detectBrowserRegion(): RegionCode | null {
  if (typeof window === "undefined") return null;
  try {
    const locale = window.navigator.language;
    const fromLocale = locale ? regionFromLocale(locale) : null;
    if (fromLocale) return fromLocale;

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const fromTimezone = timezone ? regionFromTimezone(timezone) : null;
    if (fromTimezone) return fromTimezone;
  } catch {
    // Intl/navigator unavailable — fall through to default.
  }
  return null;
}

export function useRegion() {
  const searchParams = useSearchParams();
  const urlRegion = searchParams.get("region")?.toUpperCase();
  const [savedRegion, setSavedRegion] = useLocalStorage<RegionCode | null>(
    REGION_STORAGE_KEY,
    null
  );
  const [region, setRegionState] = useState<RegionCode>(DEFAULT_REGION);

  useEffect(() => {
    if (isRegionCode(urlRegion)) {
      setRegionState(urlRegion);
      setSavedRegion(urlRegion);
      return;
    }
    if (isRegionCode(savedRegion)) {
      setRegionState(savedRegion);
      return;
    }
    const detected = detectBrowserRegion();
    if (detected) {
      setRegionState(detected);
      setSavedRegion(detected);
    }
    // Otherwise stays at DEFAULT_REGION (Global/USD).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlRegion]);

  const setRegion = (next: RegionCode) => {
    setRegionState(next);
    setSavedRegion(next);
  };

  return { region, setRegion };
}
