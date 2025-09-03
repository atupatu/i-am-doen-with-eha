"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Edit, Trash2 } from "lucide-react"

interface UserData {
  uid: string
  name: string
  email: string
  phone: string
  is_active: boolean
  created_at: string
}

export default function ProfileClient({ userData }: { userData: UserData }) {
  const [isEditing, setIsEditing] = useState(false)
  const [user, setUser] = useState<UserData>(userData)

  const handleUpdateUser = async (formData: FormData) => {
    try {
      const updateData = {
        name: formData.get('name') as string,
        phone: formData.get('phone') as string,
      }

      const response = await fetch(`/api/users/${user.uid}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        throw new Error('Failed to update user')
      }

      const result = await response.json()
      setUser(result.data)
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating user:", error)
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-[240px_1fr]">
      {/* Sidebar Navigation */}
      <div className="space-y-4">
        <ProfileNavCard userData={user} />
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        <Tabs defaultValue="basic-info" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#f9f4ff]">
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
              <CardContent>
                {isEditing ? 
                  <BasicInfoEditForm userData={user} onSubmit={handleUpdateUser} /> : 
                  <BasicInfoDisplay userData={user} />
                }
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Settings Tab */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4 pt-6 border-t">
                  <h3 className="text-lg font-medium text-gray-800 flex items-center text-red-600">
                    <Trash2 className="mr-2 h-5 w-5" />
                    Deactivate Account
                  </h3>
                  <p className="text-gray-600">
                    Once you deactivate your account, you can reactivate it by logging in again.
                  </p>
                  <Button variant="destructive">Deactivate Account</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// ... (ProfileNavCard, BasicInfoDisplay, and BasicInfoEditForm remain the same)

function ProfileNavCard({ userData }: { userData: UserData }) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-[#f9f4ff] p-6 flex flex-col items-center">
            <Avatar className="h-20 w-20 border-4 border-white">
              <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Profile picture" />
              <AvatarFallback className="bg-[#a98cc8] text-white text-xl">
                {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <h2 className="mt-4 text-xl font-medium text-gray-800">{userData.name || 'User'}</h2>
            <p className="text-sm text-gray-600">{userData.email}</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  function BasicInfoDisplay({ userData }: { userData: UserData }) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Profile picture" />
            <AvatarFallback className="bg-[#a98cc8] text-white text-xl">
              {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm text-gray-600">Profile Picture</p>
            <p className="text-sm text-gray-500">Upload a photo to personalize your account</p>
          </div>
        </div>
  
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-gray-500">Full Name</p>
            <p className="text-gray-800">{userData.name || 'Not provided'}</p>
          </div>
  
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-gray-800">{userData.email}</p>
          </div>
          <div>
          <p className="text-sm font-medium text-gray-500">Phone Number</p>
          <p className="text-gray-800">{userData.phone || 'Not provided'}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">Account Status</p>
          <p className="text-gray-800">{userData.is_active ? 'Active' : 'Inactive'}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">Member Since</p>
          <p className="text-gray-800">{new Date(userData.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}
function BasicInfoEditForm({ userData, onSubmit }: { userData: UserData, onSubmit: (formData: FormData) => void }) {
    return (
      <form action={onSubmit} className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Profile picture" />
            <AvatarFallback className="bg-[#a98cc8] text-white text-xl">
              {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
            </AvatarFallback>
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
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              name="name" 
              defaultValue={userData.name || ''} 
              placeholder="Enter your full name"
            />
          </div>
  
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              defaultValue={userData.email} 
              disabled 
            />
            <p className="text-xs text-gray-500">Email cannot be changed</p>
          </div>
  
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              name="phone" 
              defaultValue={userData.phone || ''} 
              placeholder="Enter your phone number"
            />
          </div>
        </div>

          <div className="flex justify-end gap-4">
        <Button 
          type="button" 
          variant="outline" 
          className="border-gray-300"
          onClick={() => window.location.reload()}
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-[#a98cc8] hover:bg-[#9678b4] text-white">
          Save Changes
        </Button>
      </div>
    </form>
  )
}
  