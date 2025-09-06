// The schedule page (e.g., app/therapist/schedule/page.tsx)
import { Suspense } from "react"
import type { Metadata } from "next"
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Clock, Filter } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import TherapistAppointmentsList from "@/components/therapist/therapist-appointments-list"
import AvailabilitySettings from "@/components/therapist/availability-settings"

export const metadata: Metadata = {
  title: "Schedule - Therapist Portal",
  description: "Manage your appointments and availability",
}

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

// Helper function to get sessions data
async function getTherapistSessions() {
  try {
    const cookieStore = cookies()
const supabase = createServerComponentClient({ cookies: () => cookieStore })

    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      return { error: 'Session error', data: [] }
    }
    
    if (!session?.access_token || !session?.user?.id) {
      return { error: 'No valid session', data: [] }
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/sessions/therapist/${session.user.id}`

    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })
    console.log("Fetch sessions response:", response);
    if (!response.ok) {
      const errorText = await response.text()
      return { error: `API Error: ${response.status}`, data: [] }
    }

    const result = await response.json()
    console.log("Fetched sessions data:", result);
    
    return { error: null, data: result.data || [] }
  } catch (error) {
    return { error: error.message || 'Unknown error', data: [] }
  }
}

// Transform API data to match component expectations
function transformSessionToAppointment(session: any) {
  return {
    sid: session.sid,
    uid: session.uid,
    userName: session.users?.name || session.users?.email || `User ${session.uid}`,
    scheduled_date: session.scheduled_date,
    start_time: session.start_time,
    end_time: session.end_time,
    status: session.status, // Keep the original status from API
    report_content: session.report_content,
    report_submitted_at: session.report_submitted_at,
    date: session.scheduled_date,
  }
}

export default async function TherapistSchedulePage() {
  // Get current user session
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Please log in to view your schedule</p>
      </div>
    )
  }

  // Fetch therapist data
  const { data: therapist, error: therapistError } = await supabase
    .from('therapists')
    .select('*')
    .eq('user_id', session.user.id)
    .single()

  if (therapistError || !therapist) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading therapist data: {therapistError?.message || 'Not found'}</p>
      </div>
    )
  }

  const { error: sessionsError, data: sessionsData } = await getTherapistSessions()
  
  // Show error state if there's an issue with sessions
  if (sessionsError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading appointments: {sessionsError}</p>
      </div>
    )
  }
  
  const appointments = sessionsData.map(transformSessionToAppointment)

  // Use fetched availability or default
  const availability: WeeklyAvailability = therapist.availability || {
    monday: { isAvailable: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
    tuesday: { isAvailable: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
    wednesday: { isAvailable: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
    thursday: { isAvailable: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
    friday: { isAvailable: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
    saturday: { isAvailable: false, timeSlots: [] },
    sunday: { isAvailable: false, timeSlots: [] },
    maxHoursPerWeek: therapist.availability_hours || 40,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Schedule</h1>
        <p className="text-gray-600">Manage your appointments and availability</p>
      </div>

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
          <TabsTrigger value="calendar" className="data-[state=active]:bg-[#a98cc8] data-[state=active]:text-white">
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="list" className="data-[state=active]:bg-[#a98cc8] data-[state=active]:text-white">
            List View
          </TabsTrigger>
          <TabsTrigger value="availability" className="data-[state=active]:bg-[#a98cc8] data-[state=active]:text-white">
            Availability
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Calendar</CardTitle>
                  <CardDescription>View and manage your appointments</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Today
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-[300px_1fr]">
                <div>
                  <Calendar mode="single" selected={new Date()} className="border rounded-md" />
                  <div className="mt-4 space-y-2">
                    <h3 className="font-medium text-sm">Legend</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#a98cc8]"></div>
                      <span className="text-sm">Approved</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-sm">Pending</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-sm">Declined</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">Completed</span>
                    </div>
                  </div>
                </div>
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4 flex items-center">
                    <CalendarIcon className="mr-2 h-5 w-5 text-[#a98cc8]" />
                    Appointments for{" "}
                    {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  </h3>
                  <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
                    <TherapistAppointmentsList
                      appointments={appointments.filter(
                        (a) => new Date(a.date).toDateString() === new Date().toDateString(),
                      )}
                    />
                  </Suspense>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Appointments</CardTitle>
                  <CardDescription>View all your upcoming and past appointments</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
                  <TabsTrigger
                    value="upcoming"
                    className="rounded-l-lg data-[state=active]:bg-[#a98cc8] data-[state=active]:text-white"
                  >
                    Upcoming
                  </TabsTrigger>
                  <TabsTrigger
                    value="past"
                    className="rounded-r-lg data-[state=active]:bg-[#a98cc8] data-[state=active]:text-white"
                  >
                    Past
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="space-y-4">
                  <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
                    <TherapistAppointmentsList
                      appointments={appointments.filter((a) => new Date(a.date) >= new Date())}
                    />
                  </Suspense>
                </TabsContent>

                <TabsContent value="past" className="space-y-4">
                  <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
                    <TherapistAppointmentsList
                      appointments={appointments.filter((a) => new Date(a.date) < new Date())}
                    />
                  </Suspense>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Availability Settings</CardTitle>
              <CardDescription>Set your working hours and availability</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
                <AvailabilitySettings availability={availability} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 