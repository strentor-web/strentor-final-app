import { Badge } from "@/components/ui/badge"
import { PATHWAY_LABELS, type PathwayResult } from "@/utils/assessment/scoring"

export interface AssessmentRow {
  id: string
  userName: string
  userEmail: string
  totalScore: number
  pathway: PathwayResult
  redFlagExists: boolean
  humanReviewRequired: boolean
  submittedAt: string
}

export function AssessmentsQueue({ assessments }: { assessments: AssessmentRow[] }) {
  if (assessments.length === 0) {
    return <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">No assessments submitted yet.</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="py-3 px-4 text-left font-semibold text-muted-foreground">User</th>
            <th className="py-3 px-4 text-center font-semibold text-muted-foreground">Score</th>
            <th className="py-3 px-4 text-left font-semibold text-muted-foreground">Pathway</th>
            <th className="py-3 px-4 text-center font-semibold text-muted-foreground">Flags</th>
            <th className="py-3 px-4 text-right font-semibold text-muted-foreground">Submitted</th>
          </tr>
        </thead>
        <tbody>
          {assessments.map((a, index) => (
            <tr key={a.id} className={`border-b border-border ${index % 2 === 0 ? "bg-muted/30" : ""}`}>
              <td className="py-3 px-4">
                <p className="font-medium text-foreground">{a.userName}</p>
                <p className="text-xs text-muted-foreground">{a.userEmail}</p>
              </td>
              <td className="py-3 px-4 text-center">{a.totalScore}/60</td>
              <td className="py-3 px-4">{PATHWAY_LABELS[a.pathway]}</td>
              <td className="py-3 px-4 text-center">
                {a.redFlagExists && <Badge variant="destructive">Red Flag</Badge>}
                {a.humanReviewRequired && !a.redFlagExists && <Badge variant="outline">Review</Badge>}
              </td>
              <td className="py-3 px-4 text-right text-muted-foreground">{new Date(a.submittedAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
