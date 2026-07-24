import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import Razorpay from 'razorpay';
import prisma from '@/utils/prisma/prismaClient';
import { getPppTier } from '@/utils/pppPricing';
import {
  MIN_SESSIONS_PER_WEEK,
  MAX_SESSIONS_PER_WEEK,
  PLAN_TYPE_LABELS,
  getLifetimePriceForCountry,
  LIFETIME_BILLING_CYCLE,
  LIFETIME_BILLING_PERIOD,
  TrainingPlanType,
} from '@/utils/pricing/sessionPricing';

// Razorpay only ever serves Indian customers — this route always prices in
// INR at India's PPP tier (see utils/pppPricing.ts), derived from the same
// USD base every other country's price comes from.
const RAZORPAY_COUNTRY = 'IN';

// Lifetime Membership — a one-time Razorpay Order (not a recurring
// Subscription/Plan). This route provisions/reuses the backing
// subscription_plans row and creates the Order; /api/lifetime/verify-payment
// confirms payment and activates the membership.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionsPerWeek, planType = 'ONLINE' } = body;

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

    const tier = getPppTier(RAZORPAY_COUNTRY);
    const lifetimePrice = getLifetimePriceForCountry(sessionsPerWeek, planType as TrainingPlanType, RAZORPAY_COUNTRY);
    if (lifetimePrice === undefined) {
      return NextResponse.json({ error: 'No Lifetime price configured for this combination' }, { status: 400 });
    }
    const price = lifetimePrice.amount;

    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (!user?.id || userError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Lifetime is a Fitness membership — a user can only ever hold one
    // Fitness relationship (recurring or lifetime) at a time.
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

    const userData = await prisma.users_profile.findUnique({
      where: { id: user.id },
      select: { email: true, name: true, phone: true },
    });

    if (!userData) {
      return NextResponse.json({ error: 'User details not found' }, { status: 404 });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: 'Payment provider not configured' }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const planName = `Fitness Lifetime ${PLAN_TYPE_LABELS[planType as TrainingPlanType]} — ${sessionsPerWeek}/week`;

    // Reuse the shared subscription_plans row for this (planType,
    // sessionsPerWeek, tier) combo if one was already provisioned by an
    // earlier purchase attempt at the same PPP tier; otherwise create it.
    // razorpay_plan_id is a placeholder — Lifetime has no real recurring
    // Razorpay Plan behind it.
    let plan = await prisma.subscription_plans.findFirst({
      where: {
        category: 'FITNESS',
        billing_cycle: LIFETIME_BILLING_CYCLE,
        sessions_per_week: sessionsPerWeek,
        plan_type: planType,
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
          pricing_tier: tier,
          razorpay_plan_id: `lifetime_${planType}_${sessionsPerWeek}pw_tier${tier}`,
          billing_period: LIFETIME_BILLING_PERIOD,
          billing_cycle: LIFETIME_BILLING_CYCLE,
          sessions_per_week: sessionsPerWeek,
          is_active: true,
        },
      });
    }

    const order = await razorpay.orders.create({
      amount: price * 100, // paise
      currency: 'INR',
      notes: {
        user_id: user.id,
        product: 'lifetime_membership',
        sessions_per_week: sessionsPerWeek,
        plan_type: planType,
      },
    });

    await prisma.lifetime_membership_purchases.create({
      data: {
        user_id: user.id,
        plan_id: plan.id,
        sessions_per_week: sessionsPerWeek,
        plan_type: planType,
        payment_provider: 'razorpay',
        currency: 'INR',
        provider_order_id: order.id,
        amount: price,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      orderId: order.id,
      key: process.env.RAZORPAY_KEY_ID,
      amount: price * 100,
      currency: 'INR',
      name: 'STRENTOR Lifetime Membership',
      description: `${planName} — one-time payment, no further billing`,
      prefill: {
        name: userData.name,
        email: userData.email,
        ...(userData.phone && { contact: userData.phone }),
      },
      notes: {
        user_id: user.id,
      },
    });
  } catch (error) {
    console.error('Lifetime membership order creation error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
