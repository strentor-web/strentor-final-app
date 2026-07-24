import { NextRequest, NextResponse } from "next/server";
import prisma from '@/utils/prisma/prismaClient';
import { getPaypalSubscription } from '@/utils/paypal';
import { safeUpdateSubscriptionStatus, type SubscriptionStatus } from '@/utils/subscription-status';

// PayPal equivalent of /api/subscriptions/verify-payment. PayPal
// subscriptions have no client-supplied signature to check — after the
// buyer approves in the PayPal popup, we ask PayPal's API directly (server
// to server, OAuth-authenticated) whether the subscription is ACTIVE, which
// is itself the source of truth here.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paypal_subscription_id } = body;

    if (!paypal_subscription_id) {
      return NextResponse.json(
        {
          error: 'Missing required parameters',
          errorType: 'MISSING_PARAMETERS',
        },
        { status: 400 }
      );
    }

    const subscription = await prisma.user_subscriptions.findFirst({
      where: { paypal_subscription_id },
    });

    if (!subscription) {
      return NextResponse.json(
        {
          error: 'Subscription not found',
          errorType: 'SUBSCRIPTION_NOT_FOUND',
          paypal_subscription_id,
        },
        { status: 404 }
      );
    }

    const paypalSubscription = await getPaypalSubscription(paypal_subscription_id);

    if (paypalSubscription.status !== 'ACTIVE') {
      return NextResponse.json(
        {
          error: 'Payment signature verification failed',
          errorType: 'SIGNATURE_VERIFICATION_FAILED',
          message: `PayPal subscription status is ${paypalSubscription.status}, not ACTIVE.`,
        },
        { status: 400 }
      );
    }

    const plan = await prisma.subscription_plans.findUnique({
      where: { id: subscription.plan_id },
    });

    let currentEnd = new Date();
    if (plan) {
      const billingMonths = Number(plan.billing_cycle);
      if (!Number.isNaN(billingMonths) && billingMonths > 0) {
        currentEnd.setMonth(currentEnd.getMonth() + billingMonths);
      }
    }

    let updatedSubscription;
    try {
      updatedSubscription = await prisma.$transaction(async (tx) => {
        return await safeUpdateSubscriptionStatus(
          tx,
          subscription.id,
          'ACTIVE' as SubscriptionStatus,
          {
            payment_status: 'COMPLETED',
            current_start: new Date(),
            current_end: currentEnd,
            paid_count: { increment: 1 },
          }
        );
      });
    } catch (error) {
      updatedSubscription = await prisma.user_subscriptions.findUnique({
        where: { id: subscription.id },
      });

      if (!updatedSubscription) {
        throw new Error('Subscription not found after race condition');
      }
    }

    await prisma.subscription_events.create({
      data: {
        event_type: 'payment.verified',
        user_id: subscription.user_id,
        subscription_plan_id: subscription.plan_id,
        metadata: {
          paypal_subscription_id,
          verification_method: 'frontend_callback',
          provider: 'paypal',
        },
      },
    });

    return NextResponse.json(
      {
        status: 'ok',
        message: 'Payment verified successfully',
        subscription: {
          id: updatedSubscription.id,
          status: updatedSubscription.status,
          payment_status: updatedSubscription.payment_status,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('PayPal payment verification error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error during payment verification',
        errorType: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred while verifying the payment. Please try again or contact support.',
      },
      { status: 500 }
    );
  }
}
