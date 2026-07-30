import crypto from "crypto";
import Razorpay from "razorpay";
import type {
  PaymentGateway,
  CheckoutInput,
  CheckoutResult,
  SubscriptionInput,
  SubscriptionResult,
  CancelSubscriptionInput,
  RefundInput,
  RefundResult,
  VerifyWebhookInput,
  VerifiedEvent,
} from "./types";

function client(): Razorpay {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay is not configured (missing RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET)");
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

export const razorpayGateway: PaymentGateway = {
  async createCheckoutSession(input: CheckoutInput): Promise<CheckoutResult> {
    const order = await client().orders.create({
      amount: Math.round(input.amount * 100), // paise
      currency: input.currency,
      notes: { user_id: input.customId, description: input.description },
    });
    return { id: order.id, status: order.status };
  },

  async createSubscription(input: SubscriptionInput): Promise<SubscriptionResult> {
    // total_count mirrors the existing pattern in app/api/subscriptions/create
    // — a large fixed count standing in for "renews indefinitely until
    // cancelled," since Razorpay Subscriptions require a finite total_count.
    const subscription = await client().subscriptions.create({
      plan_id: input.planId,
      customer_notify: 1,
      total_count: 360, // 30 years of monthly cycles
      notes: { user_id: input.customId },
    });
    return { id: subscription.id, status: subscription.status };
  },

  async cancelSubscription(input: CancelSubscriptionInput): Promise<void> {
    await client().subscriptions.cancel(input.subscriptionId, input.atCycleEnd ?? true);
  },

  async refundPayment(input: RefundInput): Promise<RefundResult> {
    const refund = await client().payments.refund(
      input.paymentId,
      input.amount !== undefined
        ? { amount: Math.round(input.amount * 100), notes: input.reason ? { reason: input.reason } : undefined }
        : { notes: input.reason ? { reason: input.reason } : undefined }
    );
    return { id: refund.id, status: refund.status };
  },

  // Covers the webhook-event signature scheme specifically (x-razorpay-signature
  // over the raw request body, see app/api/webhooks/razorpay/route.ts). Order
  // payments and subscription payments use two DIFFERENT HMAC payload formats
  // of their own (order_id|payment_id, and payment_id|subscription_id
  // respectively) — those stay verified inline in
  // app/api/lifetime/verify-payment and app/api/subscriptions/verify-payment,
  // since forcing all three schemes through one generic method would obscure
  // which format applies where.
  async verifyWebhook(input: VerifyWebhookInput): Promise<VerifiedEvent> {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) return { valid: false };

    const expected = crypto.createHmac("sha256", secret).update(input.rawBody).digest("hex");
    try {
      const valid =
        expected.length === input.signature.length &&
        crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(input.signature, "hex"));
      return { valid };
    } catch {
      return { valid: false };
    }
  },
};
