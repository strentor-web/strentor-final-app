"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useAction } from "@/hooks/useAction";
import { syncCaseStudyTestimonials } from "@/actions/admin/sync-case-study-testimonials.action";
import { toast } from "sonner";

export function SyncCaseStudyTestimonialsButton() {
  const { execute, isLoading } = useAction(syncCaseStudyTestimonials, {
    onSuccess: (data) => {
      if (data.created === 0) {
        toast.success(`Already in sync — ${data.skipped} case study quote(s) already in the database.`);
      } else {
        toast.success(
          `Added ${data.created} testimonial(s) from case studies: ${data.createdNames.join(", ")}. (${data.skipped} already existed.)`
        );
      }
    },
    onError: (error) => toast.error(error),
  });

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold text-card-foreground">Sync Case Study Testimonials</h3>
          <p className="text-sm text-muted-foreground">
            Any published case study with a quote that isn&apos;t yet in the testimonials database gets
            added — safe to run repeatedly.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={() => execute({})}
          className="shrink-0"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Syncing..." : "Sync Now"}
        </Button>
      </CardContent>
    </Card>
  );
}
