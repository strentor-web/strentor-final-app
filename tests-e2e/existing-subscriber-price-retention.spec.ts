import { test } from "@playwright/test";

// "Existing subscriber retains their price after an admin override change"
// needs a real subscription_plans + user_subscriptions pair, which only
// gets created by actually calling /api/subscriptions/ensure-plan and
// /api/subscriptions/create against a live Razorpay (or PayPal) sandbox —
// this is the explicit scope boundary called out in the pricing-system
// plan's Phase H section: these E2E tests stop at the payment-gateway
// invocation boundary, since no sandbox credentials exist in this
// environment. The underlying guarantee this scenario protects — a
// PATCH/rollback on pricing_overrides never mutates a subscription_plans
// row already referenced by an active user_subscriptions row, only
// deactivates it so NEW signups get a fresh row — is covered without a
// payment sandbox by:
//   - utils/pricingOverrides.test.ts ("invalidateCachedPlansForOverride
//     deactivates only the active subscription_plans rows...")
//   - the code comment + fix in app/api/admin/pricing/overrides/[id]/route.ts
//     (the stale-cache bug this session's Phase 0 found and fixed)
test.skip(
  "existing subscriber retains their price after an admin override change (requires a live Razorpay/PayPal sandbox — see file comment; covered at the unit level by utils/pricingOverrides.test.ts instead)",
  () => {}
);
