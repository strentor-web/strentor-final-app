import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/utils/prisma/prismaClient';
import { createPaypalOrder } from '@/utils/paypal';
import { getPppTier, getPppMultiplier, getSegmentMultiplier, isSponsoredSegment, isKnownSegment } from '@/utils/pppPricing';
import {
  MIN_SESSIONS_PER_WEEK,
  MAX_SESSIONS_PER_WEEK,
  PLAN_TYPE_LABELS,
  getLifetimePriceUSDForTier,
  LIFETIME_BILLING_CYCLE,
  LIFETIME_BILLING_PERIOD,
  TrainingPlanType,
} from '@/utils/pricing/sessionPricing';

// PayPal equivalent of /api/lifetime/create-order — same one-time Lifetime
// Membership product, priced in USD for non-Indian customers, paid via a
// PayPal Order (Orders API) instead of a Razorpay Order. The price is a
// PPP-tier-adjusted USD amount (see utils/pppPricing.ts) computed here from
// the client-reported countryCode — never trusted as a raw price from the
// client.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionsPerWeek, planType = 'ONLINE', countryCode, city, segment } = body;

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

    if (planType !== 'ONLINE' && planType !== 'SELF_PACED') {
      return NextResponse.json({ error: 'planType must be one of ONLINE or SELF_PACED' }, { status: 400 });
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

    const tier = getPppTier(countryInput, cityInput);
    const multiplier = getPppMultiplier(countryInput, cityInput) * getSegmentMultiplier(segmentValue);
    const price = getLifetimePriceUSDForTier(sessionsPerWeek, planType as TrainingPlanType, multiplier);
    if (price === undefined) {
      return NextResponse.json({ error: 'No Lifetime price configured for this combination' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (!user?.id || userError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingFitnessSubscription = await prisma.user_subscriptions.findFirst({
      where: {
        user_id: user.id,
        status: { in: ['CREATED', 'ACTIVE', 'AUTHENTICATED', 'PENDING'] },
        subscription_plans: { category: 'FITNESS' },
      },
    });

    if (existingFitnessSubscription) {
      return NextResponse.json(
        { error: 'You already have an active Fitness subscription' },
        { status: 400 }
      );
    }

    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      return NextResponse.json({ error: 'Payment provider not configured' }, { status: 500 });
    }

    const planName = `Fitness Lifetime ${PLAN_TYPE_LABELS[planType as TrainingPlanType]} — ${sessionsPerWeek}/week (USD, tier ${tier})`;

    // Reuse the shared subscription_plans row for this (planType,
    // sessionsPerWeek, tier) combo if one was already provisioned by an
    // earlier PayPal purchase attempt at the same PPP tier; currency='USD'
    // keeps this distinct from the INR row the Razorpay path uses for the
    // same sessions/week + planType, and pricing_tier keeps different PPP
    // tiers from sharing (and misreporting) each other's price.
    let plan = await prisma.subscription_plans.findFirst({
      where: {
        category: 'FITNESS',
        billing_cycle: LIFETIME_BILLING_CYCLE,
        sessions_per_week: sessionsPerWeek,
        plan_type: planType,
        currency: 'USD',
        pricing_tier: tier,
        is_active: true,
      },
    });

    if (!plan) {
      plan = await prisma.subscription_plans.create({
        data: {
          name: planName,
          category: 'FITNESS',
          plan_type: planType,
          price,
          currency: 'USD',
          pricing_tier: tier,
          pricing_segment: segmentValue,
          // razorpay_plan_id is NOT NULL in the schema but unused for
          // PayPal-priced rows — a placeholder keeps this row consistent
          // with every other subscription_plans row.
          razorpay_plan_id: `paypal_lifetime_${planType}_${sessionsPerWeek}pw_tier${tier}`,
          billing_period: LIFETIME_BILLING_PERIOD,
          billing_cycle: LIFETIME_BILLING_CYCLE,
          sessions_per_week: sessionsPerWeek,
          is_active: true,
        },
      });
    }

    const origin = request.nextUrl.origin;

    const order = await createPaypalOrder({
      amount: price,
      description: `${planName} — one-time payment, no further billing`,
      customId: user.id,
      returnUrl: `${origin}/checkout`,
      cancelUrl: `${origin}/checkout`,
    });

    await prisma.lifetime_membership_purchases.create({
      data: {
        user_id: user.id,
        plan_id: plan.id,
        sessions_per_week: sessionsPerWeek,
        plan_type: planType,
        payment_provider: 'paypal',
        currency: 'USD',
        provider_order_id: order.id,
        amount: price,
        status: 'PENDING',
        city: cityInput,
        customer_segment: segmentValue,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: price,
      currency: 'USD',
    });
  } catch (error) {
    console.error('PayPal lifetime membership order creation error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
