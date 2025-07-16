import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Check, X } from "lucide-react"
import { formatDate, formatTime } from "@/lib/utils"
import { confirmAppointment, rejectAppointment } from "@/lib/therapist-actions"

interface RequestProps {
  id: number
  clientName: string
  clientImage?: string
  date: string
  time: string
  type: string
  location: string
  mode: "online" | "in-person"
}

interface PendingRequestsProps {
  requests: RequestProps[]
}

export default function PendingRequests({ requests }: PendingRequestsProps) {
  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No pending requests</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {requests.slice(0, 3).map((request) => (
        <div key={request.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50">
          <Avatar className="h-10 w-10">
            <AvatarImage src={request.clientImage || "/placeholder.svg?height=40&width=40"} alt={request.clientName} />
            <AvatarFallback>
              {request.clientName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-sm truncate">{request.clientName}</h4>
              <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                pending
              </Badge>
              <Badge
                variant="outline"
                className={
                  request.mode === "online" ? "border-blue-500 text-blue-500" : "border-green-500 text-green-500"
                }
              >
                {request.mode}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(request.date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatTime(request.time)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{request.location}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <form action={confirmAppointment}>
              <input type="hidden" name="requestId" value={request.id} />
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-green-600 border-green-200 hover:bg-green-50"
              >
                <Check className="h-4 w-4" />
              </Button>
            </form>
            <form action={rejectAppointment}>
              <input type="hidden" name="requestId" value={request.id} />
              <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50">
                <X className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      ))}
    </div>
  )
}
