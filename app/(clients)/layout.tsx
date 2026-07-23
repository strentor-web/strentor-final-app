import { getActiveSubscriptions } from "@/actions/subscriptions/get-active-subscriptions.action";
import { DashboardAuthGate } from "@/components/dashboard/dashboard-auth-gate";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Drives category-gated nav items (e.g. AI Trainer). Defensively caught —
  // a failure here must degrade to "no active categories", not crash every
  // page in the client dashboard.
  let activeSubscriptionCategories: string[] = [];
  try {
    const result = await getActiveSubscriptions({});
    activeSubscriptionCategories = Array.from(
      new Set((result.data ?? []).map((sub) => sub.plan.category))
    );
  } catch (error) {
    console.error("Failed to load active subscription categories:", error);
  }

  return (
    <DashboardAuthGate activeSubscriptionCategories={activeSubscriptionCategories}>
      {children}
    </DashboardAuthGate>
  );
}
