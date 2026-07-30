// Server-only. Validates and applies admin-managed promo codes at checkout
// (see prisma schema `promo_codes`/`promo_code_redemptions`) — distinct
// from the referrals/testimonials cashback systems, which pay the
// referrer/reviewer rather than discounting the purchaser. Never trust a
// client-supplied discount amount; this is the only place a promo actually
// reduces what a customer pays, and the caller is responsible for clamping
// the result against pricing_overrides min/max (see clampUsd in
// utils/pricingOverrides.ts) so a promo can never undercut the configured
// margin floor for that scope.

import prisma from "@/utils/prisma/prismaClient";

export type PromoScopeProduct = "recurring" | "lifetime" | "starter_kit";

export interface PromoValidationResult {
  valid: boolean;
  error?: string;
  promoCodeId?: string;
  discountAmountUsd?: number;
  discountedAmountUsd?: number;
}

// amountUsd is the price BEFORE the promo (already tier/segment/override
// adjusted). Returns the price AFTER the promo — the caller still needs to
// clamp it.
export async function validatePromoCode(params: {
  code: string;
  countryCode: string | null;
  product: PromoScopeProduct;
  amountUsd: number;
  email: string;
}): Promise<PromoValidationResult> {
  const code = params.code.trim().toUpperCase();
  if (!code) {
    return { valid: false, error: "Enter a promo code" };
  }

  const promo = await prisma.promo_codes.findUnique({ where: { code } });
  if (!promo || !promo.is_active) {
    return { valid: false, error: "Invalid promo code" };
  }

  const now = new Date();
  if (promo.starts_at && promo.starts_at > now) {
    return { valid: false, error: "This promo code isn't active yet" };
  }
  if (promo.ends_at && promo.ends_at < now) {
    return { valid: false, error: "This promo code has expired" };
  }
  if (promo.scope_country && promo.scope_country !== params.countryCode?.toUpperCase()) {
    return { valid: false, error: "This promo code isn't valid in your region" };
  }
  if (promo.scope_product && promo.scope_product !== params.product) {
    return { valid: false, error: "This promo code doesn't apply to this product" };
  }

  if (promo.redemption_limit !== null) {
    const totalRedemptions = await prisma.promo_code_redemptions.count({
      where: { promo_code_id: promo.id },
    });
    if (totalRedemptions >= promo.redemption_limit) {
      return { valid: false, error: "This promo code has reached its redemption limit" };
    }
  }

  const email = params.email.trim().toLowerCase();
  const customerRedemptions = await prisma.promo_code_redemptions.count({
    where: { promo_code_id: promo.id, email },
  });
  if (customerRedemptions >= promo.per_customer_limit) {
    return { valid: false, error: "You've already used this promo code" };
  }

  const discountAmountUsd =
    promo.type === "PERCENTAGE"
      ? params.amountUsd * (Number(promo.value) / 100)
      : Math.min(Number(promo.value), params.amountUsd);
  const discountedAmountUsd = Math.max(0, params.amountUsd - discountAmountUsd);

  return {
    valid: true,
    promoCodeId: promo.id,
    discountAmountUsd,
    discountedAmountUsd,
  };
}

// Records a redemption once a charge actually succeeds — call this after
// payment/plan creation, not at validation time, so an abandoned checkout
// never consumes a per-customer-limited code.
export async function recordPromoRedemption(params: {
  promoCodeId: string;
  userId: string | null;
  email: string;
  orderReference: string;
  amountDiscounted: number;
}): Promise<void> {
  await prisma.promo_code_redemptions.create({
    data: {
      promo_code_id: params.promoCodeId,
      user_id: params.userId,
      email: params.email.trim().toLowerCase(),
      order_reference: params.orderReference,
      amount_discounted: params.amountDiscounted,
    },
  });
}
