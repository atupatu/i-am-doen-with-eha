"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { rescheduleTherapistAppointment } from "@/lib/therapist-actions"

interface RescheduleAppointmentFormProps {
  appointmentId: number
  currentDate: string
  currentTime: string
  onSuccess: () => void
}

export default function RescheduleAppointmentForm({
  appointmentId,
  currentDate,
  currentTime,
  onSuccess,
}: RescheduleAppointmentFormProps) {
  const [date, setDate] = useState<Date | undefined>(new Date(currentDate))
  const [timeSlot, setTimeSlot] = useState<string>(currentTime)
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Available time slots
  const morningSlots = ["9:00 AM", "10:00 AM", "11:00 AM"]
  const afternoonSlots = ["1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"]
  const eveningSlots = ["5:00 PM", "6:00 PM", "7:00 PM"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !timeSlot) return

    setIsSubmitting(true)
    try {
      await rescheduleTherapistAppointment({
        appointmentId,
        date: date.toISOString(),
        timeSlot,
        reason,
      })
      onSuccess()
    } catch (error) {
      console.error("Error rescheduling appointment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-medium mb-3">Select a Date</h3>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="border rounded-md"
            disabled={(date) => {
              // Disable past dates and weekends
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              const day = date.getDay()
              return date < today || day === 0 || day === 6
            }}
          />
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Select a Time</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-2">Morning</h4>
              <RadioGroup value={timeSlot} onValueChange={setTimeSlot} className="grid grid-cols-3 gap-2">
                {morningSlots.map((slot) => (
                  <div key={slot} className="flex items-center space-x-2">
                    <RadioGroupItem value={slot} id={`time-${slot}`} />
                    <Label htmlFor={`time-${slot}`} className="text-sm">
                      {slot}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-2">Afternoon</h4>
              <RadioGroup value={timeSlot} onValueChange={setTimeSlot} className="grid grid-cols-2 gap-2">
                {afternoonSlots.map((slot) => (
                  <div key={slot} className="flex items-center space-x-2">
                    <RadioGroupItem value={slot} id={`time-${slot}`} />
                    <Label htmlFor={`time-${slot}`} className="text-sm">
                      {slot}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-2">Evening</h4>
              <RadioGroup value={timeSlot} onValueChange={setTimeSlot} className="grid grid-cols-3 gap-2">
                {eveningSlots.map((slot) => (
                  <div key={slot} className="flex items-center space-x-2">
                    <RadioGroupItem value={slot} id={`time-${slot}`} />
                    <Label htmlFor={`time-${slot}`} className="text-sm">
                      {slot}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Reason for Rescheduling (Optional)</Label>
        <Textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Provide a reason for rescheduling this appointment"
          className="rounded-xl min-h-[100px]"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#a98cc8] hover:bg-[#9678b4]" disabled={isSubmitting || !date || !timeSlot}>
          {isSubmitting ? "Submitting..." : "Confirm Reschedule"}
        </Button>
      </div>
    </form>
  )
}
