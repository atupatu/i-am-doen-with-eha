import { Suspense } from "react"
import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Filter, UserPlus } from "lucide-react"
import { Input } from "@/components/ui/input"
import ClientsList from "@/components/therapist/clients-list"
import { createSupabaseServerClient } from "@/lib/supabaseServer"

export const metadata: Metadata = {
  title: "Clients - Therapist Portal",
  description: "Manage your client relationships",
}

export default async function TherapistClientsPage() {
  const supabase = createSupabaseServerClient();

  // Get user session from server
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user?.email) {
    console.error("Error getting user:", error)
    return <div>Unable to fetch user session</div>
  }

  // Fetch clients using the email
  const res = await fetch(`http://localhost:3000/api/uniClients?email=${user.email}`, {
    cache: "no-store",
  });
  console.log("Fetch clients response:", res);

  if (!res.ok) {
    return <div>Failed to load clients</div>
  }

  const { clients } = await res.json();
  console.log("Active clients:", clients);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Clients</h1>
        <p className="text-gray-600">Manage your client relationships and information</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Search clients..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button size="sm" className="bg-[#a98cc8] hover:bg-[#9678b4] flex items-center gap-1">
            <UserPlus className="h-4 w-4" />
            Add Client
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
          <CardDescription>View and manage your active clients</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
            <ClientsList clients={clients} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
