import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldCheck, HeartPulse, ClipboardCheck, Compass } from "lucide-react"
import { PATHWAY_LABELS, PATHWAY_DESTINATION, type PathwayResult } from "@/utils/assessment/scoring"

interface CommandCenterProps {
  pathway: PathwayResult | null
  pathwayReason: string | null
  weeklyReflectionCompleted: boolean
}

export function CommandCenter({ pathway, pathwayReason, weeklyReflectionCompleted }: CommandCenterProps) {
  const destination = pathway ? PATHWAY_DESTINATION[pathway] : null

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-lg border border-strentor-red/30 bg-strentor-red/5 p-4 text-sm">
        <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-strentor-red" />
        <p>
          Never push through pain. Pause and seek professional guidance for chest pain, severe
          breathlessness, fainting, new weakness/numbness, fever, or an open wound.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="border rounded-lg p-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Compass className="h-4 w-4" />
            <span className="text-sm font-semibold uppercase tracking-wide">Your Pathway</span>
          </div>
          {pathway ? (
            <>
              <p className="mt-2 text-xl font-bold text-foreground">{PATHWAY_LABELS[pathway]}</p>
              {pathwayReason && <p className="mt-1 text-sm text-muted-foreground">{pathwayReason}</p>}
              {destination && (
                <Button asChild size="sm" variant="outline" className="mt-4">
                  <Link href={destination.href}>{destination.label}</Link>
                </Button>
              )}
            </>
          ) : (
            <>
              <p className="mt-2 text-sm text-muted-foreground">
                Take the Readiness Assessment to get a recommended pathway.
              </p>
              <Button asChild size="sm" className="mt-4 bg-strentor-red hover:bg-strentor-red/80">
                <Link href="/safety-disclaimer?next=/assessment">Take Assessment</Link>
              </Button>
            </>
          )}
        </div>

        <div className="border rounded-lg p-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <HeartPulse className="h-4 w-4" />
            <span className="text-sm font-semibold uppercase tracking-wide">Body Check</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Log pain, fatigue, energy, and mood before or after training.
          </p>
          <Button asChild size="sm" className="mt-4 bg-strentor-red hover:bg-strentor-red/80">
            <Link href="/tracker">Log Body Check</Link>
          </Button>
        </div>

        <div className="border rounded-lg p-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ClipboardCheck className="h-4 w-4" />
            <span className="text-sm font-semibold uppercase tracking-wide">Weekly Reflection</span>
          </div>
          <p className="mt-2 text-sm">
            {weeklyReflectionCompleted ? (
              <span className="text-foreground font-medium">Completed for this week</span>
            ) : (
              <span className="text-muted-foreground">Due this week</span>
            )}
          </p>
          <Button asChild size="sm" variant={weeklyReflectionCompleted ? "outline" : "default"} className={weeklyReflectionCompleted ? "mt-4" : "mt-4 bg-strentor-red hover:bg-strentor-red/80"}>
            <Link href="/check-in">{weeklyReflectionCompleted ? "View Reflection" : "Complete Reflection"}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
