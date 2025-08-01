import type React from "react"
import { Suspense } from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import TherapistSidebar from "@/components/therapist/therapist-sidebar"
import TherapistHeader from "@/components/therapist/therapist-header"
import { checkTherapistAuth } from "@/lib/auth-utils"

export const metadata: Metadata = {
  title: "Therapist Portal - Echoing Healthy Aging",
  description: "Manage your sessions, clients, and schedule",
}

export default async function TherapistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // In a real app, this would check server-side session
  // For demo purposes, we'll use a mock function
  const isAuthenticated = await checkTherapistAuth()

  if (!isAuthenticated) {
    redirect("/therapist/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <TherapistSidebar />
      <div className="flex-1 flex flex-col">
        <TherapistHeader />
        <main className="flex-1 p-6 overflow-auto">
          <Suspense fallback={<div className="h-full flex items-center justify-center">Loading...</div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  )
}
