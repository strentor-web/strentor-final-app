// Client-side PayPal JS SDK loader. Mirrors utils/razorpay.ts's
// loadRazorpayScript pattern, but PayPal's SDK is parameterized by query
// string (client ID, currency, intent) rather than being a single fixed
// script — a script tagged for "capture" intent can't also do
// "subscription" intent, so callers must specify which they need and we
// cache one loaded script per intent.

declare global {
  interface Window {
    paypal?: any;
  }
}

const loadedIntents = new Set<string>();

export function loadPaypalScript(intent: "capture" | "subscription"): Promise<boolean> {
  return new Promise((resolve) => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId) {
      console.error("Missing NEXT_PUBLIC_PAYPAL_CLIENT_ID");
      resolve(false);
      return;
    }

    if (window.paypal && loadedIntents.has(intent)) {
      resolve(true);
      return;
    }

    const scriptId = `paypal-sdk-${intent}`;
    const existing = document.getElementById(scriptId);
    if (existing) {
      existing.addEventListener("load", () => {
        loadedIntents.add(intent);
        resolve(true);
      });
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    const params = new URLSearchParams({
      "client-id": clientId,
      currency: "USD",
      intent,
    });
    if (intent === "subscription") {
      params.set("vault", "true");
    }
    script.src = `https://www.paypal.com/sdk/js?${params.toString()}`;
    script.async = true;
    script.onload = () => {
      loadedIntents.add(intent);
      resolve(true);
    };
    script.onerror = () => {
      console.error("Failed to load PayPal script");
      resolve(false);
    };

    document.body.appendChild(script);
  });
}
