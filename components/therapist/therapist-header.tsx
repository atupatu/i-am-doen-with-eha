"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, User, Settings, LogOut } from "lucide-react"
import { updateTherapistStatus } from "@/lib/therapist-actions"

export default function TherapistHeader() {
  const [isOnline, setIsOnline] = useState(true)

  const handleStatusChange = async (checked: boolean) => {
    setIsOnline(checked)
    await updateTherapistStatus(checked)
  }

  return (
    <header className="border-b bg-white py-3 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="online-mode" className="text-sm font-medium">
            Status:
          </Label>
          <div className="flex items-center gap-2">
            <Switch id="online-mode" checked={isOnline} onCheckedChange={handleStatusChange} />
            <span className={`text-sm font-medium ${isOnline ? "text-green-600" : "text-gray-500"}`}>
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Dr. Emma Wilson" />
                <AvatarFallback>EW</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-medium">Dr. Emma Wilson</p>
                <p className="text-xs text-gray-500">Therapist</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
