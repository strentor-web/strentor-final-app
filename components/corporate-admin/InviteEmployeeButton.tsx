"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { InviteEmployeeModal } from "@/components/corporate-admin/InviteEmployeeModal";

export function InviteEmployeeButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-2">
        <UserPlus className="h-4 w-4" />
        Invite Employee
      </Button>
      <InviteEmployeeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
