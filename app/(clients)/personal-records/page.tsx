import { getMaxLiftsData } from "@/actions/client-workout/get-max-lifts.action";
import { PersonalRecordsClient } from "@/components/personal-records/PersonalRecordsClient";
import { validateServerRole } from "@/lib/server-role-validation";
import { Metadata } from "next";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export const metadata: Metadata = {
  title: "Personal Records - Strentor",
  description: "Track your personal records and fitness progress over time. View your best lifts, running times, and athletic achievements.",
  keywords: ["personal records", "fitness tracking", "workout progress", "best lifts", "athletic achievements"],
};

export default async function PersonalRecords() {
  // Validate user authentication and CLIENT role
  const { user } = await validateServerRole(['CLIENT', 'CORPORATE_EMPLOYEE']);
  
  const { uniqueExercises, allMaxLifts } = await getMaxLiftsData();
  
  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="Personal Records"
        description="Track your personal records and progress over time"
      />

      <ScrollReveal>
        <PersonalRecordsClient
          uniqueExercises={uniqueExercises}
          allMaxLifts={allMaxLifts}
        />
      </ScrollReveal>
    </div>
  );
}