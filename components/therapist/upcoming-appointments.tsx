import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin } from "lucide-react"
import { formatDate, formatTime } from "@/lib/utils"

interface AppointmentProps {
  id: number
  clientName: string
  clientImage?: string
  date: string
  time: string
  type: string
  location: string
  status: "confirmed" | "pending" | "cancelled" | "completed"
  mode: "online" | "in-person"
}

interface UpcomingAppointmentsProps {
  appointments: AppointmentProps[]
}

export default function UpcomingAppointments({ appointments }: UpcomingAppointmentsProps) {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No upcoming appointments</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {appointments.slice(0, 3).map((appointment) => (
        <div key={appointment.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={appointment.clientImage || "/placeholder.svg?height=40&width=40"}
              alt={appointment.clientName}
            />
            <AvatarFallback>
              {appointment.clientName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-sm truncate">{appointment.clientName}</h4>
              <Badge variant={appointment.status === "confirmed" ? "default" : "outline"} className="bg-[#a98cc8]">
                {appointment.status}
              </Badge>
              <Badge
                variant="outline"
                className={
                  appointment.mode === "online" ? "border-blue-500 text-blue-500" : "border-green-500 text-green-500"
                }
              >
                {appointment.mode}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(appointment.date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatTime(appointment.time)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{appointment.location}</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <a href={`/therapist/appointments/${appointment.id}`}>View</a>
          </Button>
        </div>
      ))}
    </div>
  )
}
