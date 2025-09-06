import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Edit, Trash2 } from "lucide-react"
import Navbar from "@/components/navbar"
import { createSupabaseServerClient } from "@/lib/supabaseServer"
import ProfileClient from "./profile-client"

interface UserData {
  uid: string
  name: string
  email: string
  phone: string
  is_active: boolean
  created_at: string
}

export default async function ProfilePage() {
  const supabase = createSupabaseServerClient()

  // Get user session from server
  const {
    data: { user },
    error
  } = await supabase.auth.getUser()

  if (error || !user) {
    return <div>Unable to fetch user session</div>
  }

  // Fetch user data using the API (no auth header needed)
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/users/${user.id}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    return <div>Failed to load user data</div>
  }

  const { data: userData } = await res.json()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-10 bg-gradient-to-b from-[#fef6f9]/50 to-white">
        <div className="container max-w-6xl">
          <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
            <ProfileClient userData={userData} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}