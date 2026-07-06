import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import Razorpay from 'razorpay';
import prisma from '@/utils/prisma/prismaClient';

const RATE_PER_SESSION = 1000;
const WEEKS_PER_MONTH = 4;
const MONTHS_PER_30_YEARS = 360;

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionsPerWeek, billingCycle } = body;

    if (
      typeof sessionsPerWeek !== 'number' ||
      !Number.isInteger(sessionsPerWeek) ||
      sessionsPerWeek < 1
    ) {
      return NextResponse.json(
        { error: 'sessionsPerWeek must be a positive integer' },
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
    const userId = user?.id;

    if (!userId || userError) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only one active FITNESS subscription per user, same rule as the fixed-plan flow
    const existingSubscription = await prisma.user_subscriptions.findFirst({
      where: {
        user_id: userId,
        status: { in: ['CREATED', 'ACTIVE', 'AUTHENTICATED', 'PENDING'] },
        subscription_plans: {
          category: 'FITNESS',
        },
      },
    });

    if (existingSubscription) {
      return NextResponse.json(
        { error: 'You already have an active fitness subscription' },
        { status: 400 }
      );
    }

    const userData = await prisma.users_profile.findUnique({
      where: { id: userId },
      select: { email: true, name: true, phone: true },
    });

    if (!userData) {
      return NextResponse.json(
        { error: 'User details not found' },
        { status: 404 }
      );
    }

    if (!userData.phone) {
      return NextResponse.json(
        { error: 'A phone number is required so Razorpay can send the payment link' },
        { status: 400 }
      );
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: 'Payment provider not configured' },
        { status: 500 }
      );
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

    try {
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
          user_id: userId,
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
          is_active: false, // dynamically generated, not meant to show in any static plan list
        },
      });

      const totalCount = Math.round(MONTHS_PER_30_YEARS / billingCycle);

      const subscription = await razorpay.subscriptions.create({
        plan_id: razorpayPlan.id,
        customer_notify: 1,
        total_count: totalCount,
        notes: {
          user_id: userId,
          plan_name: plan.name,
          plan_id: plan.id,
          razorpay_plan_id: razorpayPlan.id,
        },
      });

      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 30);

      await prisma.user_subscriptions.create({
        data: {
          user_id: userId,
          plan_id: plan.id,
          razorpay_subscription_id: subscription.id,
          status: 'CREATED',
          payment_status: 'PENDING',
          start_date: new Date(),
          end_date: endDate,
          total_count: totalCount,
          paid_count: 0,
          remaining_count: totalCount,
        },
      });

      return NextResponse.json({
        success: true,
        subscriptionId: subscription.id,
        totalSessions,
        sessionsPerWeek,
        billingCycle,
        amount: discountedAmount,
        message: `A payment link has been sent to ${userData.phone} and ${userData.email}. Complete the payment there to activate your plan.`,
      });
    } catch (error) {
      console.error('Dynamic subscription creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create subscription' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
