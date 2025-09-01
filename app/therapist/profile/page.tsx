//app/therapist/profile/page.tsx
import { Suspense } from "react"
import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"
import ProfileForm from "@/components/therapist/profile-form"
import { createSupabaseServerClient } from "@/lib/supabaseServer"

export const metadata: Metadata = {
  title: "Profile - Therapist Portal",
  description: "Manage your profile and account settings",
}

export default async function TherapistProfilePage() {
  const supabase = createSupabaseServerClient();
  
  // Get user session from server
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user?.id) {
    console.error("Error getting user:", error)
    return <div>Unable to fetch user session</div>
  }

  // First, get the therapist's tid using the user_id
  const { data: therapistRecord, error: therapistError } = await supabase
    .from('therapists')
    .select('tid')
    .eq('user_id', user.id)
    .single();

  if (therapistError || !therapistRecord) {
    console.error("Error getting therapist record:", therapistError)
    return <div>Therapist profile not found</div>
  }

  // Now fetch therapist profile using the actual tid
  const res = await fetch(`http://localhost:3000/api/therapists/${therapistRecord.tid}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <div>Failed to load therapist profile</div>
  }

  const { therapist } = await res.json();
  console.log("Therapist profile:", therapist);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Profile</h1>
        <p className="text-gray-600">Manage your profile and account settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal and professional information</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
            <ProfileForm profile={therapist} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}