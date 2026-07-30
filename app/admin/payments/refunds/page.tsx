import { Metadata } from "next";
import { validateServerRole } from "@/lib/server-role-validation";
import { RefundConsole } from "@/components/admin/payments/RefundConsole";

export const metadata: Metadata = {
  title: "Refunds - Admin - Strentor",
  description: "Look up and refund Starter Kit or Lifetime Membership purchases.",
  robots: { index: false, follow: false },
};

export default async function AdminRefundsPage() {
  await validateServerRole(["ADMIN"]);

  return (
    <div className="container space-y-6 py-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Refunds</h1>
        <p className="mt-2 text-muted-foreground">
          Search a customer by email, then issue a refund through Razorpay or PayPal directly.
        </p>
      </div>
      <RefundConsole />
    </div>
  );
}
