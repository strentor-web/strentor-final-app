// Server-only. Reads the live FX rate cached by
// /api/cron/refresh-fx-rates, falling back to the static illustrative
// rate in utils/pppPricing.ts (FX_RATES) if the cache is empty or stale.
// Currently only INR matters here for real settlement — Razorpay is the
// only provider whose charge currency isn't USD. AED is a hard currency
// peg (doesn't need a live feed) and PayPal always settles in USD.

import prisma from "@/utils/prisma/prismaClient";
import { FX_RATES, PppCurrency } from "@/utils/pppPricing";

const STALE_AFTER_MS = 36 * 60 * 60 * 1000; // 36h — comfortably covers a missed daily cron run

export async function getEffectiveFxRate(currency: PppCurrency): Promise<{ rate: number; live: boolean }> {
  try {
    const cached = await prisma.fx_rate_cache.findUnique({ where: { currency } });
    if (cached && Date.now() - cached.fetched_at.getTime() < STALE_AFTER_MS) {
      return { rate: Number(cached.rate_to_usd), live: true };
    }
  } catch (error) {
    console.error(`Failed to read cached FX rate for ${currency}:`, error);
  }
  return { rate: FX_RATES[currency], live: false };
}
