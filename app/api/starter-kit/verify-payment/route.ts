import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma/prismaClient';
import crypto from 'crypto';

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

    const purchase = await prisma.starter_kit_purchases.findFirst({
      where: { razorpay_order_id },
    });

    if (!purchase) {
      return NextResponse.json(
        { error: 'Purchase not found', errorType: 'PURCHASE_NOT_FOUND' },
        { status: 404 }
      );
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

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        {
          error: 'Payment signature verification failed',
          errorType: 'SIGNATURE_VERIFICATION_FAILED',
        },
        { status: 400 }
      );
    }

    await prisma.starter_kit_purchases.update({
      where: { id: purchase.id },
      data: {
        status: 'PAID',
        razorpay_payment_id,
      },
    });

    return NextResponse.json({ status: 'ok', message: 'Payment verified successfully' });
  } catch (error) {
    console.error('Starter kit payment verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error during payment verification', errorType: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
