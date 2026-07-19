import { Calendar, Activity, BarChart3 } from "lucide-react"

interface StatsCardsProps {
  programLength: number
  workoutsPerWeek: number
  completionRate: number
}

export default function StatsCards({ programLength, workoutsPerWeek, completionRate }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
      <div className="bg-[#C9A96A]/10 rounded-lg p-6 flex items-center">
        <div className="bg-white p-3 rounded-lg mr-4">
          <Calendar className="h-6 w-6 text-[#C9A96A]" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-[#C9A96A] mb-1">Program Length</h3>
          <p className="text-2xl font-bold text-[#0A0A0A]">{programLength} Weeks</p>
        </div>
      </div>

      <div className="bg-[#C9C0B4]/15 rounded-lg p-6 flex items-center">
        <div className="bg-white p-3 rounded-lg mr-4">
          <Activity className="h-6 w-6 text-[#8a8072]" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-[#8a8072] mb-1">Workouts/Week</h3>
          <p className="text-2xl font-bold text-[#0A0A0A]">{workoutsPerWeek} days</p>
        </div>
      </div>

      <div className="bg-[#B8935A]/10 rounded-lg p-6 flex items-center">
        <div className="bg-white p-3 rounded-lg mr-4">
          <BarChart3 className="h-6 w-6 text-[#B8935A]" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-[#B8935A] mb-1">Completion Rate</h3>
          <p className="text-2xl font-bold text-[#0A0A0A]">{completionRate}%</p>
        </div>
      </div>
    </div>
  )
}

