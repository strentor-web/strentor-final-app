import { requireCorporateAdminGroup } from "@/lib/corporate-admin";
import prisma from "@/utils/prisma/prismaClient";
import { Metadata } from "next";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";

export const metadata: Metadata = {
  title: "Billing - Corporate Dashboard - Strentor",
};

function formatCurrency(amount: unknown, currency: string): string {
  const value = typeof amount === "object" && amount !== null ? Number(amount) : Number(amount ?? 0);
  return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}

function formatDate(date: Date | null): string {
  if (!date) return "—";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  overdue: "Overdue",
  cancelled: "Cancelled",
};

export default async function CorporateBillingPage() {
  const { corporateGroup } = await requireCorporateAdminGroup();

  const invoices = await prisma.corporate_invoices.findMany({
    where: { corporate_group_id: corporateGroup.id },
    orderBy: { issued_at: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="Billing"
        description={`${corporateGroup.plan_type ? `${corporateGroup.plan_type} plan` : "Corporate account"} — ${corporateGroup.company_name}`}
      />

      {invoices.length === 0 && (
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
          No invoices on file yet. Contact your STRENTOR account manager with billing questions.
        </div>
      )}

      {invoices.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Issued</th>
                <th className="px-4 py-3 font-medium">Due</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-card-foreground">{invoice.description}</td>
                  <td className="px-4 py-3 text-card-foreground">{formatCurrency(invoice.amount, invoice.currency)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{STATUS_LABELS[invoice.status] || invoice.status}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(invoice.issued_at)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(invoice.due_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
