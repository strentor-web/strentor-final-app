"use client";

import { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CUSTOMER_SEGMENTS, SEGMENT_LABELS, TIER_LABELS } from "@/utils/pppPricing";

export interface OverrideRow {
  id: string;
  scope_country: string | null;
  scope_city: string | null;
  scope_segment: string | null;
  tier_override: number | null;
  multiplier_override: string | null;
  min_price_usd: string | null;
  max_price_usd: string | null;
  is_excluded: boolean;
  label: string | null;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface AuditEntry {
  id: string;
  override_id: string | null;
  action: string;
  changed_by: string | null;
  changed_at: string;
  notes: string | null;
}

const emptyForm = {
  scopeCountry: "",
  scopeCity: "",
  scopeSegment: "",
  tierOverride: "",
  multiplierOverride: "",
  minPriceUsd: "",
  maxPriceUsd: "",
  isExcluded: false,
  label: "",
  startsAt: "",
  endsAt: "",
};

function scopeLabel(row: OverrideRow): string {
  const parts = [row.scope_country ?? "Every country", row.scope_city ?? undefined, row.scope_segment ? SEGMENT_LABELS[row.scope_segment as keyof typeof SEGMENT_LABELS] : undefined];
  return parts.filter(Boolean).join(" · ");
}

function isScheduled(row: OverrideRow): boolean {
  return row.is_active && !!row.starts_at && new Date(row.starts_at).getTime() > Date.now();
}

export function PricingOverridesManager({ initialOverrides }: { initialOverrides: OverrideRow[] }) {
  const [overrides, setOverrides] = useState<OverrideRow[]>(initialOverrides);
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedAuditFor, setExpandedAuditFor] = useState<string | null>(null);
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  async function refresh() {
    const response = await fetch("/api/admin/pricing/overrides");
    if (response.ok) {
      const data = await response.json();
      setOverrides(data.overrides);
    }
  }

