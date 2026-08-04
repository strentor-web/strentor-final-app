import { ReactNode } from "react"
import { ScrollReveal } from "@/components/motion/ScrollReveal"

interface DashboardPageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
}

/** Consistent title/description/action header for dashboard pages, with a
 * subtle reveal on mount so pages don't feel like a static admin panel. */
export function DashboardPageHeader({ title, description, action }: DashboardPageHeaderProps) {
  return (
    <ScrollReveal duration={0.4} distance={12} className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 className="text-3xl font-bold font-display">{title}</h2>
        {description && <p className="mt-1 text-muted-foreground">{description}</p>}
      </div>
      {action}
    </ScrollReveal>
  )
}
