import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma/prismaClient";

// Refreshes the live FX rate cache (fx_rate_cache) that
// utils/fxRates.ts reads from. Currently only INR matters for real
// settlement — Razorpay is the only provider whose charge currency isn't
// USD (AED is a hard peg, doesn't need a live feed; PayPal always settles
// in USD). Uses Frankfurter (frankfurter.app) — a free, no-key-required
// API serving ECB reference rates, updated on ECB business days.
const FRANKFURTER_URL = "https://api.frankfurter.app/latest?from=USD&to=INR";

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(FRANKFURTER_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Frankfurter API returned ${response.status}`);
    }

    const data = await response.json();
    const rate = data?.rates?.INR;

    if (typeof rate !== "number" || !Number.isFinite(rate) || rate <= 0) {
      throw new Error(`Unexpected Frankfurter response shape: ${JSON.stringify(data)}`);
    }

    await prisma.fx_rate_cache.upsert({
      where: { currency: "INR" },
      update: { rate_to_usd: rate, fetched_at: new Date(), source: "frankfurter.app" },
      create: { currency: "INR", rate_to_usd: rate, source: "frankfurter.app" },
    });

    return NextResponse.json({ success: true, currency: "INR", rate, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("FX rate refresh failed:", error);
    // Non-fatal by design — pricing code falls back to the static
    // illustrative rate in utils/pppPricing.ts whenever the cache is
    // missing or stale, so a failed refresh degrades gracefully rather
    // than breaking checkout.
    return NextResponse.json(
      { error: "FX rate refresh failed", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