  async function handleCreate() {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/pricing/overrides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scopeCountry: form.scopeCountry || undefined,
          scopeCity: form.scopeCity || undefined,
          scopeSegment: form.scopeSegment || undefined,
          tierOverride: form.tierOverride ? Number(form.tierOverride) : undefined,
          multiplierOverride: form.multiplierOverride ? Number(form.multiplierOverride) : undefined,
          minPriceUsd: form.minPriceUsd ? Number(form.minPriceUsd) : undefined,
          maxPriceUsd: form.maxPriceUsd ? Number(form.maxPriceUsd) : undefined,
          isExcluded: form.isExcluded,
          label: form.label || undefined,
          startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : undefined,
          endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || "Failed to create override");
        return;
      }

      toast.success("Override created");
      setForm(emptyForm);
      await refresh();
    } catch {
      toast.error("Failed to create override");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleToggleActive(row: OverrideRow) {
    const response = await fetch(`/api/admin/pricing/overrides/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !row.is_active }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      toast.error(data.error || "Failed to update override");
      return;
    }
    toast.success(row.is_active ? "Override deactivated" : "Override activated");
    await refresh();
  }

  async function handleDelete(row: OverrideRow) {
    if (!confirm(`Delete override "${row.label || scopeLabel(row)}"? This deactivates it — full history stays in the audit log.`)) return;
    const response = await fetch(`/api/admin/pricing/overrides/${row.id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      toast.error(data.error || "Failed to delete override");
      return;
    }
    toast.success("Override deleted");
    await refresh();
  }

  async function handleRollback(row: OverrideRow) {
    if (!confirm("Roll back this override to its previous state?")) return;
    const response = await fetch(`/api/admin/pricing/overrides/${row.id}/rollback`, { method: "POST" });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      toast.error(data.error || "Failed to roll back");
      return;
    }
    toast.success("Rolled back to previous state");
    await refresh();
  }

  async function handleImportFile(file: File) {
    setIsImporting(true);
    try {
      const text = await file.text();
      const response = await fetch("/api/admin/pricing/overrides/import", {
        method: "POST",
        headers: { "Content-Type": "text/csv" },
        body: text,
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || "Import failed");
        return;
      }
      if (data.failed > 0) {
        toast.warning(`Imported ${data.created}, ${data.failed} row(s) failed — see console for details`);
        console.warn("Pricing override import errors:", data.results.filter((r: { status: string }) => r.status === "error"));
      } else {
        toast.success(`Imported ${data.created} override(s)`);
      }
      await refresh();
    } catch {
      toast.error("Import failed");
    } finally {
      setIsImporting(false);
    }
  }

  async function toggleAudit(row: OverrideRow) {
    if (expandedAuditFor === row.id) {
      setExpandedAuditFor(null);
      return;
    }
    setExpandedAuditFor(row.id);
    setLoadingAudit(true);
    try {
      const response = await fetch(`/api/admin/pricing/audit-log?overrideId=${row.id}`);
      if (response.ok) {
        const data = await response.json();
        setAuditEntries(data.entries);
      }
    } finally {
      setLoadingAudit(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button size="sm" variant="outline" asChild>
          <a href="/api/admin/pricing/overrides/export" download>
            Export CSV
          </a>
        </Button>
        <Button size="sm" variant="outline" disabled={isImporting} asChild>
          <label className="cursor-pointer">
            {isImporting ? "Importing…" : "Import CSV"}
            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              disabled={isImporting}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImportFile(file);
                e.target.value = "";
              }}
            />
          </label>
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-lg font-bold">New Override</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Leave a field blank to apply it globally (every country / every city / every segment). More specific
          scopes always win over broader ones.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label htmlFor="ov-country">Country (ISO code, e.g. IN)</Label>
            <Input id="ov-country" value={form.scopeCountry} maxLength={2} onChange={(e) => setForm((f) => ({ ...f, scopeCountry: e.target.value.toUpperCase() }))} />
          </div>
          <div>
            <Label htmlFor="ov-city">City / region</Label>
            <Input id="ov-city" value={form.scopeCity} onChange={(e) => setForm((f) => ({ ...f, scopeCity: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="ov-segment">Customer segment</Label>
            <select
              id="ov-segment"
              value={form.scopeSegment}
              onChange={(e) => setForm((f) => ({ ...f, scopeSegment: e.target.value }))}
              className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Every segment</option>
              {CUSTOMER_SEGMENTS.map((s) => (
                <option key={s} value={s}>
                  {SEGMENT_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="ov-tier">Tier override (1-5)</Label>
            <Input id="ov-tier" type="number" min={1} max={5} value={form.tierOverride} onChange={(e) => setForm((f) => ({ ...f, tierOverride: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="ov-multiplier">Multiplier override (takes precedence over tier)</Label>
            <Input id="ov-multiplier" type="number" step="0.01" value={form.multiplierOverride} onChange={(e) => setForm((f) => ({ ...f, multiplierOverride: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="ov-label">Label (e.g. "Diwali 2026 promo")</Label>
            <Input id="ov-label" value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="ov-min">Min price (USD)</Label>
            <Input id="ov-min" type="number" min={0} step="0.01" value={form.minPriceUsd} onChange={(e) => setForm((f) => ({ ...f, minPriceUsd: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="ov-max">Max price (USD)</Label>
            <Input id="ov-max" type="number" min={0} step="0.01" value={form.maxPriceUsd} onChange={(e) => setForm((f) => ({ ...f, maxPriceUsd: e.target.value }))} />
          </div>
          <div className="flex items-end gap-2">
            <input
              id="ov-excluded"
              type="checkbox"
              checked={form.isExcluded}
              onChange={(e) => setForm((f) => ({ ...f, isExcluded: e.target.checked }))}
              className="h-4 w-4"
            />
            <Label htmlFor="ov-excluded" className="mb-0">Exclude — block checkout entirely for this scope</Label>
          </div>
          <div>
            <Label htmlFor="ov-starts">Starts at (optional)</Label>
            <Input id="ov-starts" type="datetime-local" value={form.startsAt} onChange={(e) => setForm((f) => ({ ...f, startsAt: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="ov-ends">Ends at (optional)</Label>
            <Input id="ov-ends" type="datetime-local" value={form.endsAt} onChange={(e) => setForm((f) => ({ ...f, endsAt: e.target.value }))} />
          </div>
        </div>
        <Button onClick={handleCreate} disabled={isSubmitting} className="mt-4">
          {isSubmitting ? "Creating…" : "Create Override"}
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-semibold">Scope</th>
              <th className="px-4 py-3 font-semibold">Effect</th>
              <th className="px-4 py-3 font-semibold">Window</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {overrides.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                  No overrides yet — every price is coming from the static tier table.
                </td>
              </tr>
            )}
            {overrides.map((row) => (
              <Fragment key={row.id}>
                <tr className="border-t border-border align-top">
                  <td className="px-4 py-3">
                    <div className="font-medium">{row.label || "—"}</div>
                    <div className="text-muted-foreground">{scopeLabel(row)}</div>
                  </td>
                  <td className="px-4 py-3">
                    {row.is_excluded ? (
                      <span className="rounded-full bg-destructive/10 px-2 py-1 text-xs font-semibold text-destructive">Excluded from checkout</span>
                    ) : (
                      <div className="space-y-0.5 text-muted-foreground">
                        {row.multiplier_override && <div>Multiplier: {Number(row.multiplier_override).toFixed(2)}x</div>}
                        {!row.multiplier_override && row.tier_override && <div>Tier: {TIER_LABELS[row.tier_override as 1 | 2 | 3 | 4 | 5]}</div>}
                        {row.min_price_usd && <div>Min: ${Number(row.min_price_usd).toLocaleString()}</div>}
                        {row.max_price_usd && <div>Max: ${Number(row.max_price_usd).toLocaleString()}</div>}
                        {!row.multiplier_override && !row.tier_override && !row.min_price_usd && !row.max_price_usd && "—"}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {row.starts_at ? new Date(row.starts_at).toLocaleDateString() : "Always"}
                    {row.ends_at ? ` – ${new Date(row.ends_at).toLocaleDateString()}` : ""}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${row.is_active ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"}`}>
                        {row.is_active ? "Active" : "Inactive"}
                      </span>
                      {isScheduled(row) && (
                        <span
                          className="rounded-full bg-amber-500/10 px-2 py-1 text-xs font-semibold text-amber-600"
                          title={`Starts ${new Date(row.starts_at as string).toLocaleString()}`}
                        >
                          Scheduled
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleToggleActive(row)}>
                        {row.is_active ? "Deactivate" : "Activate"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleRollback(row)}>
                        Rollback
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => toggleAudit(row)}>
                        History
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(row)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
                {expandedAuditFor === row.id && (
                  <tr className="border-t border-border bg-muted/30">
                    <td colSpan={5} className="px-4 py-3">
                      {loadingAudit ? (
                        <p className="text-sm text-muted-foreground">Loading history…</p>
                      ) : auditEntries.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No history yet.</p>
                      ) : (
                        <ul className="space-y-1 text-xs text-muted-foreground">
                          {auditEntries.map((entry) => (
                            <li key={entry.id}>
                              <span className="font-semibold text-foreground">{entry.action}</span>
                              {" — "}
                              {new Date(entry.changed_at).toLocaleString()}
                              {entry.notes ? ` — ${entry.notes}` : ""}
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
