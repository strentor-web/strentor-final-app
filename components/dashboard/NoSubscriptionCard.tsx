import Link from "next/link";
import { CreditCard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export function NoSubscriptionCard() {
  return (
    <div className="border rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Active Subscriptions</h2>
      </div>

      <EmptyState
        icon={CreditCard}
        title="No Active Subscription Found"
        description="Subscribe to a plan to get access to personalized workout plans and trainer guidance."
        action={
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/settings/subscription" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Subscribe Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        }
      />
    </div>
  );
}
