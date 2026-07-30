"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { inviteCorporateAdmin } from "@/actions/admin/invite-corporate-admin.action"

export interface CorporateGroupRow {
  id: string
  companyName: string
  contactPerson: string
  contactEmail: string
  planType: string | null
  memberLimit: number | null
  status: string
  seatPriceAmount: string | null
  seatPriceCurrency: string | null
  contractStartsAt: string | null
  contractEndsAt: string | null
}

interface InvoiceRow {
  id: string
  description: string
  amount: string
  currency: string
  status: string
  issuedAt: string
  dueAt: string | null
}

function toDateInputValue(iso: string | null): string {
  return iso ? iso.slice(0, 10) : ""
}

function CorporateBillingPanel({ group, onUpdate }: { group: CorporateGroupRow; onUpdate: (patch: Partial<CorporateGroupRow>) => void }) {
  const [seatPriceAmount, setSeatPriceAmount] = useState(group.seatPriceAmount ?? "")
  const [seatPriceCurrency, setSeatPriceCurrency] = useState(group.seatPriceCurrency ?? "INR")
  const [contractStartsAt, setContractStartsAt] = useState(toDateInputValue(group.contractStartsAt))
  const [contractEndsAt, setContractEndsAt] = useState(toDateInputValue(group.contractEndsAt))
  const [isSavingContract, setIsSavingContract] = useState(false)

  const [invoices, setInvoices] = useState<InvoiceRow[] | null>(null)
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false)
  const [invoiceDescription, setInvoiceDescription] = useState("")
  const [invoiceAmount, setInvoiceAmount] = useState("")
  const [invoiceCurrency, setInvoiceCurrency] = useState("INR")
  const [invoiceDueAt, setInvoiceDueAt] = useState("")
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false)

  async function loadInvoices() {
    setIsLoadingInvoices(true)
    try {
      const response = await fetch(`/api/admin/corporate-groups/${group.id}/invoices`)
      const body = await response.json().catch(() => ({}))
      if (response.ok) setInvoices(body.invoices)
    } finally {
      setIsLoadingInvoices(false)
    }
  }

  async function saveContract() {
    setIsSavingContract(true)
    try {
      const response = await fetch(`/api/admin/corporate-groups/${group.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seatPriceAmount: seatPriceAmount ? Number(seatPriceAmount) : null,
          seatPriceCurrency: seatPriceCurrency || null,
          contractStartsAt: contractStartsAt ? new Date(contractStartsAt).toISOString() : null,
          contractEndsAt: contractEndsAt ? new Date(contractEndsAt).toISOString() : null,
        }),
      })
      if (!response.ok) {
        toast.error("Failed to save contract details.")
        return
      }
      onUpdate({ seatPriceAmount: seatPriceAmount || null, seatPriceCurrency: seatPriceCurrency || null, contractStartsAt, contractEndsAt })
      toast.success("Contract details saved.")
    } catch {
      toast.error("Network error.")
    } finally {
      setIsSavingContract(false)
    }
  }

  async function createInvoice() {
    if (!invoiceDescription.trim() || !invoiceAmount || isCreatingInvoice) return
    setIsCreatingInvoice(true)
    try {
      const response = await fetch(`/api/admin/corporate-groups/${group.id}/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: invoiceDescription,
          amount: Number(invoiceAmount),
          currency: invoiceCurrency,
          dueAt: invoiceDueAt ? new Date(invoiceDueAt).toISOString() : undefined,
        }),
      })
      if (!response.ok) {
        toast.error("Failed to create invoice.")
        return
      }
      toast.success("Invoice created.")
      setInvoiceDescription("")
      setInvoiceAmount("")
      setInvoiceDueAt("")
      loadInvoices()
    } catch {
      toast.error("Network error.")
    } finally {
      setIsCreatingInvoice(false)
    }
  }

  return (
    <div className="border-t pt-3 space-y-4">
      <div>
        <p className="text-sm font-medium mb-2">Contract &amp; seat pricing</p>
        <div className="grid gap-3 sm:grid-cols-4">
          <div>
            <Label htmlFor={`seat-price-${group.id}`}>Seat price</Label>
            <Input id={`seat-price-${group.id}`} type="number" min="0" step="0.01" value={seatPriceAmount} onChange={(e) => setSeatPriceAmount(e.target.value)} />
          </div>
          <div>
            <Label htmlFor={`seat-currency-${group.id}`}>Currency</Label>
            <Input id={`seat-currency-${group.id}`} value={seatPriceCurrency} onChange={(e) => setSeatPriceCurrency(e.target.value.toUpperCase())} maxLength={3} />
          </div>
          <div>
            <Label htmlFor={`contract-start-${group.id}`}>Contract start</Label>
            <Input id={`contract-start-${group.id}`} type="date" value={contractStartsAt} onChange={(e) => setContractStartsAt(e.target.value)} />
          </div>
          <div>
            <Label htmlFor={`contract-end-${group.id}`}>Contract end</Label>
            <Input id={`contract-end-${group.id}`} type="date" value={contractEndsAt} onChange={(e) => setContractEndsAt(e.target.value)} />
          </div>
        </div>
        <Button size="sm" className="mt-2" onClick={saveContract} disabled={isSavingContract}>
          {isSavingContract ? "Saving..." : "Save contract details"}
        </Button>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium mb-2">Invoices</p>
          <Button size="sm" variant="outline" onClick={loadInvoices} disabled={isLoadingInvoices}>
            {isLoadingInvoices ? "Loading..." : invoices ? "Refresh" : "Show invoices"}
          </Button>
        </div>
        {invoices && (
          <div className="space-y-1 mb-3">
            {invoices.length === 0 ? (
              <p className="text-sm text-muted-foreground">No invoices yet.</p>
            ) : (
              invoices.map((inv) => (
                <div key={inv.id} className="text-sm flex justify-between border-b py-1">
                  <span>{inv.description}</span>
                  <span className="text-muted-foreground">
                    {inv.currency} {inv.amount} — {inv.status}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <Label htmlFor={`inv-desc-${group.id}`}>Description</Label>
            <Input id={`inv-desc-${group.id}`} value={invoiceDescription} onChange={(e) => setInvoiceDescription(e.target.value)} />
          </div>
          <div>
            <Label htmlFor={`inv-amount-${group.id}`}>Amount</Label>
            <Input id={`inv-amount-${group.id}`} type="number" min="0" step="0.01" value={invoiceAmount} onChange={(e) => setInvoiceAmount(e.target.value)} />
          </div>
          <div>
            <Label htmlFor={`inv-currency-${group.id}`}>Currency</Label>
            <Input id={`inv-currency-${group.id}`} value={invoiceCurrency} onChange={(e) => setInvoiceCurrency(e.target.value.toUpperCase())} maxLength={3} />
          </div>
          <div>
            <Label htmlFor={`inv-due-${group.id}`}>Due date (optional)</Label>
            <Input id={`inv-due-${group.id}`} type="date" value={invoiceDueAt} onChange={(e) => setInvoiceDueAt(e.target.value)} />
          </div>
          <div className="flex items-end">
            <Button size="sm" onClick={createInvoice} disabled={isCreatingInvoice} className="w-full">
              {isCreatingInvoice ? "Creating..." : "Create invoice"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CorporateGroupsManager({ initialGroups }: { initialGroups: CorporateGroupRow[] }) {
  const [groups, setGroups] = useState(initialGroups)
  const [companyName, setCompanyName] = useState("")
  const [contactPerson, setContactPerson] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [planType, setPlanType] = useState("")
  const [memberLimit, setMemberLimit] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [openInviteFor, setOpenInviteFor] = useState<string | null>(null)
  const [inviteName, setInviteName] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [isInviting, setIsInviting] = useState(false)
  const [openBillingFor, setOpenBillingFor] = useState<string | null>(null)

  async function handleInviteAdmin(groupId: string) {
    if (!inviteName.trim() || !inviteEmail.trim() || isInviting) return
    setIsInviting(true)
    try {
      const result = await inviteCorporateAdmin({
        corporateGroupId: groupId,
        email: inviteEmail.trim(),
        name: inviteName.trim(),
      })
      if (result.data) {
        toast.success(`Invitation sent to ${inviteEmail}`)
        setOpenInviteFor(null)
        setInviteName("")
        setInviteEmail("")
      } else if (result.error) {
        toast.error(result.error)
      }
    } catch {
      toast.error("Network error.")
    } finally {
      setIsInviting(false)
    }
  }

  async function handleCreate() {
    if (!companyName.trim() || !contactPerson.trim() || !contactEmail.trim() || isSaving) return
    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/corporate-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          contactPerson,
          contactEmail,
          planType: planType || undefined,
          memberLimit: memberLimit ? Number(memberLimit) : undefined,
        }),
      })
      if (!response.ok) {
        toast.error("Failed to create group.")
        return
      }
      const data = await response.json()
      setGroups((prev) => [
        {
          id: data.id,
          companyName,
          contactPerson,
          contactEmail,
          planType: planType || null,
          memberLimit: memberLimit ? Number(memberLimit) : null,
          status: "active",
          seatPriceAmount: null,
          seatPriceCurrency: null,
          contractStartsAt: null,
          contractEndsAt: null,
        },
        ...prev,
      ])
      setCompanyName("")
      setContactPerson("")
      setContactEmail("")
      setPlanType("")
      setMemberLimit("")
      toast.success("Corporate group created.")
    } catch {
      toast.error("Network error.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4 grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="companyName">Company name</Label>
          <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="contactPerson">Contact person</Label>
          <Input id="contactPerson" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="contactEmail">Contact email</Label>
          <Input id="contactEmail" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="planType">Plan type</Label>
          <Input id="planType" value={planType} onChange={(e) => setPlanType(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="memberLimit">Member limit</Label>
          <Input id="memberLimit" type="number" value={memberLimit} onChange={(e) => setMemberLimit(e.target.value)} />
        </div>
        <div className="flex items-end">
          <Button onClick={handleCreate} disabled={isSaving} className="w-full">
            {isSaving ? "Creating..." : "Add Corporate Group"}
          </Button>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg">No corporate groups yet.</div>
      ) : (
        <div className="space-y-2">
          {groups.map((g) => (
            <div key={g.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-foreground">{g.companyName}</p>
                  <p className="text-sm text-muted-foreground">{g.contactPerson} • {g.contactEmail}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm text-muted-foreground">
                    {g.planType || "—"} {g.memberLimit ? `• up to ${g.memberLimit} members` : ""}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOpenBillingFor(openBillingFor === g.id ? null : g.id)}
                  >
                    {openBillingFor === g.id ? "Cancel" : "Billing"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOpenInviteFor(openInviteFor === g.id ? null : g.id)}
                  >
                    {openInviteFor === g.id ? "Cancel" : "Invite Corporate Admin"}
                  </Button>
                </div>
              </div>

              {openBillingFor === g.id && (
                <CorporateBillingPanel
                  group={g}
                  onUpdate={(patch) =>
                    setGroups((prev) => prev.map((row) => (row.id === g.id ? { ...row, ...patch } : row)))
                  }
                />
              )}

              {openInviteFor === g.id && (
                <div className="grid gap-3 sm:grid-cols-3 border-t pt-3">
                  <div>
                    <Label htmlFor={`invite-admin-name-${g.id}`}>Name</Label>
                    <Input
                      id={`invite-admin-name-${g.id}`}
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`invite-admin-email-${g.id}`}>Email</Label>
                    <Input
                      id={`invite-admin-email-${g.id}`}
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={() => handleInviteAdmin(g.id)} disabled={isInviting} className="w-full">
                      {isInviting ? "Sending..." : "Send Invitation"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
