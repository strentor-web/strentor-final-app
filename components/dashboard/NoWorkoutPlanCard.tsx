import { Dumbbell, MessageCircle } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export function NoWorkoutPlanCard() {
  return (
    <div className="md:col-span-2 border rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Workout Plan Progress</h2>

      <EmptyState
        icon={Dumbbell}
        title="No Active Workout Plan"
        description="Currently you got no plans assigned, please contact your trainer for a personalized workout plan based on your goals."
        action={
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm">Your trainer will create a customized plan for you</span>
          </div>
        }
      />
    </div>
  );
}
