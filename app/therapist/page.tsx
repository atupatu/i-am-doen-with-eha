import { Suspense } from "react"
import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, FileText, AlertCircle } from "lucide-react"
import TherapistStats from "@/components/therapist/therapist-stats"
import UpcomingAppointments from "@/components/therapist/upcoming-appointments"
import PendingRequests from "@/components/therapist/pending-requests"
import { getTherapistData } from "@/lib/therapist-data"

export const metadata: Metadata = {
  title: "Therapist Dashboard - Echoing Healthy Aging",
  description: "Manage your sessions, clients, and schedule",
}

export default async function TherapistDashboardPage() {
  const { stats, upcomingAppointments, pendingRequests } = await getTherapistData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back, Dr. Wilson. Here's an overview of your practice.</p>
      </div>

      <Suspense fallback={<div className="h-20 bg-gray-100 animate-pulse rounded-lg"></div>}>
        <TherapistStats stats={stats} />
      </Suspense>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center">
              <Clock className="mr-2 h-5 w-5 text-[#a98cc8]" />
              Upcoming Sessions
            </CardTitle>
            <CardDescription>Your next scheduled appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
              <UpcomingAppointments appointments={upcomingAppointments} />
            </Suspense>
            <Button className="w-full mt-4 bg-[#a98cc8] hover:bg-[#9678b4]" asChild>
              <a href="/therapist/schedule">View Full Schedule</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-[#a98cc8]" />
              Pending Requests
            </CardTitle>
            <CardDescription>Appointment requests awaiting your confirmation</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
              <PendingRequests requests={pendingRequests} />
            </Suspense>
            <Button className="w-full mt-4 bg-[#a98cc8] hover:bg-[#9678b4]" asChild>
              <a href="/therapist/requests">View All Requests</a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
          <TabsTrigger value="today" className="data-[state=active]:bg-[#a98cc8] data-[state=active]:text-white">
            Today
          </TabsTrigger>
          <TabsTrigger value="week" className="data-[state=active]:bg-[#a98cc8] data-[state=active]:text-white">
            This Week
          </TabsTrigger>
          <TabsTrigger value="month" className="data-[state=active]:bg-[#a98cc8] data-[state=active]:text-white">
            This Month
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Overview</CardTitle>
              <CardDescription>Your schedule and tasks for today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-[#fef6f9] p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-[#a98cc8]" />
                    <h3 className="font-medium">Sessions</h3>
                  </div>
                  <p className="text-2xl font-bold">{stats.todaySessions}</p>
                </div>
                <div className="bg-[#fef6f9] p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-[#a98cc8]" />
                    <h3 className="font-medium">Reports Due</h3>
                  </div>
                  <p className="text-2xl font-bold">{stats.reportsDue}</p>
                </div>
                <div className="bg-[#fef6f9] p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-[#a98cc8]" />
                    <h3 className="font-medium">New Clients</h3>
                  </div>
                  <p className="text-2xl font-bold">{stats.newClients}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="week" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Overview</CardTitle>
              <CardDescription>Your schedule and tasks for this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border border-dashed rounded-lg">
                <p className="text-gray-500">Weekly analytics visualization would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="month" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Overview</CardTitle>
              <CardDescription>Your schedule and tasks for this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border border-dashed rounded-lg">
                <p className="text-gray-500">Monthly analytics visualization would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
