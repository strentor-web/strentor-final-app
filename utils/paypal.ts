// Server-only PayPal REST API v2 (Orders) + v1 (Billing Plans/Subscriptions)
// client. Deliberately implemented with raw fetch() rather than an npm SDK
// — mirrors the razorpay npm client's shape closely enough to keep the two
// payment providers' route code structurally parallel (see
// app/api/lifetime/*.ts vs app/api/paypal/lifetime/*.ts).
//
// PayPal is used for non-Indian customers (USD); Razorpay stays the default
// for Indian customers (INR).

const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE || "https://api-m.paypal.com";

function requireCredentials() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("PayPal is not configured (missing PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET)");
  }
  return { clientId, clientSecret };
}

async function getAccessToken(): Promise<string> {
  const { clientId, clientSecret } = requireCredentials();

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`PayPal OAuth token request failed (${response.status}): ${text}`);
  }

  const data = await response.json();
  return data.access_token as string;
}

async function paypalFetch<T = any>(
  path: string,
  init: { method?: string; body?: unknown; extraHeaders?: Record<string, string> } = {}
): Promise<T> {
  const accessToken = await getAccessToken();

  const response = await fetch(`${PAYPAL_API_BASE}${path}`, {
    method: init.method ?? "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...init.extraHeaders,
    },
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(`PayPal API error (${response.status}) on ${path}: ${text}`);
  }

  return data as T;
}

// ---------------------------------------------------------------------------
// Orders API — one-time payments (Lifetime Membership, Starter Kit, etc.)
// ---------------------------------------------------------------------------

export interface PaypalOrder {
  id: string;
  status: string;
  links: { href: string; rel: string; method: string }[];
}

export async function createPaypalOrder(params: {
  amount: number; // USD, major units (e.g. 3599.00)
  description: string;
  customId: string;
  returnUrl: string;
  cancelUrl: string;
}): Promise<PaypalOrder> {
  return paypalFetch<PaypalOrder>("/v2/checkout/orders", {
    method: "POST",
    body: {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: { currency_code: "USD", value: params.amount.toFixed(2) },
          description: params.description,
          custom_id: params.customId,
        },
      ],
      application_context: {
        brand_name: "STRENTOR",
        user_action: "PAY_NOW",
        return_url: params.returnUrl,
        cancel_url: params.cancelUrl,
      },
    },
  });
}

export interface PaypalCapture {
  id: string;
  status: string;
  purchase_units: {
    payments?: { captures?: { id: string; status: string }[] };
  }[];
}

export async function capturePaypalOrder(orderId: string): Promise<PaypalCapture> {
  return paypalFetch<PaypalCapture>(`/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
  });
}

export async function getPaypalOrder(orderId: string): Promise<PaypalCapture> {
  return paypalFetch<PaypalCapture>(`/v2/checkout/orders/${orderId}`);
}

// ---------------------------------------------------------------------------
// Billing Plans + Subscriptions API — recurring payments
// ---------------------------------------------------------------------------

let cachedProductId: string | null = null;

// A single PayPal "Product" (catalog item) backs every Fitness recurring
// plan — PayPal Plans (price points) are what actually vary, same as how
// one Razorpay "Plan" per price point is created under one conceptual
// product. Reuses a product across calls within a warm server instance;
// falls through to creating a fresh one if PayPal has never seen it before.
async function ensureProduct(): Promise<string> {
  if (cachedProductId) return cachedProductId;

  const product = await paypalFetch<{ id: string }>("/v1/catalogs/products", {
    method: "POST",
    body: {
      name: "STRENTOR Fitness Coaching",
      description: "Recurring personal training / fitness coaching subscription",
      type: "SERVICE",
      category: "EXERCISE_AND_FITNESS",
    },
  });

  cachedProductId = product.id;
  return product.id;
}

const PAYPAL_INTERVAL_UNIT = "MONTH";

export async function createPaypalPlan(params: {
  name: string;
  description: string;
  amount: number; // USD, major units, per billing cycle
  intervalMonths: number;
}): Promise<{ id: string }> {
  const productId = await ensureProduct();

  return paypalFetch<{ id: string }>("/v1/billing/plans", {
    method: "POST",
    body: {
      product_id: productId,
      name: params.name,
      description: params.description,
      billing_cycles: [
        {
          frequency: { interval_unit: PAYPAL_INTERVAL_UNIT, interval_count: params.intervalMonths },
          tenure_type: "REGULAR",
          sequence: 1,
          total_cycles: 0, // 0 = indefinite, matches Razorpay's 30-year "effectively forever" total_count
          pricing_scheme: {
            fixed_price: { value: params.amount.toFixed(2), currency_code: "USD" },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        payment_failure_threshold: 3,
      },
    },
  });
}

export interface PaypalSubscription {
  id: string;
  status: string;
  links: { href: string; rel: string; method: string }[];
}

export async function createPaypalSubscription(params: {
  planId: string;
  returnUrl: string;
  cancelUrl: string;
  customId: string;
}): Promise<PaypalSubscription> {
  return paypalFetch<PaypalSubscription>("/v1/billing/subscriptions", {
    method: "POST",
    body: {
      plan_id: params.planId,
      custom_id: params.customId,
      application_context: {
        brand_name: "STRENTOR",
        user_action: "SUBSCRIBE_NOW",
        return_url: params.returnUrl,
        cancel_url: params.cancelUrl,
      },
    },
  });
}

export async function getPaypalSubscription(subscriptionId: string): Promise<{
  id: string;
  status: string;
  custom_id?: string;
  billing_info?: { next_billing_time?: string };
}> {
  return paypalFetch(`/v1/billing/subscriptions/${subscriptionId}`);
}
