import {
  createPaypalOrder,
  capturePaypalOrder,
  createPaypalSubscription,
  cancelPaypalSubscription,
  refundPaypalCapture,
} from "@/utils/paypal";
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

const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE || "https://api-m.paypal.com";

export const paypalGateway: PaymentGateway = {
  async createCheckoutSession(input: CheckoutInput): Promise<CheckoutResult> {
    // PayPal orders are always created in USD in this codebase (see
    // utils/paypal.ts's own header comment: PayPal serves non-Indian/USD
    // customers, Razorpay serves INR). `input.currency` isn't threaded
    // through — mirrors createPaypalOrder's existing fixed-USD signature.
    const order = await createPaypalOrder({
      amount: input.amount,
      description: input.description,
      customId: input.customId,
      returnUrl: input.returnUrl,
      cancelUrl: input.cancelUrl,
    });
    return { id: order.id, status: order.status };
  },

  async createSubscription(input: SubscriptionInput): Promise<SubscriptionResult> {
    const subscription = await createPaypalSubscription({
      planId: input.planId,
      customId: input.customId,
      returnUrl: input.returnUrl,
      cancelUrl: input.cancelUrl,
    });
    return { id: subscription.id, status: subscription.status };
  },

  async cancelSubscription(input: CancelSubscriptionInput): Promise<void> {
    await cancelPaypalSubscription(input.subscriptionId, input.reason ?? "Cancelled by request");
  },

  async refundPayment(input: RefundInput): Promise<RefundResult> {
    // input.paymentId must be a Capture id (purchase_units[].payments.captures[].id),
    // not an Order id — same distinction utils/paypal.ts's refundPaypalCapture documents.
    const refund = await refundPaypalCapture(input.paymentId, input.amount);
    return { id: refund.id, status: refund.status };
  },

  // PayPal doesn't use a plain HMAC like Razorpay — it signs each webhook
  // delivery with a certificate and expects the verification call to be
  // handed the transmission id/time, cert url, and auth algo headers PayPal
  // itself sent, plus a configured webhook id (from the PayPal dashboard).
  // No PayPal webhook route exists in this codebase yet (confirmed by
  // earlier audit — only Razorpay has app/api/webhooks/razorpay), so this
  // is unexercised until one is built; it calls PayPal's real verification
  // endpoint rather than stubbing, so it's correct the day a route lands.
  async verifyWebhook(input: VerifyWebhookInput): Promise<VerifiedEvent> {
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    const h = input.headers;
    if (!webhookId || !h) return { valid: false };

    const transmissionId = h["paypal-transmission-id"];
    const transmissionTime = h["paypal-transmission-time"];
    const certUrl = h["paypal-cert-url"];
    const authAlgo = h["paypal-auth-algo"];
    if (!transmissionId || !transmissionTime || !certUrl || !authAlgo) {
      return { valid: false };
    }

    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    if (!clientId || !clientSecret) return { valid: false };

    const tokenResponse = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    if (!tokenResponse.ok) return { valid: false };
    const { access_token: accessToken } = await tokenResponse.json();

    const verifyResponse = await fetch(`${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transmission_id: transmissionId,
        transmission_time: transmissionTime,
        cert_url: certUrl,
        auth_algo: authAlgo,
        transmission_sig: input.signature,
        webhook_id: webhookId,
        webhook_event: JSON.parse(input.rawBody),
      }),
    });
    if (!verifyResponse.ok) return { valid: false };

    const result = await verifyResponse.json();
    return { valid: result.verification_status === "SUCCESS" };
  },
};
