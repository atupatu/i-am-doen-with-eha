// components/client/profile-client.tsx
"use client"

import { useState } from "react"
import { Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface User {
  uid: string;
  name: string;
  email: string;
  phone: string;
  assigned_tid: string | null;
  created_at: string;
  is_active: boolean;
  call_request_status: string;
}

interface Therapist {
  tid: string;
  name: string;
  email: string;
}

interface ProfileData {
  user: User;
  therapist: Therapist | null;
}

interface ProfileClientProps {
  profileData: ProfileData;
}

export default function ProfileClient({ profileData }: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editFormData, setEditFormData] = useState({
    name: profileData.user.name || '',
    phone: profileData.user.phone || ''
  })
  const [user, setUser] = useState(profileData.user)

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`/api/user?uid=${user.uid}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData)
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const { user: updatedUser } = await response.json()
      setUser(updatedUser)
      setIsEditing(false)
    } catch (err) {
      console.error('Error updating profile:', err)
    }
  }

  const getInitials = (name: string) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div></div>
        <Button
          variant="ghost"
          className="text-[#a98cc8] hover:bg-[#fef6f9] hover:text-[#a98cc8]"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit className="mr-2 h-4 w-4" />
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>

      {isEditing ? (
        <BasicInfoEditForm 
          formData={editFormData}
          setFormData={setEditFormData}
          user={user}
          onSave={handleSaveChanges}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <BasicInfoDisplay user={user} />
      )}
    </div>
  )
}

function BasicInfoDisplay({ user }: { user: User }) {
  const getInitials = (name: string) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Profile picture" />
          <AvatarFallback className="bg-[#a98cc8] text-white text-xl">
            {getInitials(user.name)}
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
          <p className="text-gray-800">{user.name || 'Not provided'}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">Email</p>
          <p className="text-gray-800">{user.email}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">Phone Number</p>
          <p className="text-gray-800">{user.phone || 'Not provided'}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">Account Status</p>
          <p className="text-gray-800">{user.is_active ? 'Active' : 'Inactive'}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">Member Since</p>
          <p className="text-gray-800">{new Date(user.created_at).toLocaleDateString()}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">Call Request Status</p>
          <p className="text-gray-800 capitalize">{user.call_request_status}</p>
        </div>
      </div>
    </div>
  )
}

interface BasicInfoEditFormProps {
  formData: { name: string; phone: string };
  setFormData: (data: { name: string; phone: string }) => void;
  user: User;
  onSave: () => void;
  onCancel: () => void;
}

function BasicInfoEditForm({ formData, setFormData, user, onSave, onCancel }: BasicInfoEditFormProps) {
  const getInitials = (name: string) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Profile picture" />
          <AvatarFallback className="bg-[#a98cc8] text-white text-xl">
            {getInitials(formData.name || user.name)}
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
          <Label htmlFor="full-name">Full Name</Label>
          <Input 
            id="full-name" 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={user.email} disabled />
          <p className="text-xs text-gray-500">Email cannot be changed</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input 
            id="phone" 
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" className="border-gray-300" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="bg-[#a98cc8] hover:bg-[#9678b4] text-white" onClick={onSave}>
          Save Changes
        </Button>
      </div>
    </div>
  )
}