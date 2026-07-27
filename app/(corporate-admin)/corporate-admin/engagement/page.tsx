import { requireCorporateAdminGroup } from "@/lib/corporate-admin";
import prisma from "@/utils/prisma/prismaClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Engagement - Corporate Dashboard - Strentor",
};

const WINDOW_DAYS = 30;

export default async function CorporateEngagementPage() {
  const { corporateGroup } = await requireCorporateAdminGroup();

  const employees = await prisma.users_profile.findMany({
    where: { corporate_group_id: corporateGroup.id, role: "CORPORATE_EMPLOYEE" },
    select: { id: true },
  });
  const employeeIds = employees.map((e) => e.id);

  const since = new Date();
  since.setDate(since.getDate() - WINDOW_DAYS);

  const [workoutsLogged, checkinsCompleted, activeEmployeeIds] = employeeIds.length
    ? await Promise.all([
        prisma.exercise_logs.count({
          where: { client_id: { in: employeeIds }, performed_date: { gte: since } },
        }),
        prisma.weekly_checkins.count({
          where: { user_id: { in: employeeIds }, created_at: { gte: since } },
        }),
        prisma.exercise_logs.findMany({
          where: { client_id: { in: employeeIds }, performed_date: { gte: since } },
          select: { client_id: true },
          distinct: ["client_id"],
        }),
      ])
    : [0, 0, []];

  const activeCount = new Set(activeEmployeeIds.map((r) => r.client_id)).size;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Engagement</h1>
        <p className="mt-2 text-muted-foreground">
          Aggregate activity across {corporateGroup.company_name}'s employees over the last {WINDOW_DAYS} days.
          This is participation data only — individual health information stays private to each employee and
          their coach.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Active employees</p>
          <p className="mt-2 text-3xl font-bold text-card-foreground">{activeCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">of {employeeIds.length} invited</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Workouts logged</p>
          <p className="mt-2 text-3xl font-bold text-card-foreground">{workoutsLogged}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Weekly check-ins completed</p>
          <p className="mt-2 text-3xl font-bold text-card-foreground">{checkinsCompleted}</p>
        </div>
      </div>

      {employeeIds.length === 0 && (
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
          No employees invited yet — engagement data will appear here once your team starts training.
        </div>
      )}
    </div>
  );
}
