"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AppointmentCard from "@/components/appointment-card"
import Navbar from "@/components/navbar"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { supabase } from "@/lib/supabaseClient"
import { format } from "date-fns"

interface Therapist {
  name: string
}

interface Session {
  sid: number
  uid: string
  tid: string
  scheduled_date: string
  start_time: string
  end_time: string
  status: 'pending' | 'approved' | 'declined' | 'completed'
  verified: boolean
  report_content: string | null
  report_submitted_at: string | null
  therapists: Therapist | null // Updated to match API response structure
}

interface AppointmentData {
  id: number
  date: string
  time: string
  therapist: string
  type: string
  notes: string
  report?: string
  status: string
}

export default function SchedulePage() {
  const [upcomingAppointments, setUpcomingAppointments] = useState<AppointmentData[]>([])
  const [pastAppointments, setPastAppointments] = useState<AppointmentData[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  // Get current user and fetch sessions
  useEffect(() => {
    const getUser = async () => {
      try {
        // First try to get the session to check if user is logged in
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        console.log('Session data:', session)
        console.log('Session error:', sessionError)
        
        if (session?.user) {
          setUser(session.user)
          console.log('Current user ID:', session.user.id)
          await fetchSessions(session.user.id)
        } else {
          console.log('No session found')
          toast({
            title: "Authentication Error",
            description: "Please log in to view your sessions",
            variant: "destructive"
          })
        }
      } catch (error) {
        console.error('Auth error:', error)
        toast({
          title: "Authentication Error", 
          description: "Failed to get user session",
          variant: "destructive"
        })
      }
      setLoading(false)
    }

    getUser()
  }, [])

  const fetchSessions = async (userId: string) => {
    try {
      console.log('Fetching sessions for user ID:', userId)
      
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No access token available')
      }

      console.log('Making API call to:', `/api/sessions/client/${userId}`)
      
      const response = await fetch(`/api/sessions/client/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      })

      console.log('API Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        throw new Error(errorData.error || 'Failed to fetch sessions')
      }

      const sessions: Session[] = await response.json()
      console.log('Raw sessions data:', sessions)
      
      // Transform sessions to appointment format
      const transformedAppointments = sessions.map(session => transformSessionToAppointment(session))
      console.log('Transformed appointments:', transformedAppointments)
      
      // Separate upcoming and past appointments
      const now = new Date()
      const upcoming: AppointmentData[] = []
      const past: AppointmentData[] = []

      transformedAppointments.forEach(appointment => {
        const appointmentDate = new Date(appointment.date)
        if (appointmentDate >= now && appointment.status !== 'completed') {
          upcoming.push(appointment)
        } else {
          past.push(appointment)
        }
      })

      console.log('Upcoming appointments:', upcoming)
      console.log('Past appointments:', past)

      setUpcomingAppointments(upcoming)
      setPastAppointments(past)

    } catch (error) {
      console.error('Error fetching sessions:', error)
      toast({
        title: "Error",
        description: "Failed to load your sessions. Please try again.",
        variant: "destructive"
      })
    }
  }

  const transformSessionToAppointment = (session: Session): AppointmentData => {
    // Format date
    const date = new Date(session.scheduled_date)
    const formattedDate = format(date, "EEEE, MMMM d, yyyy")
    
    // Format time
    const startTime = formatTime(session.start_time)
    const endTime = formatTime(session.end_time)
    const timeSlot = `${startTime} - ${endTime}`
    
    // Get therapist name from the joined data
    const therapistName = session.therapists?.name || "Unknown Therapist"
    
    return {
      id: session.sid,
      date: formattedDate,
      time: timeSlot,
      therapist: therapistName, // Now using actual therapist name
      type: getSessionType(session.status),
      notes: getSessionNotes(session.status),
      report: session.report_content ? `/reports/session_${session.sid}.pdf` : undefined,
      status: session.status
    }
  }

  const formatTime = (timeString: string): string => {
    const time = new Date(`1970-01-01T${timeString}`)
    return format(time, "h:mm a")
  }

  const getSessionType = (status: string): string => {
    switch (status) {
      case 'pending': return 'Pending Confirmation'
      case 'approved': return 'Therapy Session'
      case 'declined': return 'Declined Session'
      case 'completed': return 'Completed Session'
      default: return 'Therapy Session'
    }
  }

  const getSessionNotes = (status: string): string => {
    switch (status) {
      case 'pending': return 'Waiting for therapist confirmation'
      case 'approved': return 'Session confirmed and ready'
      case 'declined': return 'Session was declined by therapist'
      case 'completed': return 'Session completed successfully'
      default: return 'Therapy session notes'
    }
  }

  // Function to handle rescheduling
  const handleReschedule = async (id: number, newDate: string, newTime: string) => {
    try {
      // Here you would typically call an API to update the session
      // For now, we'll just update the local state
      setUpcomingAppointments((appointments) =>
        appointments.map((appointment) =>
          appointment.id === id ? { ...appointment, date: newDate, time: newTime } : appointment,
        ),
      )

      toast({
        title: "Appointment rescheduled",
        description: `Your appointment has been rescheduled to ${newDate} at ${newTime}`,
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reschedule appointment. Please try again.",
        variant: "destructive"
      })
    }
  }

  // Function to handle cancellation
  const handleCancel = (id: number) => {
    toast({
      title: "Cancel appointment?",
      description: "Are you sure you want to cancel this appointment?",
      variant: "destructive",
      action: (
        <ToastAction altText="Confirm" onClick={() => confirmCancel(id)}>
          Confirm
        </ToastAction>
      ),
    })
  }

  const confirmCancel = async (id: number) => {
    try {
      // Here you would typically call an API to cancel the session
      // For now, we'll just remove from local state
      setUpcomingAppointments((appointments) => appointments.filter((appointment) => appointment.id !== id))

      toast({
        title: "Appointment cancelled",
        description: "Your appointment has been cancelled successfully",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 bg-[#fef6f9]/30">
          <div className="container py-12">
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-600">Loading your sessions...</div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-[#fef6f9]/30">
        <div className="container py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Schedule</h1>
            <p className="text-gray-600">Manage your upcoming and past therapy sessions</p>
          </div>

          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger
                value="upcoming"
                className="rounded-l-lg data-[state=active]:bg-[#a98cc8] data-[state=active]:text-white"
              >
                Upcoming Sessions
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="rounded-r-lg data-[state=active]:bg-[#a98cc8] data-[state=active]:text-white"
              >
                Past Sessions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-6">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    type="upcoming"
                    onReschedule={handleReschedule}
                    onCancel={handleCancel}
                  />
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <p className="text-gray-500 mb-4">You have no upcoming appointments</p>
                  <Button className="bg-[#a98cc8] hover:bg-purple-700 text-white px-8 py-4 rounded-xl">
                    Book Your First Session
                  </Button>
                </div>
              )}

              {upcomingAppointments.length > 0 && (
                <div className="text-center mt-8">
                  <Button className="bg-[#a98cc8] hover:bg-purple-700 text-white px-8 py-6 rounded-xl">
                    Book New Session
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-6">
              {pastAppointments.length > 0 ? (
                pastAppointments.map((appt) => (
                  <div key={appt.id} className="space-y-4">
                    <AppointmentCard appointment={appt} type="past" />
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <p className="text-gray-500">You have no past appointments</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}