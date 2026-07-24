import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/utils/prisma/prismaClient';
import { createPaypalSubscription } from '@/utils/paypal';

// PayPal equivalent of /api/subscriptions/create — takes a paypalPlanId
// (already provisioned via /api/paypal/subscriptions/ensure-plan) and
// creates the actual PayPal Subscription, plus the pending
// user_subscriptions row it will activate once PayPal confirms it (see
// /api/paypal/subscriptions/verify-payment).
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paypalPlanId } = body;

    if (!paypalPlanId) {
      return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (!user?.id || userError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const plan = await prisma.subscription_plans.findFirst({
      where: { paypal_plan_id: paypalPlanId },
    });

    if (!plan) {
      return NextResponse.json({ error: 'Subscription plan not found or inactive' }, { status: 404 });
    }

    const existingSubscription = await prisma.user_subscriptions.findFirst({
      where: {
        user_id: user.id,
        status: { in: ['CREATED', 'ACTIVE', 'AUTHENTICATED', 'PENDING'] },
        subscription_plans: { category: plan.category },
      },
    });

    if (existingSubscription) {
      return NextResponse.json(
        { error: `You already have an active ${plan.category.toLowerCase()} subscription` },
        { status: 400 }
      );
    }

    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      return NextResponse.json({ error: 'Payment provider not configured' }, { status: 500 });
    }

    const origin = request.nextUrl.origin;

    const subscription = await createPaypalSubscription({
      planId: paypalPlanId,
      customId: user.id,
      returnUrl: `${origin}/checkout`,
      cancelUrl: `${origin}/checkout`,
    });

    // 30-year effective duration, mirroring the Razorpay recurring path —
    // PayPal Plans are set to bill indefinitely (total_cycles: 0); this
    // end_date is a display-only ceiling, not something PayPal enforces.
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 30);

    await prisma.user_subscriptions.create({
      data: {
        user_id: user.id,
        plan_id: plan.id,
        paypal_subscription_id: subscription.id,
        status: 'CREATED',
        payment_status: 'PENDING',
        start_date: new Date(),
        end_date: endDate,
      },
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      planName: plan.name,
      price: Number(plan.price),
    });
  } catch (error) {
    console.error('PayPal subscription creation error:', error);
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
  }
}
