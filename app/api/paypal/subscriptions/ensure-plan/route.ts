import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/utils/prisma/prismaClient';
import { createPaypalPlan } from '@/utils/paypal';
import { isSponsoredSegment, isKnownSegment } from '@/utils/pppPricing';
import { isCountryExcluded, getEffectivePricing, clampUsd } from '@/utils/pricingOverrides';
import { validatePromoCode } from '@/utils/pricing/promoCodes';
import {
  WEEKS_PER_MONTH,
  MIN_SESSIONS_PER_WEEK,
  MAX_SESSIONS_PER_WEEK,
  RATE_PER_SESSION_USD,
  PLAN_TYPE_LABELS,
  CYCLE_DISCOUNTS,
  CYCLE_LABELS,
  calculateCyclePriceUSDForTier,
  TrainingPlanType,
} from '@/utils/pricing/sessionPricing';

// PayPal equivalent of /api/subscriptions/ensure-plan — finds or provisions
// a PPP-tier-adjusted, USD-priced PayPal Billing Plan for the requested
// sessions-per-week + billing-cycle combination. Kept as a separate
// subscription_plans row (currency='USD', pricing_tier=<1-4>) from both the
// INR/Razorpay row and every other PPP tier for the same combo — a PayPal
// recurring subscription's billed amount is fixed at Plan-creation time on
// PayPal's side, so two different tiers can never safely share one Plan.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionsPerWeek, billingCycle, planType = 'ONLINE', countryCode, city, segment, promoCode } = body;

    if (
      typeof sessionsPerWeek !== 'number' ||
      !Number.isInteger(sessionsPerWeek) ||
      sessionsPerWeek < MIN_SESSIONS_PER_WEEK ||
      sessionsPerWeek > MAX_SESSIONS_PER_WEEK
    ) {
      return NextResponse.json(
        { error: `sessionsPerWeek must be an integer between ${MIN_SESSIONS_PER_WEEK} and ${MAX_SESSIONS_PER_WEEK}` },
        { status: 400 }
      );
    }

    if (!(billingCycle in CYCLE_DISCOUNTS)) {
      return NextResponse.json(
        { error: 'billingCycle must be one of 1, 3, 6, or 12 (months)' },
        { status: 400 }
      );
    }

    if (!(planType in RATE_PER_SESSION_USD)) {
      return NextResponse.json(
        { error: 'planType must be one of ONLINE or SELF_PACED' },
        { status: 400 }
      );
    }

    if (segment && !isKnownSegment(segment)) {
      return NextResponse.json({ error: 'Unrecognized customer segment' }, { status: 400 });
    }

    if (isSponsoredSegment(segment)) {
      return NextResponse.json(
        {
          error: 'Sponsored pricing is arranged directly, not through self-serve checkout',
          errorType: 'SPONSORED_SEGMENT',
        },
        { status: 400 }
      );
    }

    const countryInput = typeof countryCode === 'string' ? countryCode : null;
    const cityInput = typeof city === 'string' && city.trim() ? city.trim() : null;
    const segmentValue: string | null = segment && isKnownSegment(segment) ? segment : null;

    if (await isCountryExcluded(countryInput)) {
      return NextResponse.json(
        { error: 'This plan is not currently available in your region', errorType: 'REGION_EXCLUDED' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (!user?.id || userError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pricing = await getEffectivePricing(countryInput, cityInput, segmentValue);
    const { tier, overrideId } = pricing;

    const weeksInCycle = billingCycle * WEEKS_PER_MONTH;
    const totalSessions = sessionsPerWeek * weeksInCycle;
    const usdPrice = calculateCyclePriceUSDForTier(
      sessionsPerWeek,
      billingCycle,
      planType as TrainingPlanType,
      pricing.multiplier
    );

    let promoCodeId: string | null = null;
    let discountAmount: number | null = null;
    let preClampUsd = usdPrice.discountedAmount;
    if (typeof promoCode === 'string' && promoCode.trim()) {
      const promoResult = await validatePromoCode({
        code: promoCode,
        countryCode: countryInput,
        product: 'recurring',
        amountUsd: usdPrice.discountedAmount,
        email: user.email ?? '',
      });
      if (!promoResult.valid) {
        return NextResponse.json({ error: promoResult.error, errorType: 'INVALID_PROMO' }, { status: 400 });
      }
      promoCodeId = promoResult.promoCodeId ?? null;
      discountAmount = promoResult.discountAmountUsd ?? null;
      preClampUsd = promoResult.discountedAmountUsd ?? preClampUsd;
    }

    const existingPlan = await prisma.subscription_plans.findFirst({
      where: {
        category: 'FITNESS',
        billing_cycle: billingCycle,
        sessions_per_week: sessionsPerWeek,
        plan_type: planType,
        currency: 'USD',
        pricing_tier: tier,
        pricing_segment: segmentValue,
        pricing_override_id: overrideId,
        promo_code_id: promoCodeId,
        is_active: true,
      },
    });

    if (existingPlan && existingPlan.paypal_plan_id) {
      return NextResponse.json({
        id: existingPlan.id,
        paypalPlanId: existingPlan.paypal_plan_id,
        price: Number(existingPlan.price),
      });
    }

    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      return NextResponse.json({ error: 'Payment provider not configured' }, { status: 500 });
    }

    const discountedAmount = clampUsd(preClampUsd, pricing);
    const cycleLabel = CYCLE_LABELS[billingCycle];
    const planName = `Fitness ${PLAN_TYPE_LABELS[planType as TrainingPlanType]} — ${sessionsPerWeek}/week (${cycleLabel}, USD, tier ${tier})`;

    const paypalPlan = await createPaypalPlan({
      name: planName,
      description: `${totalSessions} sessions (${sessionsPerWeek}/week x ${weeksInCycle} weeks), billed every ${billingCycle} month${billingCycle === 1 ? '' : 's'}`,
      amount: discountedAmount,
      intervalMonths: billingCycle,
    });

    const plan = existingPlan
      ? await prisma.subscription_plans.update({
          where: { id: existingPlan.id },
          data: { paypal_plan_id: paypalPlan.id, price: discountedAmount },
        })
      : await prisma.subscription_plans.create({
          data: {
            name: planName,
            category: 'FITNESS',
            plan_type: planType,
            price: discountedAmount,
            currency: 'USD',
            pricing_tier: tier,
            pricing_segment: segmentValue,
            pricing_override_id: overrideId,
            promo_code_id: promoCodeId,
            discount_amount: discountAmount,
            // Unused for PayPal-priced rows — placeholder keeps this
            // NOT NULL column consistent across every subscription_plans row.
            razorpay_plan_id: `paypal_${planType}_${sessionsPerWeek}pw_${billingCycle}mo_tier${tier}`,
            paypal_plan_id: paypalPlan.id,
            billing_period: cycleLabel,
            billing_cycle: billingCycle,
            sessions_per_week: sessionsPerWeek,
            is_active: true,
          },
        });

    return NextResponse.json({
      id: plan.id,
      paypalPlanId: plan.paypal_plan_id,
      price: Number(plan.price),
    });
  } catch (error) {
    console.error('PayPal ensure plan error:', error);
    return NextResponse.json({ error: 'Failed to prepare subscription plan' }, { status: 500 });
  }
}
