import { Metadata } from "next"
import { validateServerRole } from "@/lib/server-role-validation"
import prisma from "@/utils/prisma/prismaClient"
import { TestimonialsApprovalList, type TestimonialRow } from "@/components/admin/testimonials/TestimonialsApprovalList"

export const metadata: Metadata = {
  title: "Testimonials - Admin - Strentor",
  description: "Approve, reject, and publish client testimonials.",
  robots: { index: false, follow: false },
}

export default async function AdminTestimonialsPage() {
  await validateServerRole(["ADMIN", "FITNESS_TRAINER_ADMIN"])

  const testimonials = await prisma.testimonials.findMany({
    orderBy: [{ approval_status: "asc" }, { created_at: "desc" }],
    take: 100,
  })

  const rows: TestimonialRow[] = testimonials.map((t) => ({
    id: t.id,
    nameDisplay: t.name_display,
    programType: t.program_type,
    testimonialText: t.testimonial_text,
    approvalStatus: t.approval_status,
    createdAt: t.created_at.toISOString(),
  }))

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Testimonials</h1>
        <p className="text-xl text-muted-foreground mt-1">Approve stories to feature on the public site.</p>
      </div>
      <TestimonialsApprovalList testimonials={rows} />
    </div>
  )
}
