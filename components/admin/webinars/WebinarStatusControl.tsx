"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAction } from "@/hooks/useAction";
import { setWebinarStatus } from "@/actions/admin/webinars/set-webinar-status.action";

type Status = "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED";

export function WebinarStatusControl({ id, status }: { id: string; status: Status }) {
  const [current, setCurrent] = useState<Status>(status);

  const { execute, isLoading } = useAction(setWebinarStatus, {
    onSuccess: () => toast.success("Status updated."),
    onError: (error) => toast.error(error),
  });

  function handleChange(next: string) {
    setCurrent(next as Status);
    execute({ id, status: next as Status });
  }

  return (
    <Select value={current} onValueChange={handleChange} disabled={isLoading}>
      <SelectTrigger className="w-36">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="DRAFT">Draft</SelectItem>
        <SelectItem value="PUBLISHED">Published</SelectItem>
        <SelectItem value="CANCELLED">Cancelled</SelectItem>
        <SelectItem value="COMPLETED">Completed</SelectItem>
      </SelectContent>
    </Select>
  );
}
