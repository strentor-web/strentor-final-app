"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface CorporateInquiryRow {
  id: string
  companyName: string
  contactName: string
  email: string
  phone: string | null
  employeeCount: string | null
  message: string | null
  status: string
  createdAt: string
}

function Row({ inquiry }: { inquiry: CorporateInquiryRow }) {
  const [status, setStatus] = useState(inquiry.status)

  async function handleChange(next: string) {
    setStatus(next)
    try {
      const response = await fetch(`/api/admin/corporate-inquiries/${inquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      })
      if (!response.ok) toast.error("Failed to update.")
    } catch {
      toast.error("Network error.")
    }
  }

  return (
    <div className="border rounded-lg p-4 flex flex-wrap items-start justify-between gap-3">
      <div className="max-w-xl">
        <p className="font-semibold text-foreground">{inquiry.companyName}</p>
        <p className="text-sm text-muted-foreground">{inquiry.contactName} • {inquiry.email}{inquiry.phone ? ` • ${inquiry.phone}` : ""}</p>
        {inquiry.employeeCount && <p className="mt-1 text-sm">Employees: {inquiry.employeeCount}</p>}
        {inquiry.message && <p className="mt-1 text-sm text-muted-foreground">{inquiry.message}</p>}
        <p className="mt-1 text-xs text-muted-foreground">{new Date(inquiry.createdAt).toLocaleDateString()}</p>
      </div>
      <Select value={status} onValueChange={handleChange}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="contacted">Contacted</SelectItem>
          <SelectItem value="converted">Converted</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export function CorporateInquiriesList({ inquiries }: { inquiries: CorporateInquiryRow[] }) {
  if (inquiries.length === 0) {
    return <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">No corporate inquiries yet.</div>
  }
  return (
    <div className="space-y-3">
      {inquiries.map((i) => (
        <Row key={i.id} inquiry={i} />
      ))}
    </div>
  )
}
