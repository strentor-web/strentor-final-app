"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useAction } from "@/hooks/useAction";
import { markAttended } from "@/actions/admin/webinars/mark-attended.action";

export interface RegistrantRow {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  status: "REGISTERED" | "CANCELLED";
  attended: boolean | null;
  createdAt: string;
}

function Row({ registrant }: { registrant: RegistrantRow }) {
  const [attended, setAttended] = useState(!!registrant.attended);

  const { execute, isLoading } = useAction(markAttended, {
    onError: (error) => toast.error(error),
  });

  function toggle(checked: boolean) {
    setAttended(checked);
    execute({ registrationId: registrant.id, attended: checked });
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3">
      <div>
        <p className="font-semibold text-foreground">
          {registrant.fullName} <span className="font-normal text-muted-foreground">({registrant.email})</span>
        </p>
        <p className="text-xs text-muted-foreground">
          {registrant.phone ? `${registrant.phone} • ` : ""}
          {new Date(registrant.createdAt).toLocaleString()}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {registrant.status === "CANCELLED" && <Badge variant="destructive">Cancelled</Badge>}
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <Checkbox checked={attended} onCheckedChange={(v) => toggle(!!v)} disabled={isLoading} />
          Attended
        </label>
      </div>
    </div>
  );
}

export function WebinarRegistrantsList({ registrants }: { registrants: RegistrantRow[] }) {
  if (registrants.length === 0) {
    return <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">No registrants yet.</div>;
  }
  return (
    <div className="space-y-2">
      {registrants.map((registrant) => (
        <Row key={registrant.id} registrant={registrant} />
      ))}
    </div>
  );
}
