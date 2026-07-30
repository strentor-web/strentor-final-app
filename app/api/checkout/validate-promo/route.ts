import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { validatePromoCode, type PromoScopeProduct } from "@/utils/pricing/promoCodes";

// Preview-only — lets the checkout UI show "10% off" as the customer types
// a code, without creating any order/plan. The actual discount is only
// ever applied server-side again, independently, inside the 4 payment
// routes at charge time; this endpoint's response is never trusted as the
// final price.
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { code, countryCode, product, amountUsd } = body as Record<string, unknown>;

  if (typeof code !== "string" || !code.trim()) {
    return NextResponse.json({ valid: false, error: "Enter a promo code" }, { status: 400 });
  }
  if (product !== "recurring" && product !== "lifetime" && product !== "starter_kit") {
    return NextResponse.json({ error: "Invalid product" }, { status: 400 });
  }
  if (typeof amountUsd !== "number" || !Number.isFinite(amountUsd) || amountUsd <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const email = user?.email;
  if (!email) {
    return NextResponse.json({ valid: false, error: "Sign in to apply a promo code" }, { status: 401 });
  }

  const result = await validatePromoCode({
    code,
    countryCode: typeof countryCode === "string" ? countryCode : null,
    product: product as PromoScopeProduct,
    amountUsd,
    email,
  });

  return NextResponse.json(result);
}
