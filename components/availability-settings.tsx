"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabaseClient"
import { Plus, Trash2, Clock } from "lucide-react"

interface TimeSlot {
  schedule_id?: number
  start_time: string
  end_time: string
}

interface DaySchedule {
  day_of_week: number
  isAvailable: boolean
  timeSlots: TimeSlot[]
}

interface AvailabilitySettingsProps {
  therapistId?: string
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' }
]

const TIME_OPTIONS = Array.from({ length: 24 * 2 }, (_, i) => {
  const hour = Math.floor(i / 2)
  const minute = i % 2 === 0 ? '00' : '30'
  const time = `${hour.toString().padStart(2, '0')}:${minute}`
  const displayTime = new Date(`2024-01-01T${time}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
  return { value: time, label: displayTime }
})

export default function AvailabilitySettings({ therapistId }: AvailabilitySettingsProps) {
  const [schedule, setSchedule] = useState<DaySchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [therapist, setTherapist] = useState<any>(null)

  // Get current user and therapist info
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
          
          // Get therapist data
          const { data: therapistData } = await supabase
            .from('therapists')
            .select('*')
            .eq('user_id', session.user.id)
            .single()
          
          if (therapistData) {
            setTherapist(therapistData)
            await fetchSchedule(therapistData.tid)
          }
        }
      } catch (error) {
        console.error('Error getting user:', error)
      }
    }
    getUser()
  }, [])

  const fetchSchedule = async (tid: string) => {
    try {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No access token available')
      }

      const response = await fetch(`/api/schedules/therapist/${tid}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch schedule')
      }

      const data = await response.json()
      
      // Transform API data to component state
      const scheduleByDay: { [key: number]: TimeSlot[] } = {}
      
      data.schedules.forEach((slot: any) => {
        if (!scheduleByDay[slot.day_of_week]) {
          scheduleByDay[slot.day_of_week] = []
        }
        scheduleByDay[slot.day_of_week].push({
          schedule_id: slot.schedule_id,
          start_time: slot.start_time,
          end_time: slot.end_time
        })
      })

      // Create schedule array for all days
      const newSchedule = DAYS_OF_WEEK.map(day => ({
        day_of_week: day.value,
        isAvailable: !!scheduleByDay[day.value]?.length,
        timeSlots: scheduleByDay[day.value] || []
      }))

      setSchedule(newSchedule)
    } catch (error) {
      console.error('Error fetching schedule:', error)
      toast({
        title: "Error",
        description: "Failed to load schedule",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const updateDayAvailability = (dayIndex: number, isAvailable: boolean) => {
    setSchedule(prev => prev.map((day, index) => 
      index === dayIndex 
        ? { 
            ...day, 
            isAvailable,
            timeSlots: isAvailable ? (day.timeSlots.length === 0 ? [{ start_time: '09:00', end_time: '17:00' }] : day.timeSlots) : []
          }
        : day
    ))
  }

  const addTimeSlot = (dayIndex: number) => {
    setSchedule(prev => prev.map((day, index) => 
      index === dayIndex 
        ? { 
            ...day, 
            timeSlots: [...day.timeSlots, { start_time: '09:00', end_time: '10:00' }]
          }
        : day
    ))
  }

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    setSchedule(prev => prev.map((day, index) => 
      index === dayIndex 
        ? { 
            ...day, 
            timeSlots: day.timeSlots.filter((_, i) => i !== slotIndex)
          }
        : day
    ))
  }

  const updateTimeSlot = (dayIndex: number, slotIndex: number, field: 'start_time' | 'end_time', value: string) => {
    setSchedule(prev => prev.map((day, index) => 
      index === dayIndex 
        ? { 
            ...day, 
            timeSlots: day.timeSlots.map((slot, i) => 
              i === slotIndex ? { ...slot, [field]: value } : slot
            )
          }
        : day
    ))
  }

  const saveSchedule = async () => {
    if (!therapist?.tid) return

    try {
      setSaving(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No access token available')
      }

      // First, delete all existing schedules for this therapist
      const { error: deleteError } = await supabase
        .from('therapist_schedule')
        .delete()
        .eq('tid', therapist.tid)

      if (deleteError) throw deleteError

      // Then, insert new schedule slots
      const scheduleSlots = []
      for (const day of schedule) {
        if (day.isAvailable && day.timeSlots.length > 0) {
          for (const slot of day.timeSlots) {
            if (slot.start_time && slot.end_time && slot.start_time < slot.end_time) {
              scheduleSlots.push({
                tid: therapist.tid,
                day_of_week: day.day_of_week,
                start_time: slot.start_time + ':00', // Ensure seconds
                end_time: slot.end_time + ':00'
              })
            }
          }
        }
      }

      if (scheduleSlots.length > 0) {
        const { error: insertError } = await supabase
          .from('therapist_schedule')
          .insert(scheduleSlots)

        if (insertError) throw insertError
      }

      toast({
        title: "Schedule Updated",
        description: "Your availability has been saved successfully",
        variant: "default"
      })

      // Refresh the schedule data
      await fetchSchedule(therapist.tid)

    } catch (error) {
      console.error('Error saving schedule:', error)
      toast({
        title: "Error",
        description: "Failed to save schedule. Please try again.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day.value} className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Weekly Availability</h3>
          <p className="text-sm text-gray-600">Set your working hours for each day of the week</p>
        </div>
        <Button 
          onClick={saveSchedule} 
          disabled={saving}
          className="bg-[#a98cc8] hover:bg-purple-700"
        >
          {saving ? "Saving..." : "Save Schedule"}
        </Button>
      </div>

      <div className="space-y-4">
        {DAYS_OF_WEEK.map((dayInfo, dayIndex) => {
          const daySchedule = schedule[dayIndex]
          if (!daySchedule) return null

          return (
            <Card key={dayInfo.value}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{dayInfo.label}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={daySchedule.isAvailable}
                      onCheckedChange={(checked) => updateDayAvailability(dayIndex, checked)}
                    />
                    <span className="text-sm text-gray-600">Available</span>
                  </div>
                </div>
              </CardHeader>
              
              {daySchedule.isAvailable && (
                <CardContent className="space-y-3">
                  {daySchedule.timeSlots.map((slot, slotIndex) => (
                    <div key={slotIndex} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <Select
                        value={slot.start_time}
                        onValueChange={(value) => updateTimeSlot(dayIndex, slotIndex, 'start_time', value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_OPTIONS.map((time) => (
                            <SelectItem key={time.value} value={time.value}>
                              {time.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <span className="text-gray-500">to</span>
                      
                      <Select
                        value={slot.end_time}
                        onValueChange={(value) => updateTimeSlot(dayIndex, slotIndex, 'end_time', value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_OPTIONS.filter(time => time.value > slot.start_time).map((time) => (
                            <SelectItem key={time.value} value={time.value}>
                              {time.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {daySchedule.timeSlots.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addTimeSlot(dayIndex)}
                    className="w-full mt-2"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Time Slot
                  </Button>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Tips for setting your schedule:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• You can add multiple time slots per day (e.g., morning and evening sessions)</li>
          <li>• Make sure to leave buffer time between sessions</li>
          <li>• Your schedule will be used for client booking availability</li>
          <li>• You can update your schedule weekly as needed</li>
        </ul>
      </div>
    </div>
  )
}