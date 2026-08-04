import { Metadata } from "next";
import { validateServerRole } from "@/lib/server-role-validation";
import { RefundConsole } from "@/components/admin/payments/RefundConsole";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export const metadata: Metadata = {
  title: "Refunds - Admin - Strentor",
  description: "Look up and refund Starter Kit or Lifetime Membership purchases.",
  robots: { index: false, follow: false },
};

export default async function AdminRefundsPage() {
  await validateServerRole(["ADMIN"]);

  return (
    <div className="container space-y-6 py-8">
      <DashboardPageHeader
        title="Refunds"
        description="Search a customer by email, then issue a refund through Razorpay or PayPal directly."
      />
      <ScrollReveal>
        <RefundConsole />
      </ScrollReveal>
    </div>
  );
}
