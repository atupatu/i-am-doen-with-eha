"use client"

import { useState } from "react"
import { format, parse } from "date-fns"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Clock, FileText, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface AppointmentProps {
  id: number
  date: string
  time: string
  therapist: string
  type: string
  notes: string
  report?: string
}

interface AppointmentCardProps {
  appointment: AppointmentProps
  type: "upcoming" | "past"
  onReschedule?: (id: number, newDate: string, newTime: string) => void
  onCancel?: (id: number) => void
}

const TIME_SLOTS = [
  "9:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM",
  "1:00 PM - 2:00 PM", "2:00 PM - 3:00 PM", "3:00 PM - 4:00 PM",
  "3:30 PM - 4:30 PM", "4:00 PM - 5:00 PM"
]

export default function AppointmentCard({ appointment, type, onReschedule, onCancel }: AppointmentCardProps) {
  const [isRescheduling, setIsRescheduling] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>(appointment.time)

  const parseAppointmentDate = (dateString: string): Date => {
    try {
      return dateString.includes(",")
        ? parse(dateString, "EEEE, MMMM d, yyyy", new Date())
        : new Date(dateString)
    } catch {
      return new Date()
    }
  }

  const [currentMonth, setCurrentMonth] = useState(() => {
    const parsed = parseAppointmentDate(appointment.date)
    return new Date(parsed.getFullYear(), parsed.getMonth(), 1)
  })

  const handleRescheduleClick = () => {
    setSelectedDate(parseAppointmentDate(appointment.date))
    setSelectedTime(appointment.time)
    setIsRescheduling(true)
  }

  const handleRescheduleConfirm = () => {
    if (selectedDate && onReschedule) {
      const newDateString = format(selectedDate, "EEEE, MMMM d, yyyy")
      onReschedule(appointment.id, newDateString, selectedTime)
    }
    setIsRescheduling(false)
  }

  return (
    <Card className="overflow-hidden shadow-sm border-gray-200">
      <CardHeader className="bg-purple-50 pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-purple-600" />
            <h3 className="font-medium text-gray-800">{appointment.date}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-600" />
            <p className="text-sm text-muted-foreground">{appointment.time}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
          <div>
            <h4 className="font-medium text-gray-800">{appointment.type}</h4>
            <p className="text-sm text-muted-foreground mb-2">with {appointment.therapist}</p>
            <div className="flex items-start gap-2 mt-4">
              <FileText className="h-4 w-4 text-muted-foreground mt-1" />
              <p className="text-sm text-gray-700">{appointment.notes}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 justify-end items-start md:items-end">
            {type === "upcoming" ? (
              <>
                <Popover open={isRescheduling} onOpenChange={setIsRescheduling}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="border-purple-200 text-purple-600 hover:bg-purple-50" onClick={handleRescheduleClick}>
                      Reschedule
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0" align="end">
                    <div className="p-3 border-b flex justify-between items-center">
                      <h4 className="font-medium text-sm">Reschedule Appointment</h4>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setIsRescheduling(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="p-3">
                      <Label className="text-xs text-gray-500 mb-1 block">Select a new date</Label>
                      <div className="flex flex-col items-center space-y-2">

                        <div className="flex justify-between w-full px-2 items-center">
                          <button type="button" className="text-purple-600 hover:text-purple-800" onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}>&lt;</button>
                          <div className="text-gray-800 font-semibold">{format(currentMonth, "MMMM yyyy")}</div>
                          <button type="button" className="text-purple-600 hover:text-purple-800" onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}>&gt;</button>
                        </div>

                        <div className="grid grid-cols-7 w-full text-center text-xs text-muted-foreground">
                          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                            <div key={day}>{day}</div>
                          ))}
                        </div>
<Calendar
  mode="single"
  selected={selectedDate}
  onSelect={setSelectedDate}
  initialFocus
  month={currentMonth}
  className="rounded-md border-none"
  classNames={{
    table: "w-full border-separate border-spacing-0",
    day: "h-8 w-8 text-sm text-gray-700",
    day_selected: "bg-purple-600 text-white hover:bg-purple-700",
    day_today: "border-purple-500 text-purple-600",
    nav: "hidden",
    caption: "hidden",
    head_row: "hidden",
    head_cell: "hidden",
    caption_label: "hidden"
  }}
/>

                      </div>
                    </div>

                    <div className="px-3 pb-2">
                      <Label className="text-xs text-gray-500 mb-1 block">Select a new time</Label>
                      <Select value={selectedTime} onValueChange={setSelectedTime}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="Select time" /></SelectTrigger>
                        <SelectContent>
                          {TIME_SLOTS.map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="p-3 border-t flex justify-end">
                      <Button size="sm" className="bg-[#a98cc8] hover:bg-[#d7b1ff] text-white" onClick={handleRescheduleConfirm} disabled={!selectedDate}>
                        Confirm Changes
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => onCancel?.(appointment.id)}>
                  Cancel
                </Button>
              </>
            ) : appointment.report ? (
              <a href={appointment.report} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                  View Report
                </Button>
              </a>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
