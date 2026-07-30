"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Purchase {
  source: "starter_kit" | "lifetime";
  id: string;
  user: { id: string; email: string; name: string } | null;
  provider: "razorpay" | "paypal";
  paymentId: string | null;
  amount: string;
  currency: string;
  status: string;
  createdAt: string;
}

function RefundRow({ purchase, onRefunded }: { purchase: Purchase; onRefunded: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refundable = purchase.status === "PAID" && !!purchase.paymentId;

  async function submitRefund() {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/payments/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: purchase.source,
          id: purchase.id,
          amount: amount ? Number(amount) : undefined,
          reason: reason || undefined,
        }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.error(body.error || "Refund failed.");
        return;
      }
      toast.success(`Refund issued via ${purchase.provider} (${body.refund?.id}).`);
      onRefunded(purchase.id);
      setOpen(false);
    } catch {
      toast.error("Network error.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-foreground">
            {purchase.user?.name ?? "Unknown"}{" "}
            <span className="text-muted-foreground font-normal">— {purchase.user?.email}</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {purchase.source === "starter_kit" ? "Starter Kit" : "Lifetime Membership"} · {purchase.provider} ·{" "}
            {purchase.currency} {purchase.amount}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {new Date(purchase.createdAt).toLocaleDateString()} · payment id: {purchase.paymentId ?? "—"}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant={purchase.status === "REFUNDED" ? "secondary" : purchase.status === "PAID" ? "default" : "outline"}>
            {purchase.status}
          </Badge>
          {refundable && (
            <Button size="sm" variant="outline" onClick={() => setOpen((v) => !v)}>
              {open ? "Cancel" : "Refund"}
            </Button>
          )}
        </div>
      </div>
      {open && (
        <div className="mt-4 flex flex-wrap items-end gap-3 border-t pt-4">
          <div>
            <Label htmlFor={`amount-${purchase.id}`}>Amount (blank = full refund)</Label>
            <Input
              id={`amount-${purchase.id}`}
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={purchase.amount}
              className="w-40"
            />
          </div>
          <div className="flex-1 min-w-48">
            <Label htmlFor={`reason-${purchase.id}`}>Reason (optional)</Label>
            <Input id={`reason-${purchase.id}`} value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <Button size="sm" onClick={submitRefund} disabled={isSubmitting}>
            {isSubmitting ? "Processing…" : "Confirm refund"}
          </Button>
        </div>
      )}
    </div>
  );
}

export function RefundConsole() {
  const [query, setQuery] = useState("");
  const [purchases, setPurchases] = useState<Purchase[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  async function search() {
    if (query.trim().length < 3) {
      toast.error("Enter at least 3 characters of the customer's email.");
      return;
    }
    setIsSearching(true);
    try {
      const response = await fetch(`/api/admin/payments/search?email=${encodeURIComponent(query.trim())}`);
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.error(body.error || "Search failed.");
        return;
      }
      setPurchases(body.purchases);
    } catch {
      toast.error("Network error.");
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3">
        <div className="flex-1 max-w-sm">
          <Label htmlFor="refund-search">Customer email</Label>
          <Input
            id="refund-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="name@example.com"
          />
        </div>
        <Button onClick={search} disabled={isSearching}>
          {isSearching ? "Searching…" : "Search"}
        </Button>
      </div>

      {purchases !== null && (
        <div className="space-y-3">
          {purchases.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">
              No Starter Kit or Lifetime Membership purchases found for that email.
            </div>
          ) : (
            purchases.map((p) => (
              <RefundRow
                key={`${p.source}-${p.id}`}
                purchase={p}
                onRefunded={(id) =>
                  setPurchases((prev) => prev?.map((row) => (row.id === id ? { ...row, status: "REFUNDED" } : row)) ?? null)
                }
              />
            ))
          )}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Only Starter Kit and Lifetime Membership purchases can be refunded here — recurring subscription charges
        aren&apos;t tracked as individual payments in the database, so a specific charge can&apos;t be looked up and
        refunded from this console.
      </p>
    </div>
  );
}
