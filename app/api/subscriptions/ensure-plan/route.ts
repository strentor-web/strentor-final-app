import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import Razorpay from 'razorpay';
import prisma from '@/utils/prisma/prismaClient';

const RATE_PER_SESSION = 1000;
const WEEKS_PER_MONTH = 4;
const MIN_SESSIONS_PER_WEEK = 3;
const MAX_SESSIONS_PER_WEEK = 5;

const CYCLE_DISCOUNTS: Record<number, number> = {
  1: 0,
  3: 10,
  6: 20,
  12: 30,
};

const CYCLE_LABELS: Record<number, string> = {
  1: 'monthly',
  3: 'quarterly',
  6: 'semi_annual',
  12: 'annual',
};

function getRazorpayPeriod(months: number): { period: 'monthly' | 'yearly'; interval: number } {
  if (months === 12) {
    return { period: 'yearly', interval: 1 };
  }
  return { period: 'monthly', interval: months };
}

// Finds an existing FITNESS plan matching the requested sessions-per-week +
// billing-cycle combination, or provisions a new Razorpay Plan (and the
// backing subscription_plans row) if one doesn't exist yet. Does not create
// a subscription — that still goes through the existing
// /api/subscriptions/create + SubscribeButton flow once this plan exists.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionsPerWeek, billingCycle } = body;

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

    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (!user?.id || userError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingPlan = await prisma.subscription_plans.findFirst({
      where: {
        category: 'FITNESS',
        billing_cycle: billingCycle,
        sessions_per_week: sessionsPerWeek,
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

    const weeksInCycle = billingCycle * WEEKS_PER_MONTH;
    const totalSessions = sessionsPerWeek * weeksInCycle;
    const discount = CYCLE_DISCOUNTS[billingCycle];
    const originalAmount = totalSessions * RATE_PER_SESSION;
    const discountedAmount = Math.round(originalAmount * (1 - discount / 100));
    const cycleLabel = CYCLE_LABELS[billingCycle];
    const planName = `Fitness — ${sessionsPerWeek}/week (${cycleLabel})`;

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
      },
    });

    const plan = await prisma.subscription_plans.create({
      data: {
        name: planName,
        category: 'FITNESS',
        plan_type: 'ONLINE',
        price: discountedAmount,
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
