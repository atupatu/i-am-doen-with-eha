/*import { Suspense } from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Navbar from "@/components/navbar";
import SiteFooter from "@/components/site-footer"
import AuthForm from "@/components/auth-form"

export const metadata: Metadata = {
  title: "Account - MindfulCare",
  description: "Sign in to your MindfulCare account or create a new account",
}

// This would normally check if the user is already authenticated
// and redirect them to their dashboard if they are
const checkAuth = () => {
  // Simulating no authentication for this example
  return { isAuthenticated: false }
}

export default function AccountPage() {
  const { isAuthenticated } = checkAuth()

  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-[#fef6f9]/30 py-12">
        <div className="container max-w-md mx-auto">
          <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading...</div>}>
            <AuthForm />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
*/
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from "next/navigation"
import Navbar from "@/components/navbar"
import SiteFooter from "@/components/site-footer"
import AuthForm from "@/components/auth-form"
import { Suspense } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Account - MindfulCare",
  description: "Sign in to your MindfulCare account or create a new account",
}

export default async function AccountPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-[#fef6f9]/30 py-12">
        <div className="container max-w-md mx-auto">
          <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading...</div>}>
            <AuthForm />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
