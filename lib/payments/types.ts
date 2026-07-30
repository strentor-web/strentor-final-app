// Shared shape both payment providers implement. Existing routes
// (app/api/subscriptions/*, app/api/lifetime/*, app/api/paypal/*) already
// call Razorpay's SDK / utils/paypal.ts directly and are deliberately left
// as-is — they're working, production pricing-computation code and
// refactoring them without a real payment sandbox to test against is a
// real regression risk for no functional gain. This abstraction exists for
// new call sites (see razorpayGateway.ts/paypalGateway.ts's refund
// support, used by app/api/admin/payments/refund) and as the intended
// target for a gradual migration later.

export interface CheckoutInput {
  amount: number; // major units, in `currency`
  currency: string;
  description: string;
  customId: string; // user id — carried through to the provider so webhooks can match it back
  returnUrl: string;
  cancelUrl: string;
}

export interface CheckoutResult {
  id: string; // provider order id
  status: string;
}

export interface SubscriptionInput {
  planId: string; // provider-side plan/billing-plan id (already provisioned)
  customId: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface SubscriptionResult {
  id: string; // provider subscription id
  status: string;
}

export interface CancelSubscriptionInput {
  subscriptionId: string;
  reason?: string;
  atCycleEnd?: boolean;
}

export interface RefundInput {
  paymentId: string; // Razorpay payment id, or PayPal capture id
  amount?: number; // major units; omit for a full refund
  reason?: string;
}

export interface RefundResult {
  id: string;
  status: string;
}

export interface VerifyWebhookInput {
  rawBody: string;
  signature: string;
  // Provider-specific extra data a given gateway's verification needs beyond
  // a plain HMAC (e.g. PayPal's transmission id/time + cert url headers,
  // required by its certificate-based /v1/notifications/verify-webhook-signature
  // call). Razorpay's HMAC-only scheme ignores this.
  headers?: Record<string, string>;
}

export interface VerifiedEvent {
  valid: boolean;
}

export interface PaymentGateway {
  createCheckoutSession(input: CheckoutInput): Promise<CheckoutResult>;
  createSubscription(input: SubscriptionInput): Promise<SubscriptionResult>;
  cancelSubscription(input: CancelSubscriptionInput): Promise<void>;
  refundPayment(input: RefundInput): Promise<RefundResult>;
  verifyWebhook(input: VerifyWebhookInput): Promise<VerifiedEvent>;
}
