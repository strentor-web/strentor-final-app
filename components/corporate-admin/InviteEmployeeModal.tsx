"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, User, UserPlus } from "lucide-react";
import { inviteEmployee } from "@/actions/corporate/invite-employee.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface InviteEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteEmployeeModal({ isOpen, onClose }: InviteEmployeeModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Please enter a valid email";
    if (!name.trim()) newErrors.name = "Name is required";
    else if (name.trim().length < 2) newErrors.name = "Name must be at least 2 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setIsLoading(true);
    try {
      const result = await inviteEmployee({ email: email.trim(), name: name.trim() });
      if (result.data) {
        toast.success(`Invitation sent to ${email}`);
        handleClose();
        router.refresh();
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleClose() {
    setEmail("");
    setName("");
    setErrors({});
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite Employee
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <Label htmlFor="invite-employee-email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="invite-employee-email"
                type="email"
                placeholder="employee@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`pl-9 ${errors.email ? "border-red-500" : ""}`}
              />
            </div>
            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="invite-employee-name">Full name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="invite-employee-name"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`pl-9 ${errors.name ? "border-red-500" : ""}`}
              />
            </div>
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
          </div>

          <div className="rounded-md border border-border bg-muted/50 p-3">
            <p className="text-sm text-muted-foreground">
              An email invitation will be sent with instructions to set a password and access their coaching
              dashboard.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={isLoading} className="gap-2">
              {isLoading ? "Sending..." : (
                <>
                  <Mail className="h-4 w-4" />
                  Send Invitation
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
