"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface CorporateGroupRow {
  id: string
  companyName: string
  contactPerson: string
  contactEmail: string
  planType: string | null
  memberLimit: number | null
  status: string
}

export function CorporateGroupsManager({ initialGroups }: { initialGroups: CorporateGroupRow[] }) {
  const [groups, setGroups] = useState(initialGroups)
  const [companyName, setCompanyName] = useState("")
  const [contactPerson, setContactPerson] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [planType, setPlanType] = useState("")
  const [memberLimit, setMemberLimit] = useState("")
  const [isSaving, setIsSaving] = useState(false)

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
        { id: data.id, companyName, contactPerson, contactEmail, planType: planType || null, memberLimit: memberLimit ? Number(memberLimit) : null, status: "active" },
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
            <div key={g.id} className="border rounded-lg p-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-foreground">{g.companyName}</p>
                <p className="text-sm text-muted-foreground">{g.contactPerson} • {g.contactEmail}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {g.planType || "—"} {g.memberLimit ? `• up to ${g.memberLimit} members` : ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
