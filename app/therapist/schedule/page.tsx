import { Suspense } from "react"
import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Clock, Filter } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import TherapistAppointmentsList from "@/components/therapist/therapist-appointments-list"
import { getTherapistAppointments } from "@/lib/therapist-data"
import AvailabilitySettings from "@/components/therapist/availability-settings"

export const metadata: Metadata = {
  title: "Schedule - Therapist Portal",
  description: "Manage your appointments and availability",
}

export default async function TherapistSchedulePage() {
  const { appointments, availability } = await getTherapistAppointments()

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
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">Confirmed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-sm">Pending</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-sm">Cancelled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
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
