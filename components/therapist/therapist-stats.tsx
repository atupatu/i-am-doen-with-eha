import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Users, FileText } from "lucide-react"

interface StatsProps {
  stats: {
    totalClients: number
    activeClients: number
    todaySessions: number
    weekSessions: number
    reportsDue: number
    newClients: number
  }
}

export default function TherapistStats({ stats }: StatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-[#fef6f9] p-3 rounded-full">
              <Users className="h-6 w-6 text-[#a98cc8]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Clients</p>
              <h3 className="text-2xl font-bold">{stats.totalClients}</h3>
              <p className="text-xs text-green-600">{stats.activeClients} active</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-[#fef6f9] p-3 rounded-full">
              <Calendar className="h-6 w-6 text-[#a98cc8]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Today's Sessions</p>
              <h3 className="text-2xl font-bold">{stats.todaySessions}</h3>
              <p className="text-xs text-gray-500">{stats.weekSessions} this week</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-[#fef6f9] p-3 rounded-full">
              <FileText className="h-6 w-6 text-[#a98cc8]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Reports Due</p>
              <h3 className="text-2xl font-bold">{stats.reportsDue}</h3>
              <p className="text-xs text-red-600">2 overdue</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-[#fef6f9] p-3 rounded-full">
              <Users className="h-6 w-6 text-[#a98cc8]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">New Clients</p>
              <h3 className="text-2xl font-bold">{stats.newClients}</h3>
              <p className="text-xs text-gray-500">This month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
