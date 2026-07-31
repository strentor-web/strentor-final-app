import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import Razorpay from 'razorpay';
import prisma from '@/utils/prisma/prismaClient';
import { isSponsoredSegment, isKnownSegment, roundNicely } from '@/utils/pppPricing';
import { isCountryExcluded, getEffectivePricing, clampUsd } from '@/utils/pricingOverrides';
import { validatePromoCode } from '@/utils/pricing/promoCodes';
import { getEffectiveFxRate } from '@/utils/fxRates';
import {
  WEEKS_PER_MONTH,
  MIN_SESSIONS_PER_WEEK,
  MAX_SESSIONS_PER_WEEK,
  RATE_PER_SESSION_USD,
  PLAN_TYPE_LABELS,
  PROGRAM_LABELS,
  CYCLE_DISCOUNTS,
  CYCLE_LABELS,
  calculateCyclePriceUSDForTier,
  TrainingPlanType,
  TrainingProgram,
} from '@/utils/pricing/sessionPricing';

const VALID_PROGRAMS: TrainingProgram[] = ['FITNESS', 'FLAGSHIP_TRANSFORMATION', 'ELITE_MENTORSHIP'];

function getRazorpayPeriod(months: number): { period: 'monthly' | 'yearly'; interval: number } {
  if (months === 12) {
    return { period: 'yearly', interval: 1 };
  }
  return { period: 'monthly', interval: months };
}

// Razorpay only ever serves Indian customers — this route always prices in
// INR at India's PPP tier (see utils/pppPricing.ts), derived from the same
// USD base every other country's price comes from.
const RAZORPAY_COUNTRY = 'IN';

// Finds an existing FITNESS plan matching the requested sessions-per-week +
// billing-cycle combination, or provisions a new Razorpay Plan (and the
// backing subscription_plans row) if one doesn't exist yet. Does not create
// a subscription — that still goes through the existing
// /api/subscriptions/create + SubscribeButton flow once this plan exists.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionsPerWeek, billingCycle, planType = 'ONLINE', program = 'FITNESS', city, segment, promoCode } = body;

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

    if (!VALID_PROGRAMS.includes(program)) {
      return NextResponse.json({ error: 'Unrecognized program' }, { status: 400 });
    }

    // Flagship/Elite are coach-led, high-touch programs — there's no
    // Self-Paced variant (see utils/pricing/sessionPricing.ts PROGRAM_LABELS).
    if (program !== 'FITNESS' && planType !== 'ONLINE') {
      return NextResponse.json(
        { error: `${PROGRAM_LABELS[program as TrainingProgram]} is Trainer-Led only — Self-Paced isn't offered for this program` },
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

    const cityInput = typeof city === 'string' && city.trim() ? city.trim() : null;

    if (await isCountryExcluded(RAZORPAY_COUNTRY)) {
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

    // pricing_tier / pricing_segment / pricing_override_id / promo_code_id
    // discriminate this generation of rows from any earlier-formula (or
    // differently overridden/promo'd) row that may already exist for this
    // same combo — a Razorpay Plan's billed amount is fixed forever once
    // created, so an old row must never be silently reused at a new price.
    const segmentValue: string | null = segment && isKnownSegment(segment) ? segment : null;
    const pricing = await getEffectivePricing(RAZORPAY_COUNTRY, cityInput, segmentValue);
    const { tier, overrideId } = pricing;

    const usdPrice = calculateCyclePriceUSDForTier(
      sessionsPerWeek,
      billingCycle,
      planType as TrainingPlanType,
      pricing.multiplier,
      program as TrainingProgram
    );

    let promoCodeId: string | null = null;
    let discountAmountUsd = 0;
    let preClampUsd = usdPrice.discountedAmount;
    if (typeof promoCode === 'string' && promoCode.trim()) {
      const promoResult = await validatePromoCode({
        code: promoCode,
        countryCode: RAZORPAY_COUNTRY,
        product: 'recurring',
        amountUsd: usdPrice.discountedAmount,
        email: user.email ?? '',
      });
      if (!promoResult.valid) {
        return NextResponse.json({ error: promoResult.error, errorType: 'INVALID_PROMO' }, { status: 400 });
      }
      promoCodeId = promoResult.promoCodeId ?? null;
      discountAmountUsd = promoResult.discountAmountUsd ?? 0;
      preClampUsd = promoResult.discountedAmountUsd ?? preClampUsd;
    }

    const existingPlan = await prisma.subscription_plans.findFirst({
      where: {
        category: program,
        billing_cycle: billingCycle,
        sessions_per_week: sessionsPerWeek,
        plan_type: planType,
        pricing_tier: tier,
        pricing_segment: segmentValue,
        pricing_override_id: overrideId,
        promo_code_id: promoCodeId,
        is_active: true,
      },
    });

    if (existingPlan) {
      return NextResponse.json({
        id: existingPlan.id,
        razorpayPlanId: existingPlan.razorpay_plan_id,
        price: Number(existingPlan.price),
      });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: 'Payment provider not configured' }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const clampedUsd = clampUsd(preClampUsd, pricing);
    // Convert at the live-cached INR rate when fresh, else the static
    // illustrative rate (see utils/fxRates.ts) — either way this is the
    // one place that actually decides what Razorpay charges in INR.
    const { rate: inrRate } = await getEffectiveFxRate('INR');
    const discountedAmount = roundNicely(clampedUsd * inrRate);
    const discountAmountInr = discountAmountUsd > 0 ? roundNicely(discountAmountUsd * inrRate) : null;
    const totalSessions = usdPrice.totalSessions;
    const weeksInCycle = billingCycle * WEEKS_PER_MONTH;
    const cycleLabel = CYCLE_LABELS[billingCycle];
    const planName = `${PROGRAM_LABELS[program as TrainingProgram]} ${PLAN_TYPE_LABELS[planType as TrainingPlanType]} — ${sessionsPerWeek}/week (${cycleLabel})`;

    const { period, interval } = getRazorpayPeriod(billingCycle);

    const razorpayPlan = await razorpay.plans.create({
      period,
      interval,
      item: {
        name: planName,
        amount: discountedAmount * 100, // paise
        currency: 'INR',
        description: `${totalSessions} sessions (${sessionsPerWeek}/week x ${weeksInCycle} weeks), billed every ${billingCycle} month${billingCycle === 1 ? '' : 's'}`,
      },
      notes: {
        sessions_per_week: sessionsPerWeek,
        billing_cycle: billingCycle,
        plan_type: planType,
        program,
      },
    });

    const plan = await prisma.subscription_plans.create({
      data: {
        name: planName,
        category: program,
        plan_type: planType,
        price: discountedAmount,
        pricing_tier: tier,
        pricing_segment: segmentValue,
        pricing_override_id: overrideId,
        promo_code_id: promoCodeId,
        discount_amount: discountAmountInr,
        razorpay_plan_id: razorpayPlan.id,
        billing_period: cycleLabel,
        billing_cycle: billingCycle,
        sessions_per_week: sessionsPerWeek,
        is_active: true,
      },
    });

    return NextResponse.json({
      id: plan.id,
      razorpayPlanId: plan.razorpay_plan_id,
      price: Number(plan.price),
    });
  } catch (error) {
    console.error('Ensure plan error:', error);
    return NextResponse.json({ error: 'Failed to prepare subscription plan' }, { status: 500 });
  }
}
