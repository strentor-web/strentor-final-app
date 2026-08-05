import { Metadata } from "next";
import { validateServerRole } from "@/lib/server-role-validation";
import { getDailyNutrition } from "@/actions/nutrition/get-daily-nutrition.action";
import { NutritionTrackerClient } from "@/components/nutrition/NutritionTrackerClient";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";

export const metadata: Metadata = {
  title: "Nutrition - Strentor",
  description: "Track your daily calorie and macro targets, log meals, and monitor your nutrition.",
  robots: { index: false, follow: false },
};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export default async function NutritionPage() {
  await validateServerRole(["CLIENT", "CORPORATE_EMPLOYEE"]);

  const data = await getDailyNutrition(todayIso());

  return (
    <div className="container py-8 space-y-8">
      <DashboardPageHeader
        title="Nutrition"
        description="Track your daily calories, macros, and water."
      />
      <NutritionTrackerClient initialData={data} />
    </div>
  );
}
