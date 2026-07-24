import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/utils/prisma/prismaClient';
import { createPaypalPlan } from '@/utils/paypal';
import {
  WEEKS_PER_MONTH,
  MIN_SESSIONS_PER_WEEK,
  MAX_SESSIONS_PER_WEEK,
  RATE_PER_SESSION_USD,
  PLAN_TYPE_LABELS,
  CYCLE_DISCOUNTS,
  CYCLE_LABELS,
  TrainingPlanType,
} from '@/utils/pricing/sessionPricing';

// PayPal equivalent of /api/subscriptions/ensure-plan — finds or provisions
// a USD-priced PayPal Billing Plan for the requested sessions-per-week +
// billing-cycle combination. Kept as a separate subscription_plans row
// (currency='USD') from the INR/Razorpay row for the same combo, same
// pattern as the PayPal Lifetime route.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionsPerWeek, billingCycle, planType = 'ONLINE' } = body;

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
        plan_type: planType,
        currency: 'USD',
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

    const weeksInCycle = billingCycle * WEEKS_PER_MONTH;
    const totalSessions = sessionsPerWeek * weeksInCycle;
    const discount = CYCLE_DISCOUNTS[billingCycle];
    const originalAmount = totalSessions * RATE_PER_SESSION_USD[planType as TrainingPlanType];
    const discountedAmount = Math.round(originalAmount * (1 - discount / 100));
    const cycleLabel = CYCLE_LABELS[billingCycle];
    const planName = `Fitness ${PLAN_TYPE_LABELS[planType as TrainingPlanType]} — ${sessionsPerWeek}/week (${cycleLabel}, USD)`;

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
            // Unused for PayPal-priced rows — placeholder keeps this
            // NOT NULL column consistent across every subscription_plans row.
            razorpay_plan_id: `paypal_${planType}_${sessionsPerWeek}pw_${billingCycle}mo`,
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
