"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateAccountSettings } from "@/lib/therapist-actions"

interface AccountSettingsProps {
  settings: {
    twoFactorEnabled: boolean
    lastPasswordChange: string
    loginNotifications: boolean
    sessionTimeout: number
  }
}

export default function AccountSettings({ settings }: AccountSettingsProps) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(settings.twoFactorEnabled)
  const [loginNotifications, setLoginNotifications] = useState(settings.loginNotifications)
  const [sessionTimeout, setSessionTimeout] = useState(settings.sessionTimeout.toString())
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setPasswordError("")

    // Validate passwords if the user is trying to change them
    if (newPassword || confirmPassword) {
      if (!currentPassword) {
        setPasswordError("Current password is required to set a new password")
        setIsSubmitting(false)
        return
      }

      if (newPassword !== confirmPassword) {
        setPasswordError("New passwords do not match")
        setIsSubmitting(false)
        return
      }

      if (newPassword.length < 8) {
        setPasswordError("New password must be at least 8 characters long")
        setIsSubmitting(false)
        return
      }
    }

    try {
      await updateAccountSettings({
        twoFactorEnabled,
        loginNotifications,
        sessionTimeout: Number.parseInt(sessionTimeout),
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      })

      // Reset password fields
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

      alert("Account settings updated successfully!")
    } catch (error) {
      console.error("Error updating account settings:", error)
      alert("Failed to update account settings. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Security Settings</h3>

        <div className="flex items-center justify-between py-3 border-b">
          <div>
            <h4 className="font-medium">Two-Factor Authentication</h4>
            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
          </div>
          <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
        </div>

        <div className="flex items-center justify-between py-3 border-b">
          <div>
            <h4 className="font-medium">Login Notifications</h4>
            <p className="text-sm text-gray-500">Receive notifications for new login attempts</p>
          </div>
          <Switch checked={loginNotifications} onCheckedChange={setLoginNotifications} />
        </div>

        <div className="flex items-center justify-between py-3 border-b">
          <div>
            <h4 className="font-medium">Session Timeout</h4>
            <p className="text-sm text-gray-500">Automatically log out after inactivity</p>
          </div>
          <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select timeout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
              <SelectItem value="120">2 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="py-3">
          <div>
            <h4 className="font-medium">Last Password Change</h4>
            <p className="text-sm text-gray-500">{new Date(settings.lastPasswordChange).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Change Password</h3>
        {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}

        <div className="space-y-2">
          <Label htmlFor="current-password">Current Password</Label>
          <Input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-password">New Password</Label>
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm New Password</Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="rounded-xl"
          />
        </div>
      </div>

      <Button type="submit" className="bg-[#a98cc8] hover:bg-[#9678b4]" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}
