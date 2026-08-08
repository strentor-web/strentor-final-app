"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/useAction";
import { cancelRegistration } from "@/actions/webinars/cancel-registration.action";

export function CancelRegistrationButton({ registrationId }: { registrationId: string }) {
  const [cancelled, setCancelled] = useState(false);

  const { execute, isLoading } = useAction(cancelRegistration, {
    onSuccess: () => {
      setCancelled(true);
      toast.success("Registration cancelled.");
    },
    onError: (error) => toast.error(error),
  });

  if (cancelled) {
    return <span className="text-sm text-muted-foreground">Cancelled</span>;
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => execute({ id: registrationId })}
      disabled={isLoading}
    >
      Cancel
    </Button>
  );
}
