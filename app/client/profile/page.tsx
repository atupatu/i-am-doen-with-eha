"use client"

import { useState } from "react"
import Link from "next/link"
import {
  User,
  Settings,
  CreditCard,
  Calendar,
  UserCheck,
  Heart,
  ChevronRight,
  Edit,
  LogOut,
  Bell,
  Trash2,
  Clock,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navbar from "@/components/navbar"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 py-10 bg-gradient-to-b from-[#fef6f9]/50 to-white">
        <div className="container max-w-6xl">

          <div className="grid gap-8 md:grid-cols-[240px_1fr]">
            {/* Sidebar Navigation */}
            <div className="space-y-4">
              <ProfileNavCard />

              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-[#f9f4ff] p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-[#a98cc8]/20 p-2">
                        <UserCheck className="h-5 w-5 text-[#a98cc8]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Dr. Sarah Johnson</p>
                        <p className="text-sm text-gray-600">Your Therapist</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <Link href="/therapist/sarah-johnson">
                      <Button
                        variant="ghost"
                        className="w-full justify-between text-[#a98cc8] hover:bg-[#fef6f9] hover:text-[#a98cc8]"
                      >
                        View Profile
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-[#a98cc8]" />
                        <span className="font-medium text-gray-800">Notifications</span>
                      </div>
                      <Switch id="notifications" />
                    </div>
                    <p className="text-sm text-gray-600">Receive appointment reminders and important updates</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
              <Tabs defaultValue="basic-info" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-[#f9f4ff]">
                  <TabsTrigger
                    value="basic-info"
                    className="data-[state=active]:bg-[#a98cc8] data-[state=active]:text-white"
                  >
                    Basic Info
                  </TabsTrigger>
                  <TabsTrigger
                    value="account"
                    className="data-[state=active]:bg-[#a98cc8] data-[state=active]:text-white"
                  >
                    Account
                  </TabsTrigger>
                  <TabsTrigger
                    value="subscription"
                    className="data-[state=active]:bg-[#a98cc8] data-[state=active]:text-white"
                  >
                    Subscription
                  </TabsTrigger>
                  <TabsTrigger
                    value="preferences"
                    className="data-[state=active]:bg-[#a98cc8] data-[state=active]:text-white"
                  >
                    Preferences
                  </TabsTrigger>
                </TabsList>

                {/* Basic Info Tab */}
                <TabsContent value="basic-info">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Manage your personal details</CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        className="text-[#a98cc8] hover:bg-[#fef6f9] hover:text-[#a98cc8]"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        {isEditing ? "Cancel" : "Edit"}
                      </Button>
                    </CardHeader>
                    <CardContent>{isEditing ? <BasicInfoEditForm /> : <BasicInfoDisplay />}</CardContent>
                  </Card>
                </TabsContent>

                {/* Account Settings Tab */}
                <TabsContent value="account">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>Manage your account security and preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-800">Change Password</h3>
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input id="current-password" type="password" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input id="new-password" type="password" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input id="confirm-password" type="password" />
                          </div>
                          <Button className="w-fit bg-[#a98cc8] hover:bg-[#9678b4] text-white">Update Password</Button>
                        </div>
                      </div>

                      <div className="space-y-4 pt-6 border-t">
                        <h3 className="text-lg font-medium text-gray-800 flex items-center text-red-600">
                          <Trash2 className="mr-2 h-5 w-5" />
                          Delete Account
                        </h3>
                        <p className="text-gray-600">
                          Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Subscription Tab */}
                <TabsContent value="subscription">
                  <Card>
                    <CardHeader>
                      <CardTitle>Subscription Details</CardTitle>
                      <CardDescription>Manage your therapy subscription</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="rounded-lg bg-[#f9f4ff] p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-800">Monthly: 8 Sessions</h3>
                            <p className="text-sm text-gray-600">Active</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Next billing date</p>
                            <p className="font-medium text-gray-800">May 15, 2023</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-800">Payment Method</h3>
                        <div className="flex items-center gap-4 rounded-lg border p-4">
                          <CreditCard className="h-8 w-8 text-[#a98cc8]" />
                          <div>
                            <p className="font-medium text-gray-800">Visa ending in 4242</p>
                            <p className="text-sm text-gray-600">Expires 12/25</p>
                          </div>
                        </div>
                        <Button variant="outline" className="border-[#a98cc8] text-[#a98cc8] hover:bg-[#fef6f9]">
                          Update Payment Method
                        </Button>
                      </div>

                      <div className="space-y-4 pt-6 border-t">
                        <h3 className="text-lg font-medium text-gray-800">Subscription Management</h3>
                        <div className="flex flex-wrap gap-4">
                          <Button variant="outline" className="border-[#a98cc8] text-[#a98cc8] hover:bg-[#fef6f9]">
                            Pause Subscription
                          </Button>
                          <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
                            Cancel Subscription
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>My Sessions</CardTitle>
                      <CardDescription>View your past and upcoming therapy sessions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                          <div className="flex items-center gap-4">
                            <div className="rounded-full bg-[#a98cc8]/20 p-3">
                              <Clock className="h-5 w-5 text-[#a98cc8]" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">Session with Dr. Sarah Johnson</p>
                              <p className="text-sm text-gray-600">April 10, 2023 • 2:00 PM</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-800">Session 5 of 8</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-4">
                          <div className="flex items-center gap-4">
                            <div className="rounded-full bg-[#a98cc8]/20 p-3">
                              <Clock className="h-5 w-5 text-[#a98cc8]" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">Session with Dr. Sarah Johnson</p>
                              <p className="text-sm text-gray-600">April 3, 2023 • 2:00 PM</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-800">Session 4 of 8</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-4">
                          <div className="flex items-center gap-4">
                            <div className="rounded-full bg-[#a98cc8]/20 p-3">
                              <Clock className="h-5 w-5 text-[#a98cc8]" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">Session with Dr. Sarah Johnson</p>
                              <p className="text-sm text-gray-600">March 27, 2023 • 2:00 PM</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-800">Session 3 of 8</p>
                          </div>
                        </div>

                        <Button className="w-full bg-[#a98cc8] hover:bg-[#9678b4] text-white">View All Sessions</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Preferences Tab */}
                <TabsContent value="preferences">
                  <Card>
                    <CardHeader>
                      <CardTitle>Counseling Preferences</CardTitle>
                      <CardDescription>Customize your therapy experience</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="language">Preferred Language</Label>
                          <Select defaultValue="english">
                            <SelectTrigger id="language">
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="english">English</SelectItem>
                              <SelectItem value="spanish">Spanish</SelectItem>
                              <SelectItem value="french">French</SelectItem>
                              <SelectItem value="mandarin">Mandarin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="therapist-gender">Preferred Therapist Gender</Label>
                          <Select defaultValue="no-preference">
                            <SelectTrigger id="therapist-gender">
                              <SelectValue placeholder="Select preference" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="no-preference">No Preference</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="non-binary">Non-binary</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="goals">Therapy Goals or Focus Areas</Label>
                        <Textarea
                          id="goals"
                          placeholder="Describe your therapy goals or areas you'd like to focus on..."
                          className="min-h-[120px]"
                        />
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-800">Areas of Interest</h3>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "Anxiety",
                            "Depression",
                            "Stress Management",
                            "Grief",
                            "Relationships",
                            "Self-esteem",
                            "Trauma",
                            "Life Transitions",
                          ].map((area) => (
                            <div
                              key={area}
                              className="rounded-full bg-[#f9f4ff] px-4 py-2 text-sm font-medium text-[#a98cc8]"
                            >
                              {area}
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button className="bg-[#a98cc8] hover:bg-[#9678b4] text-white">Save Preferences</Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function ProfileNavCard() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-[#f9f4ff] p-6 flex flex-col items-center">
          <Avatar className="h-20 w-20 border-4 border-white">
            <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Profile picture" />
            <AvatarFallback className="bg-[#a98cc8] text-white text-xl">JD</AvatarFallback>
          </Avatar>
          <h2 className="mt-4 text-xl font-medium text-gray-800">Jane Doe</h2>
          <p className="text-sm text-gray-600">jane.doe@example.com</p>
        </div>
        <div className="p-0">
          <nav className="grid">
            {/* <Link href="/profile" className="flex items-center gap-3 border-b p-4 hover:bg-[#fef6f9]">
              <User className="h-5 w-5 text-[#a98cc8]" />
              <span className="font-medium text-gray-800">Basic Info</span>
            </Link> */}
            {/* <Link href="/profile/account" className="flex items-center gap-3 border-b p-4 hover:bg-[#fef6f9]">
              <Settings className="h-5 w-5 text-[#a98cc8]" />
              <span className="font-medium text-gray-800">Account Settings</span>
            </Link>
            <Link href="/profile/subscription" className="flex items-center gap-3 border-b p-4 hover:bg-[#fef6f9]">
              <CreditCard className="h-5 w-5 text-[#a98cc8]" />
              <span className="font-medium text-gray-800">Subscription</span>
            </Link>
            <Link href="/profile/sessions" className="flex items-center gap-3 border-b p-4 hover:bg-[#fef6f9]">
              <Calendar className="h-5 w-5 text-[#a98cc8]" />
              <span className="font-medium text-gray-800">My Sessions</span>
            </Link>
            <Link href="/profile/preferences" className="flex items-center gap-3 p-4 hover:bg-[#fef6f9]">
              <Heart className="h-5 w-5 text-[#a98cc8]" />
              <span className="font-medium text-gray-800">Preferences</span>
            </Link> */}
          </nav>
        </div>
      </CardContent>
    </Card>
  )
}

function BasicInfoDisplay() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Profile picture" />
          <AvatarFallback className="bg-[#a98cc8] text-white text-xl">JD</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm text-gray-600">Profile Picture</p>
          <p className="text-sm text-gray-500">Upload a photo to personalize your account</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-gray-500">Full Name</p>
          <p className="text-gray-800">Jane Doe</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">Email</p>
          <p className="text-gray-800">jane.doe@example.com</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">Phone Number</p>
          <p className="text-gray-800">(555) 123-4567</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">Gender</p>
          <p className="text-gray-800">Female</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">Date of Birth</p>
          <p className="text-gray-800">January 15, 1985</p>
        </div>
      </div>
    </div>
  )
}

function BasicInfoEditForm() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Profile picture" />
          <AvatarFallback className="bg-[#a98cc8] text-white text-xl">JD</AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Profile Picture</p>
          <Button variant="outline" size="sm" className="border-[#a98cc8] text-[#a98cc8] hover:bg-[#fef6f9]">
            Upload New
          </Button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="full-name">Full Name</Label>
          <Input id="full-name" defaultValue="Jane Doe" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" defaultValue="jane.doe@example.com" disabled />
          <p className="text-xs text-gray-500">Email cannot be changed</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" defaultValue="(555) 123-4567" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select defaultValue="female">
            <SelectTrigger id="gender">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="non-binary">Non-binary</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input id="dob" type="date" defaultValue="1985-01-15" />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" className="border-gray-300">
          Cancel
        </Button>
        <Button className="bg-[#a98cc8] hover:bg-[#9678b4] text-white">Save Changes</Button>
      </div>
    </div>
  )
}
