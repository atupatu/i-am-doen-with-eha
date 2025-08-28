// components/therapist/availability-settings.tsx
"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateTherapistAvailability } from "@/lib/therapist-actions"

interface TimeSlot {
  start: string
  end: string
}

interface DayAvailability {
  isAvailable: boolean
  timeSlots: TimeSlot[]
}

interface WeeklyAvailability {
  monday: DayAvailability
  tuesday: DayAvailability
  wednesday: DayAvailability
  thursday: DayAvailability
  friday: DayAvailability
  saturday: DayAvailability
  sunday: DayAvailability
  maxHoursPerWeek: number
}

interface AvailabilitySettingsProps {
  availability: WeeklyAvailability
}

export default function AvailabilitySettings({ availability: initialAvailability }: AvailabilitySettingsProps) {
  const [availability, setAvailability] = useState<WeeklyAvailability>(initialAvailability)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const days = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ] as const

  const handleDayToggle = (day: keyof WeeklyAvailability) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        isAvailable: !prev[day].isAvailable,
      },
    }))
  }

  const handleTimeSlotChange = (day: keyof WeeklyAvailability, index: number, field: keyof TimeSlot, value: string) => {
    setAvailability((prev) => {
      const newTimeSlots = [...prev[day].timeSlots]
      newTimeSlots[index] = {
        ...newTimeSlots[index],
        [field]: value,
      }
      return {
        ...prev,
        [day]: {
          ...prev[day],
          timeSlots: newTimeSlots,
        },
      }
    })
  }

  const addTimeSlot = (day: keyof WeeklyAvailability) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: [...prev[day].timeSlots, { start: "09:00", end: "17:00" }],
      },
    }))
  }

  const removeTimeSlot = (day: keyof WeeklyAvailability, index: number) => {
    setAvailability((prev) => {
      const newTimeSlots = [...prev[day].timeSlots]
      newTimeSlots.splice(index, 1)
      return {
        ...prev,
        [day]: {
          ...prev[day],
          timeSlots: newTimeSlots,
        },
      }
    })
  }

  const handleMaxHoursChange = (value: string) => {
    setAvailability((prev) => ({
      ...prev,
      maxHoursPerWeek: Number.parseInt(value) || 0,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await updateTherapistAvailability(availability)
      alert("Availability settings updated successfully!")
    } catch (error) {
      console.error("Error updating availability:", error)
      alert("Failed to update availability settings. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="max-hours">Maximum Working Hours per Week</Label>
        <div className="flex items-center gap-2">
          <Input
            id="max-hours"
            type="number"
            min="1"
            max="60"
            value={availability.maxHoursPerWeek}
            onChange={(e) => handleMaxHoursChange(e.target.value)}
            className="w-24 rounded-xl"
          />
          <span>hours</span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Weekly Schedule</h3>
        {days.map(({ key, label }) => (
          <Card key={key} className={availability[key].isAvailable ? "border-[#a98cc8]" : ""}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={availability[key].isAvailable}
                    onCheckedChange={() => handleDayToggle(key)}
                    id={`available-${key}`}
                  />
                  <Label htmlFor={`available-${key}`} className="font-medium">
                    {label}
                  </Label>
                </div>
                {availability[key].isAvailable && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addTimeSlot(key)}
                    className="text-[#a98cc8] border-[#a98cc8] hover:bg-[#a98cc8]/10"
                  >
                    Add Time Slot
                  </Button>
                )}
              </div>

              {availability[key].isAvailable && (
                <div className="space-y-3">
                  {availability[key].timeSlots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Select
                        value={slot.start}
                        onValueChange={(value) => handleTimeSlotChange(key, index, "start", value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Start time" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 13 }, (_, i) => i + 8).map((hour) => (
                            <SelectItem key={hour} value={`${hour.toString().padStart(2, "0")}:00`}>
                              {hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? "12:00 PM" : `${hour}:00 AM`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <span>to</span>

                      <Select
                        value={slot.end}
                        onValueChange={(value) => handleTimeSlotChange(key, index, "end", value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="End time" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 13 }, (_, i) => i + 9).map((hour) => (
                            <SelectItem key={hour} value={`${hour.toString().padStart(2, "0")}:00`}>
                              {hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? "12:00 PM" : `${hour}:00 AM`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTimeSlot(key, index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Button type="submit" className="bg-[#a98cc8] hover:bg-[#9678b4]" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Availability"}
      </Button>
    </form>
  )
}