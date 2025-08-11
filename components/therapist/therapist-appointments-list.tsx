"use client"

import { useState } from "react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Clock, FileUp, CheckCircle, XCircle } from "lucide-react"
import { formatDate, formatTime } from "@/lib/utils"
import UploadReportForm from "@/components/therapist/upload-report-form"
import RescheduleAppointmentForm from "@/components/therapist/reschedule-appointment-form"

interface AppointmentProps {
  sid: number
  uid: string
  userName: string
  // userImage?: string
  scheduled_date: string
  start_time: string
  end_time: string
  status: "pending" | "approved" | "declined" | "completed"
  report_content?: string
  report_submitted_at?: string
}

interface TherapistAppointmentsListProps {
  appointments: AppointmentProps[]
}

export default function TherapistAppointmentsList({ appointments }: TherapistAppointmentsListProps) {
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentProps | null>(null)
  const [uploadReportOpen, setUploadReportOpen] = useState(false)
  const [rescheduleOpen, setRescheduleOpen] = useState(false)
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({})
  
  const supabase = createClientComponentClient()

  // Function to update appointment status using existing Supabase session
  const updateAppointmentStatus = async (sid: number, status: string) => {
    try {
      setLoading(prev => ({ ...prev, [sid]: true }))
      
      // Get the current Supabase session (token is automatically managed)
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token || !session?.user?.id) {
        alert('Please log in to perform this action')
        return
      }
      
      const response = await fetch(`/api/sessions/therapist/${session.user.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sid,
          status
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.status}`)
      }

      const result = await response.json()
      
      // Refresh the page or update local state
      window.location.reload() // Simple approach - you might want to use a more sophisticated state management
      
    } catch (error) {
      console.error('Error updating appointment status:', error)
      alert('Failed to update appointment status. Please try again.')
    } finally {
      setLoading(prev => ({ ...prev, [sid]: false }))
    }
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No appointments found</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div key={appointment.sid} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
            {/* <Avatar className="h-10 w-10">
              <AvatarImage
                src={appointment.userImage || "/placeholder.svg?height=40&width=40"}
                alt={appointment.userName}
              />
              <AvatarFallback>
                {appointment.userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar> */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-medium truncate">{appointment.userName}</h4>
                <Badge
                  variant={
                    appointment.status === "approved"
                      ? "default"
                      : appointment.status === "completed"
                        ? "secondary"
                        : "outline"
                  }
                  className={
                    appointment.status === "approved"
                      ? "bg-[#a98cc8]"
                      : appointment.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : appointment.status === "declined"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {appointment.status}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(appointment.scheduled_date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {/* Pending appointments - show approve/decline buttons */}
              {appointment.status === "pending" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-green-600 border-green-200 hover:bg-green-50"
                    onClick={() => updateAppointmentStatus(appointment.sid, "approved")}
                    disabled={loading[appointment.sid]}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {loading[appointment.sid] ? 'Approving...' : 'Approve'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => updateAppointmentStatus(appointment.sid, "declined")}
                    disabled={loading[appointment.sid]}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    {loading[appointment.sid] ? 'Declining...' : 'Decline'}
                  </Button>
                </>
              )}

              {/* Approved appointments - show reschedule and report buttons */}
              {appointment.status === "approved" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[#a98cc8] border-[#a98cc8] hover:bg-[#a98cc8]/10"
                    onClick={() => {
                      setSelectedAppointment(appointment)
                      setRescheduleOpen(true)
                    }}
                  >
                    Reschedule
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={() => {
                      setSelectedAppointment(appointment)
                      setUploadReportOpen(true)
                    }}
                  >
                    <FileUp className="h-4 w-4 mr-1" />
                    Report
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-green-600 border-green-200 hover:bg-green-50"
                    onClick={() => updateAppointmentStatus(appointment.sid, "completed")}
                    disabled={loading[appointment.sid]}
                  >
                    {loading[appointment.sid] ? 'Completing...' : 'Mark Complete'}
                  </Button>
                </>
              )}

              {/* Show report status if exists */}
              {appointment.report_content && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Report Submitted
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Upload Report Dialog */}
      {selectedAppointment && (
        <Dialog open={uploadReportOpen} onOpenChange={setUploadReportOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Upload Report for {selectedAppointment.userName}</DialogTitle>
              <DialogDescription>
                Create and upload a session report for the appointment on {formatDate(selectedAppointment.scheduled_date)}
              </DialogDescription>
            </DialogHeader>
            <UploadReportForm
              appointmentId={selectedAppointment.sid}
              clientName={selectedAppointment.userName}
              onSuccess={() => {
                setUploadReportOpen(false)
                // Refresh the appointments list
                window.location.reload()
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Reschedule Dialog */}
      {selectedAppointment && (
        <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Reschedule Appointment with {selectedAppointment.userName}</DialogTitle>
              <DialogDescription>Select a new date and time for this appointment</DialogDescription>
            </DialogHeader>
            <RescheduleAppointmentForm
              appointmentId={selectedAppointment.sid}
              currentDate={selectedAppointment.scheduled_date}
              currentTime={selectedAppointment.start_time}
              onSuccess={() => {
                setRescheduleOpen(false)
                // Refresh the appointments list
                window.location.reload()
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}