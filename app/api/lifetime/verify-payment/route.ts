import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/utils/prisma/prismaClient';
import crypto from 'crypto';

// Verifies a Lifetime Membership one-time payment and activates the
// membership. Unlike /api/starter-kit/verify-payment (an info-only unlock),
// this grants a permanent, never-expiring subscription, so — in addition to
// the HMAC signature — the caller must be authenticated and must own the
// purchase being verified.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
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
      where: { provider_order_id: razorpay_order_id, payment_provider: 'razorpay' },
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

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: 'Payment provider not configured', errorType: 'CONFIGURATION_ERROR' },
        { status: 500 }
      );
    }

    // Razorpay Orders (one-time payment) signature formula:
    // sha256(order_id + '|' + payment_id)
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const signatureValid =
      expectedSignature.length === razorpay_signature.length &&
      crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(razorpay_signature));

    if (!signatureValid) {
      return NextResponse.json(
        {
          error: 'Payment signature verification failed',
          errorType: 'SIGNATURE_VERIFICATION_FAILED',
        },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.lifetime_membership_purchases.update({
        where: { id: purchase.id },
        data: { status: 'PAID', provider_payment_id: razorpay_payment_id },
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
    console.error('Lifetime membership payment verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error during payment verification', errorType: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
