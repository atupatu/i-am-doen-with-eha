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
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  // CHANGE: This block is now active.
  // If a user is already logged in, they will be redirected away from this page.
  if (session) {
    redirect("/client/schedule")
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