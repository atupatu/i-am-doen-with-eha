import { Suspense } from "react"
import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Bell, Shield } from "lucide-react"
import ProfileForm from "@/components/therapist/profile-form"
import NotificationSettings from "@/components/therapist/notification-settings"
import AccountSettings from "@/components/therapist/account-settings"
import { getTherapistProfile } from "@/lib/therapist-data"

export const metadata: Metadata = {
  title: "Profile - Therapist Portal",
  description: "Manage your profile and account settings",
}

export default async function TherapistProfilePage() {
  const profile = await getTherapistProfile()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Profile</h1>
        <p className="text-gray-600">Manage your profile and account settings</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
          <TabsTrigger value="profile" className="data-[state=active]:bg-[#a98cc8] data-[state=active]:text-white">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-[#a98cc8] data-[state=active]:text-white"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="account" className="data-[state=active]:bg-[#a98cc8] data-[state=active]:text-white">
            <Shield className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal and professional information</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
                <ProfileForm profile={profile} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
                <NotificationSettings settings={profile.notificationSettings} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account security and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
                <AccountSettings settings={profile.accountSettings} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
