"use client"

interface LogRow {
  id: string
  date: string
  pain_level: number
  fatigue_level: number
  energy_level: number
  mood_level: number
  red_flag_detected: boolean
}

export function TrackerHistory({ logs }: { logs: LogRow[] }) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">
        <p>No body checks logged yet.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="py-3 px-4 text-left font-semibold text-muted-foreground">Date</th>
            <th className="py-3 px-4 text-center font-semibold text-muted-foreground">Pain</th>
            <th className="py-3 px-4 text-center font-semibold text-muted-foreground">Fatigue</th>
            <th className="py-3 px-4 text-center font-semibold text-muted-foreground">Energy</th>
            <th className="py-3 px-4 text-center font-semibold text-muted-foreground">Mood</th>
            <th className="py-3 px-4 text-right font-semibold text-muted-foreground">Flag</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={log.id} className={`border-b border-border ${index % 2 === 0 ? "bg-muted/30" : ""}`}>
              <td className="py-3 px-4">{new Date(log.date).toLocaleDateString()}</td>
              <td className="py-3 px-4 text-center">{log.pain_level}/10</td>
              <td className="py-3 px-4 text-center">{log.fatigue_level}/10</td>
              <td className="py-3 px-4 text-center">{log.energy_level}/10</td>
              <td className="py-3 px-4 text-center">{log.mood_level}/10</td>
              <td className="py-3 px-4 text-right">
                {log.red_flag_detected ? (
                  <span className="text-destructive font-semibold">Flagged</span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
