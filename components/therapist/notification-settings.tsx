"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { updateNotificationSettings } from "@/lib/therapist-actions"

interface NotificationSettingsProps {
  settings: {
    email: {
      newAppointments: boolean
      appointmentReminders: boolean
      appointmentChanges: boolean
      newClients: boolean
      reportReminders: boolean
    }
    sms: {
      newAppointments: boolean
      appointmentReminders: boolean
      appointmentChanges: boolean
      newClients: boolean
      reportReminders: boolean
    }
    inApp: {
      newAppointments: boolean
      appointmentReminders: boolean
      appointmentChanges: boolean
      newClients: boolean
      reportReminders: boolean
    }
  }
}

export default function NotificationSettings({ settings }: NotificationSettingsProps) {
  const [notificationSettings, setNotificationSettings] = useState(settings)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleToggle = (channel: keyof typeof settings, setting: string, checked: boolean) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [setting]: checked,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await updateNotificationSettings(notificationSettings)
      alert("Notification settings updated successfully!")
    } catch (error) {
      console.error("Error updating notification settings:", error)
      alert("Failed to update notification settings. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const notificationTypes = [
    { id: "newAppointments", label: "New Appointment Requests" },
    { id: "appointmentReminders", label: "Appointment Reminders" },
    { id: "appointmentChanges", label: "Appointment Changes" },
    { id: "newClients", label: "New Client Registrations" },
    { id: "reportReminders", label: "Report Due Reminders" },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-4 pb-4 border-b">
          <div></div>
          <div className="text-center text-sm font-medium">Email</div>
          <div className="text-center text-sm font-medium">SMS</div>
          <div className="text-center text-sm font-medium">In-App</div>
        </div>

        {notificationTypes.map((type) => (
          <div key={type.id} className="grid grid-cols-4 gap-4 items-center">
            <Label htmlFor={`email-${type.id}`} className="text-sm">
              {type.label}
            </Label>
            <div className="flex justify-center">
              <Switch
                id={`email-${type.id}`}
                checked={notificationSettings.email[type.id as keyof typeof notificationSettings.email]}
                onCheckedChange={(checked) => handleToggle("email", type.id, checked)}
              />
            </div>
            <div className="flex justify-center">
              <Switch
                id={`sms-${type.id}`}
                checked={notificationSettings.sms[type.id as keyof typeof notificationSettings.sms]}
                onCheckedChange={(checked) => handleToggle("sms", type.id, checked)}
              />
            </div>
            <div className="flex justify-center">
              <Switch
                id={`inApp-${type.id}`}
                checked={notificationSettings.inApp[type.id as keyof typeof notificationSettings.inApp]}
                onCheckedChange={(checked) => handleToggle("inApp", type.id, checked)}
              />
            </div>
          </div>
        ))}
      </div>

      <Button type="submit" className="bg-[#a98cc8] hover:bg-[#9678b4]" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Preferences"}
      </Button>
    </form>
  )
}
