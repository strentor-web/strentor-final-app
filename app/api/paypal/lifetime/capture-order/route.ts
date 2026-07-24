import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/utils/prisma/prismaClient';
import { capturePaypalOrder } from '@/utils/paypal';

// PayPal equivalent of /api/lifetime/verify-payment. PayPal Orders don't
// carry an HMAC signature the way Razorpay does — capturing the order via
// a server-to-server, OAuth-authenticated PayPal API call (below) is itself
// the proof of payment, so there's nothing further to verify beyond that
// call succeeding with status COMPLETED and the caller owning the purchase.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing required parameters', errorType: 'MISSING_PARAMETERS' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (!user?.id || userError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const purchase = await prisma.lifetime_membership_purchases.findFirst({
      where: { provider_order_id: orderId, payment_provider: 'paypal' },
    });

    if (!purchase) {
      return NextResponse.json(
        { error: 'Purchase not found', errorType: 'PURCHASE_NOT_FOUND' },
        { status: 404 }
      );
    }

    if (purchase.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Already verified — idempotent no-op (double-click / retry from client).
    if (purchase.status === 'PAID') {
      return NextResponse.json({ status: 'ok', message: 'Payment already verified' });
    }

    const capture = await capturePaypalOrder(orderId);

    if (capture.status !== 'COMPLETED') {
      return NextResponse.json(
        {
          error: 'Payment could not be captured',
          errorType: 'CAPTURE_FAILED',
        },
        { status: 400 }
      );
    }

    const captureId = capture.purchase_units?.[0]?.payments?.captures?.[0]?.id ?? orderId;

    await prisma.$transaction([
      prisma.lifetime_membership_purchases.update({
        where: { id: purchase.id },
        data: { status: 'PAID', provider_payment_id: captureId },
      }),
      prisma.user_subscriptions.create({
        data: {
          user_id: purchase.user_id,
          plan_id: purchase.plan_id,
          status: 'ACTIVE',
          payment_status: 'COMPLETED',
          start_date: new Date(),
          end_date: null,
          current_start: new Date(),
          current_end: null,
          next_charge_at: null,
          paid_count: 1,
          cancel_at_cycle_end: false,
          city: purchase.city,
          customer_segment: purchase.customer_segment,
        },
      }),
    ]);

    return NextResponse.json({ status: 'ok', message: 'Payment verified successfully' });
  } catch (error) {
    console.error('PayPal lifetime membership payment capture error:', error);
    return NextResponse.json(
      { error: 'Internal server error during payment verification', errorType: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
