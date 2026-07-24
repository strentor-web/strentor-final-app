import { Metadata } from "next"
import { validateServerRole } from "@/lib/server-role-validation"
import prisma from "@/utils/prisma/prismaClient"
import { TIER_LABELS, SEGMENT_LABELS, PppTier } from "@/utils/pppPricing"

export const metadata: Metadata = {
  title: "Pricing Analytics - Admin - Strentor",
  description: "Revenue, conversion, and pricing-tier breakdowns from real checkout and subscription data.",
  robots: { index: false, follow: false },
}

function money(amount: number, currency: string) {
  const symbol = currency === "INR" ? "₹" : currency === "AED" ? "AED " : "$";
  return `${symbol}${Math.round(amount).toLocaleString()}`;
}

function StatCard({ label, value, caption }: { label: string; value: string; caption?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
      {caption && <p className="mt-1 text-xs text-muted-foreground">{caption}</p>}
    </div>
  );
}

export default async function PricingAnalyticsPage() {
  await validateServerRole(["ADMIN"])

  const [checkoutAttempts, lifetimePurchases, activeSubscriptions, auditEntries, activeOverrides] = await Promise.all([
    prisma.checkout_attempts.findMany({ select: { status: true, payment_provider: true, customer_segment: true, city: true } }),
    prisma.lifetime_membership_purchases.findMany({
      select: { status: true, amount: true, currency: true, payment_provider: true, customer_segment: true, city: true, plan_id: true },
    }),
    prisma.user_subscriptions.findMany({
      where: { status: "ACTIVE" },
      select: {
        customer_segment: true,
        city: true,
        subscription_plans: { select: { price: true, currency: true, pricing_tier: true, razorpay_plan_id: true, paypal_plan_id: true } },
      },
    }),
    prisma.pricing_audit_log.groupBy({ by: ["action"], _count: { action: true } }),
    prisma.pricing_overrides.count({ where: { is_active: true } }),
  ])

  // --- Funnel ---
  const totalAttempts = checkoutAttempts.length
  const statusCounts = checkoutAttempts.reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] ?? 0) + 1
    return acc
  }, {})
  const paidCount = statusCounts["paid"] ?? 0
  const conversionRate = totalAttempts > 0 ? (paidCount / totalAttempts) * 100 : 0

  // --- Lifetime revenue (one-time, real captured payments) ---
  const paidLifetime = lifetimePurchases.filter((p) => p.status === "PAID")
  const lifetimeRevenueByCurrency = paidLifetime.reduce<Record<string, number>>((acc, p) => {
    acc[p.currency] = (acc[p.currency] ?? 0) + Number(p.amount)
    return acc
  }, {})

  // --- Recurring "book value" — sum of current plan price for every
  // active subscription. Not a true MRR calc across mixed billing cycles,
  // but a reasonable at-a-glance figure for a brand-new payment system. ---
  const recurringByCurrency = activeSubscriptions.reduce<Record<string, number>>((acc, s) => {
    const currency = s.subscription_plans.currency
    acc[currency] = (acc[currency] ?? 0) + Number(s.subscription_plans.price)
    return acc
  }, {})

  // --- By provider (Razorpay = India, PayPal = international) ---
  const attemptsByProvider = checkoutAttempts.reduce<Record<string, number>>((acc, a) => {
    acc[a.payment_provider] = (acc[a.payment_provider] ?? 0) + 1
    return acc
  }, {})
  const paidByProvider = checkoutAttempts
    .filter((a) => a.status === "paid")
    .reduce<Record<string, number>>((acc, a) => {
      acc[a.payment_provider] = (acc[a.payment_provider] ?? 0) + 1
      return acc
    }, {})

  // --- By tier (from active subscriptions + lifetime purchases' plan) ---
  const tierCounts = new Map<number, number>()
  for (const s of activeSubscriptions) {
    const t = s.subscription_plans.pricing_tier
    if (t !== null && t !== undefined) tierCounts.set(t, (tierCounts.get(t) ?? 0) + 1)
  }

  // --- By segment (real field, both purchase types) ---
  const segmentCounts = new Map<string, number>()
  for (const p of paidLifetime) {
    const seg = p.customer_segment ?? "INDIVIDUAL"
    segmentCounts.set(seg, (segmentCounts.get(seg) ?? 0) + 1)
  }
  for (const s of activeSubscriptions) {
    const seg = s.customer_segment ?? "INDIVIDUAL"
    segmentCounts.set(seg, (segmentCounts.get(seg) ?? 0) + 1)
  }

  // Sponsored-segment checkouts never reach checkout_attempts today — see
  // caption below — so this will read 0 until that's separately tracked.
  const sponsoredSegments = new Set(["CORPORATE_SPONSORED", "GOVERNMENT_SPONSORED", "NGO_SPONSORED", "INSURANCE_SPONSORED"])
  const sponsoredAttempts = checkoutAttempts.filter((a) => a.customer_segment && sponsoredSegments.has(a.customer_segment)).length

  const auditByAction = auditEntries.reduce<Record<string, number>>((acc, e) => {
    acc[e.action] = e._count.action
    return acc
  }, {})

  return (
    <div className="container space-y-10 py-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Pricing Analytics</h1>
        <p className="mt-1 text-xl text-muted-foreground">
          Computed directly from real checkout attempts, Lifetime purchases, and active subscriptions — not a
          projection or an external analytics tool.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Checkout Funnel</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Total Attempts" value={totalAttempts.toLocaleString()} />
          <StatCard label="Paid" value={paidCount.toLocaleString()} />
          <StatCard label="Conversion Rate" value={`${conversionRate.toFixed(1)}%`} caption="Paid / total attempts" />
          <StatCard label="Active Overrides" value={activeOverrides.toLocaleString()} />
        </div>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Count</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(statusCounts).map(([status, count]) => (
                <tr key={status} className="border-t border-border">
                  <td className="px-4 py-3 capitalize">{status.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3">{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Revenue</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm font-medium text-muted-foreground">Lifetime Membership revenue (captured)</p>
            {Object.keys(lifetimeRevenueByCurrency).length === 0 ? (
              <p className="mt-1 text-2xl font-bold text-foreground">—</p>
            ) : (
              Object.entries(lifetimeRevenueByCurrency).map(([currency, amount]) => (
                <p key={currency} className="mt-1 text-2xl font-bold text-foreground">{money(amount, currency)}</p>
              ))
            )}
            <p className="mt-1 text-xs text-muted-foreground">{paidLifetime.length} paid Lifetime purchase(s)</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm font-medium text-muted-foreground">Recurring book value (current rate)</p>
            {Object.keys(recurringByCurrency).length === 0 ? (
              <p className="mt-1 text-2xl font-bold text-foreground">—</p>
            ) : (
              Object.entries(recurringByCurrency).map(([currency, amount]) => (
                <p key={currency} className="mt-1 text-2xl font-bold text-foreground">{money(amount, currency)}</p>
              ))
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              {activeSubscriptions.length} active subscription(s) — sum of each plan's per-cycle price, not a true
              annualized MRR across mixed billing cycles
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">By Payment Provider</h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-semibold">Provider</th>
                <th className="px-4 py-3 font-semibold">Attempts</th>
                <th className="px-4 py-3 font-semibold">Paid</th>
                <th className="px-4 py-3 font-semibold">Conversion</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(attemptsByProvider).map(([provider, count]) => {
                const paid = paidByProvider[provider] ?? 0
                return (
                  <tr key={provider} className="border-t border-border capitalize">
                    <td className="px-4 py-3">{provider}</td>
                    <td className="px-4 py-3">{count}</td>
                    <td className="px-4 py-3">{paid}</td>
                    <td className="px-4 py-3">{count > 0 ? `${((paid / count) * 100).toFixed(1)}%` : "—"}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">By Pricing Tier (active subscriptions)</h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-semibold">Tier</th>
                <th className="px-4 py-3 font-semibold">Active Subscriptions</th>
              </tr>
            </thead>
            <tbody>
              {tierCounts.size === 0 && (
                <tr>
                  <td colSpan={2} className="px-4 py-6 text-center text-muted-foreground">No active subscriptions yet.</td>
                </tr>
              )}
              {[...tierCounts.entries()].sort(([a], [b]) => a - b).map(([tier, count]) => (
                <tr key={tier} className="border-t border-border">
                  <td className="px-4 py-3">{TIER_LABELS[tier as PppTier] ?? `Tier ${tier}`}</td>
                  <td className="px-4 py-3">{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">By Customer Segment</h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-semibold">Segment</th>
                <th className="px-4 py-3 font-semibold">Paid Lifetime + Active Recurring</th>
              </tr>
            </thead>
            <tbody>
              {[...segmentCounts.entries()].sort(([, a], [, b]) => b - a).map(([segment, count]) => (
                <tr key={segment} className="border-t border-border">
                  <td className="px-4 py-3">{SEGMENT_LABELS[segment as keyof typeof SEGMENT_LABELS] ?? segment}</td>
                  <td className="px-4 py-3">{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">
          Sponsored-segment checkouts (Corporate/Government/NGO/Insurance Sponsored): {sponsoredAttempts} tracked
          checkout attempt(s). Selecting a sponsored segment on /checkout routes straight to the Contact Us form
          rather than starting a checkout attempt, so this undercounts real interest — worth tracking separately
          (e.g. a form-submission counter) if sponsorship volume matters to you.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Pricing Changes (Audit Log)</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {(["CREATE", "UPDATE", "DELETE", "ROLLBACK"] as const).map((action) => (
            <StatCard key={action} label={action} value={(auditByAction[action] ?? 0).toLocaleString()} />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Every pricing change here is a manual admin action — there is no AI system autonomously changing prices
          in this app; see the Pricing Signals page for statistical, human-reviewed recommendations only.
        </p>
      </section>
    </div>
  )
}
