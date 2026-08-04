import { Metadata } from "next"
import { validateServerRole } from "@/lib/server-role-validation"
import prisma from "@/utils/prisma/prismaClient"
import { SEGMENT_LABELS } from "@/utils/pppPricing"
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader"
import { ScrollReveal, StaggerGroup } from "@/components/motion/ScrollReveal"

export const metadata: Metadata = {
  title: "Pricing Signals - Admin - Strentor",
  description: "Rule-based conversion signals from real checkout data, to inform (not auto-apply) pricing decisions.",
  robots: { index: false, follow: false },
}

// Minimum sample size before a bucket's conversion rate is considered
// meaningful enough to flag — below this, noise dominates and a
// recommendation would just be guessing.
const MIN_SAMPLE_SIZE = 20
const UNDERPERFORM_THRESHOLD = 0.7 // below 70% of the overall rate
const OUTPERFORM_THRESHOLD = 1.3 // above 130% of the overall rate

interface Bucket {
  provider: string
  segment: string
  attempts: number
  paid: number
}

export default async function PricingSignalsPage() {
  await validateServerRole(["ADMIN"])

  const attempts = await prisma.checkout_attempts.findMany({
    select: { payment_provider: true, customer_segment: true, status: true },
  })

  const totalAttempts = attempts.length
  const totalPaid = attempts.filter((a) => a.status === "paid").length
  const overallRate = totalAttempts > 0 ? totalPaid / totalAttempts : 0

  const buckets = new Map<string, Bucket>()
  for (const a of attempts) {
    const segment = a.customer_segment ?? "INDIVIDUAL"
    const key = `${a.payment_provider}|${segment}`
    const bucket = buckets.get(key) ?? { provider: a.payment_provider, segment, attempts: 0, paid: 0 }
    bucket.attempts += 1
    if (a.status === "paid") bucket.paid += 1
    buckets.set(key, bucket)
  }

  const rows = [...buckets.values()]
    .map((b) => {
      const rate = b.attempts > 0 ? b.paid / b.attempts : 0
      const hasEnoughData = b.attempts >= MIN_SAMPLE_SIZE
      let signal: "underperforming" | "outperforming" | "normal" | "insufficient_data" = "insufficient_data"
      if (hasEnoughData && overallRate > 0) {
        if (rate < overallRate * UNDERPERFORM_THRESHOLD) signal = "underperforming"
        else if (rate > overallRate * OUTPERFORM_THRESHOLD) signal = "outperforming"
        else signal = "normal"
      }
      return { ...b, rate, signal }
    })
    .sort((a, b) => b.attempts - a.attempts)

  const flagged = rows.filter((r) => r.signal === "underperforming" || r.signal === "outperforming")

  return (
    <div className="container space-y-8 py-8">
      <DashboardPageHeader
        title="Pricing Signals"
        description="Statistical conversion signals computed from real checkout attempts — not a machine-learning model, and nothing here changes a price automatically. Review flagged buckets and, if you agree, create a corresponding override on the Pricing Overrides page yourself."
      />
      <ScrollReveal delay={0.08} className="rounded-xl border border-[#C9A96A]/40 bg-[#C9A96A]/5 p-4 text-sm text-muted-foreground">
        <strong className="text-foreground">How to read this:</strong> a bucket needs at least {MIN_SAMPLE_SIZE}{" "}
        checkout attempts before it's flagged at all — below that, the conversion rate is too noisy to mean
        anything. "Underperforming" means converting at less than {Math.round(UNDERPERFORM_THRESHOLD * 100)}% of
        the overall rate (a candidate for a lower price, or investigating a non-price friction point).
        "Outperforming" means converting at more than {Math.round(OUTPERFORM_THRESHOLD * 100)}% of the overall
        rate (a candidate for testing a higher price — this segment/provider combo may be under-priced relative
        to demand).
      </ScrollReveal>

      <StaggerGroup className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <ScrollReveal>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm font-medium text-muted-foreground">Overall Conversion Rate</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{(overallRate * 100).toFixed(1)}%</p>
            <p className="mt-1 text-xs text-muted-foreground">{totalPaid} paid / {totalAttempts} attempts</p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.06}>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm font-medium text-muted-foreground">Buckets With Enough Data</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{rows.filter((r) => r.signal !== "insufficient_data").length} / {rows.length}</p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.12}>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm font-medium text-muted-foreground">Flagged for Review</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{flagged.length}</p>
          </div>
        </ScrollReveal>
      </StaggerGroup>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-semibold">Provider</th>
              <th className="px-4 py-3 font-semibold">Segment</th>
              <th className="px-4 py-3 font-semibold">Attempts</th>
              <th className="px-4 py-3 font-semibold">Paid</th>
              <th className="px-4 py-3 font-semibold">Conversion</th>
              <th className="px-4 py-3 font-semibold">Signal</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">No checkout attempts recorded yet.</td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={`${row.provider}-${row.segment}`} className="border-t border-border capitalize">
                <td className="px-4 py-3">{row.provider}</td>
                <td className="px-4 py-3">{SEGMENT_LABELS[row.segment as keyof typeof SEGMENT_LABELS] ?? row.segment}</td>
                <td className="px-4 py-3">{row.attempts}</td>
                <td className="px-4 py-3">{row.paid}</td>
                <td className="px-4 py-3">{(row.rate * 100).toFixed(1)}%</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold normal-case ${
                      row.signal === "underperforming"
                        ? "bg-destructive/10 text-destructive"
                        : row.signal === "outperforming"
                          ? "bg-green-500/10 text-green-600"
                          : row.signal === "normal"
                            ? "bg-muted text-muted-foreground"
                            : "bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    {row.signal === "insufficient_data" ? `Need ${MIN_SAMPLE_SIZE}+ attempts` : row.signal}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
