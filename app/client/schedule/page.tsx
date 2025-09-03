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
import BookSessionModal from "@/components/book-session-modal"

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
  therapists: Therapist | null
}

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

interface Client {
  uid: string
  name: string
}

interface APIResponse {
  client: Client
  sessions: Session[]
  therapists?: AssignedTherapist[]
  requestedBy: string
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
  const [assignedTherapists, setAssignedTherapists] = useState<AssignedTherapist[]>([])
  const [client, setClient] = useState<Client | null>(null)
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
          await fetchSessionsAndTherapists(session.user.id)
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

  const fetchSessionsAndTherapists = async (userId: string) => {
    try {
      console.log('Fetching sessions and therapists for user ID:', userId)
      
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No access token available')
      }

      // Updated API call to use the new endpoint with therapists parameter
     console.log('Making API call to:', `/api/sessions/client/${userId}?therapists=true`);

const response = await fetch(`/api/sessions/client/${userId}?therapists=true`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json',
  },
});


      console.log('API Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        throw new Error(errorData.error || 'Failed to fetch sessions and therapists')
      }

      const data: APIResponse = await response.json()
      console.log('Raw API response:', data)
      
      // Set client info
      setClient(data.client)
      
      // Set assigned therapists if available
      if (data.therapists) {
        setAssignedTherapists(data.therapists)
        console.log('Assigned therapists:', data.therapists)
      }
      
      // Transform sessions to appointment format
      const transformedAppointments = data.sessions.map(session => transformSessionToAppointment(session))
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
      console.error('Error fetching sessions and therapists:', error)
      toast({
        title: "Error",
        description: "Failed to load your sessions and therapists. Please try again.",
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
      therapist: therapistName,
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

// Replace your current handleReschedule function with this:
const handleReschedule = async (id: number, newDate: string, newTime: string) => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) {
      throw new Error('No access token available')
    }

    // Parse the new date and time
    const [startTime, endTime] = newTime.split(' - ')
    const scheduledDate = format(new Date(newDate), 'yyyy-MM-dd')
    
    // Convert time to 24-hour format for database
    const formatTimeForDB = (timeStr: string): string => {
      const time = new Date(`1970-01-01 ${timeStr}`)
      return format(time, 'HH:mm:ss')
    }

    const updateData = {
      scheduled_date: scheduledDate,
      start_time: formatTimeForDB(startTime),
      end_time: formatTimeForDB(endTime),
      status: 'pending'
    }

    console.log('Updating session with data:', updateData)

    const response = await fetch(`/api/sessions/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    })

    console.log('Response status:', response.status)
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('Update API Error:', errorData)
      throw new Error(errorData.error || 'Failed to reschedule session')
    }

    const updatedSession = await response.json()
    console.log('Session updated successfully:', updatedSession)

    // Update local state
    setUpcomingAppointments((appointments) =>
      appointments.map((appointment) =>
        appointment.id === id 
          ? { 
              ...appointment, 
              date: newDate, 
              time: newTime, 
              status: 'pending',
              type: 'Pending Confirmation',
              notes: 'Waiting for therapist confirmation'
            } 
          : appointment,
      ),
    )

    toast({
      title: "Appointment rescheduled",
      description: `Your appointment has been rescheduled to ${newDate} at ${newTime}. Waiting for therapist confirmation.`,
      variant: "default",
    })

  } catch (error) {
    console.error('Error rescheduling appointment:', error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to reschedule appointment. Please try again.",
      variant: "destructive"
    })
  }
}

// Function to handle cancellation with API integration
const handleCancel = (id: number) => {
  toast({
    title: "Cancel appointment?",
    description: "Are you sure you want to cancel this appointment? This action cannot be undone.",
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
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) {
      throw new Error('No access token available')
    }

    console.log('Deleting session with ID:', id)

    const response = await fetch(`/api/sessions/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
    })

    console.log('Delete response status:', response.status)

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Delete API Error:', errorData)
      throw new Error(errorData.error || 'Failed to cancel session')
    }

    const result = await response.json()
    console.log('Session deleted successfully:', result)

    // Remove from local state
    setUpcomingAppointments((appointments) => 
      appointments.filter((appointment) => appointment.id !== id)
    )

    toast({
      title: "Appointment cancelled",
      description: "Your appointment has been cancelled successfully",
      variant: "default",
    })

  } catch (error) {
    console.error('Error cancelling appointment:', error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to cancel appointment. Please try again.",
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


  const handleSessionBooked = async () => {
  // Refresh the sessions data after a new session is booked
  if (user?.id) {
    await fetchSessionsAndTherapists(user.id)
  }
}
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-[#fef6f9]/30">
        <div className="container py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {client ? `${client.name}'s Schedule` : 'Your Schedule'}
            </h1>
            <p className="text-gray-600">Manage your upcoming and past therapy sessions</p>
            
            {/* Display assigned therapists */}
            {assignedTherapists.length > 0 && (
              <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Assigned Therapists</h3>
                <div className="grid gap-3">
                  {assignedTherapists.map((therapist) => (
                    <div key={therapist.tid} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div>
                        <p className="font-medium text-gray-800">{therapist.name}</p>
                        <p className="text-sm text-gray-600">
                          {therapist.assignment.sessions_count} sessions • Started {new Date(therapist.assignment.start_date).toLocaleDateString()}
                        </p>
                        {therapist.assignment.next_session_date && (
                          <p className="text-xs text-gray-500">
                            Next session: {new Date(therapist.assignment.next_session_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          therapist.assignment.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {therapist.assignment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                  <BookSessionModal 
  assignedTherapists={assignedTherapists} 
  onSessionBooked={handleSessionBooked}
>
  <Button className="bg-[#a98cc8] hover:bg-[#9678b4] text-white px-8 py-4 rounded-xl">
    Book Your First Session
  </Button>
</BookSessionModal>
                </div>
              )}

              {upcomingAppointments.length > 0 && (
                <div className="text-center mt-8">
                  <BookSessionModal 
  assignedTherapists={assignedTherapists} 
  onSessionBooked={handleSessionBooked}
>
  <Button className="bg-[#a98cc8] hover:bg-[#9678b4] text-white px-8 py-6 rounded-xl">
    Book New Session
  </Button>
</BookSessionModal>
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