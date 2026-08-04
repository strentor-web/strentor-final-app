import { requireCorporateAdminGroup } from "@/lib/corporate-admin";
import prisma from "@/utils/prisma/prismaClient";
import { InviteEmployeeButton } from "@/components/corporate-admin/InviteEmployeeButton";
import { Metadata } from "next";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export const metadata: Metadata = {
  title: "Employees - Corporate Dashboard - Strentor",
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default async function CorporateEmployeesPage() {
  const { corporateGroup } = await requireCorporateAdminGroup();

  const employees = await prisma.users_profile.findMany({
    where: { corporate_group_id: corporateGroup.id, role: "CORPORATE_EMPLOYEE" },
    orderBy: { created_at: "desc" },
    select: { id: true, name: true, email: true, created_at: true, onboarding_completed: true },
  });

  return (
    <div className="flex flex-col gap-6">
      <ScrollReveal className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Employees</h1>
          <p className="mt-2 text-muted-foreground">
            {corporateGroup.member_limit
              ? `${employees.length} of ${corporateGroup.member_limit} seats used`
              : `${employees.length} employees`}
          </p>
        </div>
        <InviteEmployeeButton />
      </ScrollReveal>

      {employees.length === 0 && (
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
          No employees invited yet. Use "Invite Employee" to send your first invitation.
        </div>
      )}

      {employees.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Invited</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-card-foreground">{employee.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{employee.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {employee.onboarding_completed ? "Active" : "Invited"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(employee.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
