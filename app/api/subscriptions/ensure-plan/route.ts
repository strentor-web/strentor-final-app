import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import Razorpay from 'razorpay';
import prisma from '@/utils/prisma/prismaClient';
import { getPppTier, isSponsoredSegment, isKnownSegment } from '@/utils/pppPricing';
import {
  WEEKS_PER_MONTH,
  MIN_SESSIONS_PER_WEEK,
  MAX_SESSIONS_PER_WEEK,
  RATE_PER_SESSION_USD,
  PLAN_TYPE_LABELS,
  CYCLE_DISCOUNTS,
  CYCLE_LABELS,
  calculateCyclePriceForCountry,
  TrainingPlanType,
} from '@/utils/pricing/sessionPricing';

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
    const { sessionsPerWeek, billingCycle, planType = 'ONLINE', city, segment } = body;

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

    const cityInput = typeof city === 'string' && city.trim() ? city.trim() : null;

    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (!user?.id || userError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // pricing_tier (+ pricing_segment) discriminates this PPP-priced
    // generation of rows from any earlier-formula row that may already
    // exist for this same combo — a Razorpay Plan's billed amount is
    // fixed forever once created, so an old row must never be silently
    // reused at a new price.
    const tier = getPppTier(RAZORPAY_COUNTRY, cityInput);
    const segmentValue: string | null = segment && isKnownSegment(segment) ? segment : null;

    const existingPlan = await prisma.subscription_plans.findFirst({
      where: {
        category: 'FITNESS',
        billing_cycle: billingCycle,
        sessions_per_week: sessionsPerWeek,
        plan_type: planType,
        pricing_tier: tier,
        pricing_segment: segmentValue,
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

    const { totalSessions, discountedAmount } = calculateCyclePriceForCountry(
      sessionsPerWeek,
      billingCycle,
      planType as TrainingPlanType,
      RAZORPAY_COUNTRY,
      cityInput,
      segmentValue
    );
    const weeksInCycle = billingCycle * WEEKS_PER_MONTH;
    const cycleLabel = CYCLE_LABELS[billingCycle];
    const planName = `Fitness ${PLAN_TYPE_LABELS[planType as TrainingPlanType]} — ${sessionsPerWeek}/week (${cycleLabel})`;

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
      },
    });

    const plan = await prisma.subscription_plans.create({
      data: {
        name: planName,
        category: 'FITNESS',
        plan_type: planType,
        price: discountedAmount,
        pricing_tier: tier,
        pricing_segment: segmentValue,
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
