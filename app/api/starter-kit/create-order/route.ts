import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import Razorpay from 'razorpay';
import prisma from '@/utils/prisma/prismaClient';

// 7-Day Wheelchair Strength Starter Kit — a fixed, one-time entry product
// (Razorpay Orders API), distinct from the recurring subscription flow
// used for the Fitness plans elsewhere on the site.
const STARTER_KIT_PRICE_INR = 1999;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (!user?.id || userError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    const order = await razorpay.orders.create({
      amount: STARTER_KIT_PRICE_INR * 100, // paise
      currency: 'INR',
      notes: {
        user_id: user.id,
        product: 'starter_kit',
      },
    });

    await prisma.starter_kit_purchases.create({
      data: {
        user_id: user.id,
        razorpay_order_id: order.id,
        amount: STARTER_KIT_PRICE_INR,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      orderId: order.id,
      key: process.env.RAZORPAY_KEY_ID,
      amount: STARTER_KIT_PRICE_INR * 100,
      currency: 'INR',
      name: 'STRENTOR 7-Day Wheelchair Strength Starter Kit',
      description: 'One-time purchase — 7-day adaptive strength starter program',
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
    console.error('Starter kit order creation error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
