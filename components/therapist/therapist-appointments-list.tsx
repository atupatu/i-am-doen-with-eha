"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Clock, MapPin, FileUp, MapPinned } from "lucide-react"
import { formatDate, formatTime } from "@/lib/utils"
import UploadReportForm from "@/components/therapist/upload-report-form"
import RescheduleAppointmentForm from "@/components/therapist/reschedule-appointment-form"

interface AppointmentProps {
  id: number
  clientName: string
  clientImage?: string
  date: string
  time: string
  type: string
  location: string
  address?: string
  status: "confirmed" | "pending" | "cancelled" | "completed"
  mode: "online" | "in-person"
}

interface TherapistAppointmentsListProps {
  appointments: AppointmentProps[]
}

export default function TherapistAppointmentsList({ appointments }: TherapistAppointmentsListProps) {
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentProps | null>(null)
  const [uploadReportOpen, setUploadReportOpen] = useState(false)
  const [rescheduleOpen, setRescheduleOpen] = useState(false)
  const [addressDialogOpen, setAddressDialogOpen] = useState(false)

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
          <div key={appointment.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
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
                <h4 className="font-medium truncate">{appointment.clientName}</h4>
                <Badge
                  variant={appointment.status === "confirmed" ? "default" : "outline"}
                  className={
                    appointment.status === "confirmed"
                      ? "bg-[#a98cc8]"
                      : appointment.status === "completed"
                        ? "border-blue-500 text-blue-500"
                        : appointment.status === "cancelled"
                          ? "border-red-500 text-red-500"
                          : "border-yellow-500 text-yellow-500"
                  }
                >
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
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(appointment.date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(appointment.time)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{appointment.location}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {appointment.status === "confirmed" && (
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
                </>
              )}
              {appointment.mode === "in-person" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600 border-green-200 hover:bg-green-50"
                  onClick={() => {
                    setSelectedAppointment(appointment)
                    setAddressDialogOpen(true)
                  }}
                >
                  <MapPinned className="h-4 w-4 mr-1" />
                  Address
                </Button>
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
              <DialogTitle>Upload Report for {selectedAppointment.clientName}</DialogTitle>
              <DialogDescription>
                Create and upload a session report for the appointment on {formatDate(selectedAppointment.date)}
              </DialogDescription>
            </DialogHeader>
            <UploadReportForm
              appointmentId={selectedAppointment.id}
              clientName={selectedAppointment.clientName}
              onSuccess={() => setUploadReportOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Reschedule Dialog */}
      {selectedAppointment && (
        <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Reschedule Appointment with {selectedAppointment.clientName}</DialogTitle>
              <DialogDescription>Select a new date and time for this appointment</DialogDescription>
            </DialogHeader>
            <RescheduleAppointmentForm
              appointmentId={selectedAppointment.id}
              currentDate={selectedAppointment.date}
              currentTime={selectedAppointment.time}
              onSuccess={() => setRescheduleOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Address Dialog */}
      {selectedAppointment && (
        <Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Client Address</DialogTitle>
              <DialogDescription>Address for in-person session with {selectedAppointment.clientName}</DialogDescription>
            </DialogHeader>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-2">
                <MapPinned className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">{selectedAppointment.clientName}</h4>
                  <p className="text-gray-700 mt-1">
                    {selectedAppointment.address || "123 Serenity Lane, Peaceful City, CA 90210"}
                  </p>
                </div>
              </div>
              <div className="mt-4 h-40 bg-gray-200 rounded-md flex items-center justify-center">
                <p className="text-gray-500 text-sm">Map view would appear here</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
