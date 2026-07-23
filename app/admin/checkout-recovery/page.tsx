import { Metadata } from "next"
import { validateServerRole } from "@/lib/server-role-validation"
import prisma from "@/utils/prisma/prismaClient"

export const metadata: Metadata = {
  title: "Checkout & Onboarding Recovery - Admin - Strentor",
  description: "Abandoned pre-signup checkouts and incomplete onboarding, for follow-up.",
  robots: { index: false, follow: false },
}

const STATUS_LABELS: Record<string, string> = {
  started: "Started (contact details only)",
  existing_account: "Has an existing account",
  account_created: "Account created — no payment yet",
  order_created: "Payment started — not confirmed",
  paid: "Paid",
  failed: "Failed",
}

export default async function CheckoutRecoveryPage() {
  await validateServerRole(["ADMIN", "FITNESS_TRAINER_ADMIN"])

  const [checkoutAttempts, onboardingDrafts] = await Promise.all([
    prisma.checkout_attempts.findMany({
      orderBy: { created_at: "desc" },
      take: 200,
    }),
    prisma.onboarding_drafts.findMany({
      orderBy: { updated_at: "desc" },
      take: 200,
    }),
  ])

  const draftUserIds = onboardingDrafts.map((d) => d.user_id)
  const draftProfiles = draftUserIds.length
    ? await prisma.users_profile.findMany({
        where: { id: { in: draftUserIds } },
        select: { id: true, name: true, email: true, phone: true },
      })
    : []
  const profileById = new Map(draftProfiles.map((p) => [p.id, p]))

  return (
    <div className="container space-y-10 py-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Checkout & Onboarding Recovery</h1>
        <p className="mt-1 text-xl text-muted-foreground">
          Every pre-signup checkout attempt and stalled onboarding, so drop-off is visible instead of silent.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Checkout Attempts</h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Contact</th>
                <th className="px-4 py-3 font-semibold">Plan</th>
                <th className="px-4 py-3 font-semibold">Payment</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">When</th>
              </tr>
            </thead>
            <tbody>
              {checkoutAttempts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                    No checkout attempts yet.
                  </td>
                </tr>
              )}
              {checkoutAttempts.map((attempt) => (
                <tr key={attempt.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{attempt.full_name}</td>
                  <td className="px-4 py-3">
                    <div>{attempt.email}</div>
                    <div className="text-muted-foreground">{attempt.phone}</div>
                  </td>
                  <td className="px-4 py-3">
                    {attempt.tier === "lifetime" ? "Lifetime" : `Recurring (${attempt.billing_cycle}mo)`}
                    {" · "}
                    {attempt.sessions_per_week}/week · {attempt.plan_type === "ONLINE" ? "Trainer-Led" : "Self-Paced"}
                  </td>
                  <td className="px-4 py-3 capitalize">{attempt.payment_provider}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        attempt.status === "paid"
                          ? "bg-green-500/10 text-green-600"
                          : attempt.status === "failed"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {STATUS_LABELS[attempt.status] ?? attempt.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {attempt.created_at.toLocaleString("en-GB")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Stalled Onboarding</h2>
        <p className="text-sm text-muted-foreground">
          Accounts that were created but haven't finished the onboarding profile yet.
        </p>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Contact</th>
                <th className="px-4 py-3 font-semibold">Last Step</th>
                <th className="px-4 py-3 font-semibold">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {onboardingDrafts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                    No stalled onboarding right now.
                  </td>
                </tr>
              )}
              {onboardingDrafts.map((draft) => {
                const profile = profileById.get(draft.user_id)
                return (
                  <tr key={draft.id} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">{profile?.name ?? "Unknown"}</td>
                    <td className="px-4 py-3">
                      <div>{profile?.email ?? "—"}</div>
                      <div className="text-muted-foreground">{profile?.phone ?? ""}</div>
                    </td>
                    <td className="px-4 py-3">Step {draft.last_step}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {draft.updated_at.toLocaleString("en-GB")}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
