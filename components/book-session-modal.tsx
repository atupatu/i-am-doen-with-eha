"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabaseClient"
import { format, addDays, isToday, isTomorrow, parseISO } from "date-fns"
import { CalendarIcon, Clock, User } from "lucide-react"

interface AssignedTherapist {
  tid: string
  name: string
  assignment: {
    id: string
    status: string
    start_date: string
    end_date: string | null
    sessions_count: number
    next_session_date: string | null
    notes: string | null
  }
}

interface TimeSlot {
  id: string
  start_time: string
  end_time: string
  date: string
  available: boolean
}

interface BookSessionModalProps {
  assignedTherapists: AssignedTherapist[]
  onSessionBooked: () => void
  children: React.ReactNode
}

export default function BookSessionModal({ 
  assignedTherapists, 
  onSessionBooked, 
  children 
}: BookSessionModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTherapist, setSelectedTherapist] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [loadingSlots, setLoadingSlots] = useState(false)

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedTherapist("")
      setSelectedDate(undefined)
      setAvailableSlots([])
      setSelectedSlot("")
    }
  }, [isOpen])

  // Fetch available slots when therapist and date are selected
  useEffect(() => {
    if (selectedTherapist && selectedDate) {
      fetchAvailableSlots(selectedTherapist, selectedDate)
    }
  }, [selectedTherapist, selectedDate])

  const fetchAvailableSlots = async (therapistId: string, date: Date) => {
    try {
      setLoadingSlots(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No access token available')
      }

      const formattedDate = format(date, 'yyyy-MM-dd')
      const response = await fetch(`/api/therapists/${therapistId}/availability?date=${formattedDate}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch available slots')
      }

      const slots = await response.json()
      setAvailableSlots(slots)
      setSelectedSlot("")
    } catch (error) {
      console.error('Error fetching available slots:', error)
      toast({
        title: "Error",
        description: "Failed to fetch available time slots. Please try again.",
        variant: "destructive"
      })
      setAvailableSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }

  const formatTimeSlot = (startTime: string, endTime: string): string => {
    const formatTime = (timeString: string): string => {
      const time = new Date(`1970-01-01T${timeString}`)
      return format(time, "h:mm a")
    }
    return `${formatTime(startTime)} - ${formatTime(endTime)}`
  }

  const getDateDisplay = (date: Date): string => {
    if (isToday(date)) return "Today"
    if (isTomorrow(date)) return "Tomorrow"
    return format(date, "EEEE, MMMM d")
  }

  const handleBookSession = async () => {
    if (!selectedTherapist || !selectedDate || !selectedSlot) {
      toast({
        title: "Missing Information",
        description: "Please select a therapist, date, and time slot.",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No access token available')
      }

      const selectedSlotData = availableSlots.find(slot => slot.id === selectedSlot)
      if (!selectedSlotData) {
        throw new Error('Selected time slot not found')
      }

      const { data: { session: authSession }, error: sessionError } = await supabase.auth.getSession()
      if (!authSession?.user) {
        throw new Error('User not authenticated')
      }

      const bookingData = {
        uid: authSession.user.id, // Use authSession user ID
        tid: selectedTherapist,
        scheduled_date: format(selectedDate, 'yyyy-MM-dd'),
        start_time: selectedSlotData.start_time,
        end_time: selectedSlotData.end_time,
        status: 'pending'
      }

      console.log('Booking session with data:', bookingData)
      console.log('Selected slot data:', selectedSlotData)

      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authSession.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error Response:', errorData)
        console.error('Request body was:', bookingData)
        console.error('Response status:', response.status)
        throw new Error(errorData.error || 'Failed to book session')
      }

      const newSession = await response.json()
      console.log('Session booked successfully:', newSession)

      toast({
        title: "Session Booked!",
        description: `Your session has been booked for ${getDateDisplay(selectedDate)} at ${formatTimeSlot(selectedSlotData.start_time, selectedSlotData.end_time)}. Waiting for therapist confirmation.`,
        variant: "default"
      })

      setIsOpen(false)
      onSessionBooked()

    } catch (error) {
      console.error('Error booking session:', error)
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Failed to book session. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter out inactive therapists
  const activeTherapists = assignedTherapists.filter(
    therapist => therapist.assignment.status === 'active'
  )

  if (activeTherapists.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book New Session</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              You don't have any active therapist assignments yet.
            </p>
            <p className="text-sm text-gray-500">
              Please contact your coordinator to get assigned to a therapist.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Book New Session</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Therapist Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4" />
              Select Therapist
            </label>
            <Select value={selectedTherapist} onValueChange={setSelectedTherapist}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your therapist" />
              </SelectTrigger>
              <SelectContent>
                {activeTherapists.map((therapist) => (
                  <SelectItem key={therapist.tid} value={therapist.tid}>
                    <div className="flex flex-col">
                      <span className="font-medium">{therapist.name}</span>
                      <span className="text-xs text-gray-500">
                        {therapist.assignment.sessions_count} sessions completed
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Selection */}
          {selectedTherapist && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Select Date
              </label>
              <div className="border rounded-md p-3">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date > addDays(new Date(), 30)}
                  className="rounded-md"
                />
              </div>
            </div>
          )}

          {/* Time Slot Selection */}
          {selectedTherapist && selectedDate && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Available Time Slots for {getDateDisplay(selectedDate)}
              </label>
              
              {loadingSlots ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-gray-500">Loading available slots...</div>
                </div>
              ) : availableSlots.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {availableSlots
                    .filter(slot => slot.available)
                    .map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot.id)}
                        className={`p-3 text-sm border rounded-lg transition-colors ${
                          selectedSlot === slot.id
                            ? 'border-[#a98cc8] bg-[#a98cc8] text-white'
                            : 'border-gray-200 hover:border-[#a98cc8] hover:bg-purple-50'
                        }`}
                      >
                        {formatTimeSlot(slot.start_time, slot.end_time)}
                      </button>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No available slots for this date. Please try a different date.
                </div>
              )}
            </div>
          )}

          {/* Booking Summary */}
          {selectedTherapist && selectedDate && selectedSlot && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Booking Summary</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Therapist:</span> {activeTherapists.find(t => t.tid === selectedTherapist)?.name}</p>
                <p><span className="font-medium">Date:</span> {getDateDisplay(selectedDate)}</p>
                <p><span className="font-medium">Time:</span> {
                  availableSlots.find(slot => slot.id === selectedSlot) && 
                  formatTimeSlot(
                    availableSlots.find(slot => slot.id === selectedSlot)!.start_time,
                    availableSlots.find(slot => slot.id === selectedSlot)!.end_time
                  )
                }</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBookSession}
              disabled={!selectedTherapist || !selectedDate || !selectedSlot || loading}
              className="flex-1 bg-[#a98cc8] hover:bg-purple-700 text-white"
            >
              {loading ? "Booking..." : "Book Session"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}