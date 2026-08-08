"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function WebinarRegistrationForm({
  webinarId,
  defaultName = "",
  defaultEmail = "",
}: {
  webinarId: string;
  defaultName?: string;
  defaultEmail?: string;
}) {
  const [fullName, setFullName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [phone, setPhone] = useState("");
  // Honeypot field — kept out of visual layout via sr-only + tabIndex -1,
  // not display:none, since some spam bots skip fields with display:none.
  const [website, setWebsite] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = fullName.trim().length > 0 && email.trim().length > 0 && !isSubmitting;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/webinars/${webinarId}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          sourcePage: `/webinars/${webinarId}`,
          website,
        }),
      });

      if (response.status === 429) {
        toast.error("Too many attempts right now. Please try again in a few minutes.");
        return;
      }
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        toast.error(result?.error || "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center">
        <h3 className="text-lg font-bold text-card-foreground">You're registered!</h3>
        <p className="mt-2 text-muted-foreground">Check your email for the confirmation and join link.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-bold text-card-foreground">Register for this webinar</h3>
      <div>
        <Label htmlFor="webinar-name">Full name</Label>
        <Input id="webinar-name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="webinar-email">Email</Label>
        <Input
          id="webinar-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="webinar-phone">Phone (optional)</Label>
        <Input id="webinar-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      <div className="absolute -left-[9999px]" aria-hidden="true">
        <Label htmlFor="webinar-website">Website</Label>
        <Input
          id="webinar-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <Button
        type="submit"
        disabled={!canSubmit}
        className="w-full rounded-full bg-[#C9A96A] px-6 hover:bg-[#C9A96A]/90"
      >
        {isSubmitting ? "Registering…" : "Register"}
      </Button>
    </form>
  );
}
