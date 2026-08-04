import { Metadata } from "next"
import { validateServerRole } from "@/lib/server-role-validation"
import prisma from "@/utils/prisma/prismaClient"
import { PricingOverridesManager, type OverrideRow } from "@/components/admin/pricing/PricingOverridesManager"
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader"

export const metadata: Metadata = {
  title: "Pricing Overrides - Admin - Strentor",
  description: "Override, exclude, or run time-bounded promotions on top of the PPP pricing engine.",
  robots: { index: false, follow: false },
}

export default async function AdminPricingPage() {
  await validateServerRole(["ADMIN"])

  const overrides = await prisma.pricing_overrides.findMany({
    orderBy: { created_at: "desc" },
  })

  const rows: OverrideRow[] = overrides.map((o) => ({
    id: o.id,
    scope_country: o.scope_country,
    scope_city: o.scope_city,
    scope_segment: o.scope_segment,
    tier_override: o.tier_override,
    multiplier_override: o.multiplier_override?.toString() ?? null,
    min_price_usd: o.min_price_usd?.toString() ?? null,
    max_price_usd: o.max_price_usd?.toString() ?? null,
    is_excluded: o.is_excluded,
    label: o.label,
    starts_at: o.starts_at?.toISOString() ?? null,
    ends_at: o.ends_at?.toISOString() ?? null,
    is_active: o.is_active,
    created_at: o.created_at.toISOString(),
    updated_at: o.updated_at.toISOString(),
  }))

  return (
    <div className="container space-y-6 py-8">
      <DashboardPageHeader
        title="Pricing Overrides"
        description="Correct, exclude, or run a time-bounded promotion for a specific country, city, or customer segment — on top of the static PPP tier table. Every real charge (Razorpay + PayPal, recurring + Lifetime) checks here before falling back to the static formula."
      />

      <PricingOverridesManager initialOverrides={rows} />
    </div>
  )
}
