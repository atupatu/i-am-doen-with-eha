import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from "next/navigation"
import Navbar from "@/components/navbar"
import SiteFooter from "@/components/site-footer"
import AuthForm from "@/components/auth-form"
import { Suspense } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Account - Echoing Healthy Aging",
  description: "Sign in to your Echoing Healthy Aging account or create a new account",
}

export default async function AccountPage() {
  const cookieStore =  cookies()
const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    // 🔑 Get user role from Supabase
    const { data: roleData, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single()

    if (!error && roleData) {
      const role = roleData.role
      console.log("User role:", role);

      // ✅ Redirect based on role
      if (role === "client") {
        redirect("/client")
      } else if (role === "therapist") {
        redirect("/therapist")
      } else if (role === "admin") {
        redirect("/admin")
      }
    }

    // If no role found, fallback
    redirect("/")
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
