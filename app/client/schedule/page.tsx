"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AppointmentCard from "@/components/appointment-card"
import Navbar from "@/components/navbar"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

// Initial appointment data
const initialUpcomingAppointments = [
  {
    id: 1,
    date: "Monday, April 15, 2024",
    time: "10:00 AM - 11:00 AM",
    therapist: "Dr. Emma Wilson",
    type: "Cognitive Behavioral Therapy",
    notes: "Focus on identifying negative thought patterns and restructuring them.",
  },
  {
    id: 2,
    date: "Thursday, April 18, 2024",
    time: "2:00 PM - 3:00 PM",
    therapist: "Dr. James Chen",
    type: "Family Therapy",
    notes: "Address communication challenges within the family unit.",
  },
  {
    id: 3,
    date: "Monday, April 22, 2024",
    time: "3:30 PM - 4:30 PM",
    therapist: "Dr. Marcus Johnson",
    type: "Anxiety Management",
    notes: "Explore breathing techniques and journaling as coping tools.",
  },
]

const pastAppointments = [
  {
    id: 4,
    date: "Monday, April 8, 2024",
    time: "10:00 AM - 11:00 AM",
    therapist: "Dr. Emma Wilson",
    type: "Cognitive Behavioral Therapy",
    notes: "Session focused on managing self-doubt and procrastination.",
    report: "/reports/session_4.pdf", // PDF link for this session
  },
  {
    id: 5,
    date: "Thursday, April 4, 2024",
    time: "2:00 PM - 3:00 PM",
    therapist: "Dr. James Chen",
    type: "Family Therapy",
    notes: "Reviewed previous conflicts and set actionable steps.",
    report: "/reports/session_5.pdf", // Added report link for this session
  },
]

export default function SchedulePage() {
  // State to manage appointments
  const [upcomingAppointments, setUpcomingAppointments] = useState(initialUpcomingAppointments)

  // Function to handle rescheduling
  const handleReschedule = (id: number, newDate: string, newTime: string) => {
    setUpcomingAppointments((appointments) =>
      appointments.map((appointment) =>
        appointment.id === id ? { ...appointment, date: newDate, time: newTime } : appointment,
      ),
    )

    // Show success toast
    toast({
      title: "Appointment rescheduled",
      description: `Your appointment has been rescheduled to ${newDate} at ${newTime}`,
      variant: "default",
    })
  }

  // Function to handle cancellation
  const handleCancel = (id: number) => {
    // Show confirmation toast
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

  const confirmCancel = (id: number) => {
    setUpcomingAppointments((appointments) => appointments.filter((appointment) => appointment.id !== id))

    toast({
      title: "Appointment cancelled",
      description: "Your appointment has been cancelled successfully",
      variant: "default",
    })
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
