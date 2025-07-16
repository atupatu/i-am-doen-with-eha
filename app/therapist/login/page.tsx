import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Heart } from "lucide-react"
import TherapistLoginForm from "@/components/therapist/therapist-login-form"

export const metadata: Metadata = {
  title: "Therapist Login - MindfulCare",
  description: "Sign in to your therapist account",
}

export default function TherapistLoginPage() {
  return (
    <div className="min-h-screen bg-[#fef6f9]/50 flex flex-col">
      <header className="w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-[#a98cc8]" />
            <span className="text-xl font-semibold text-[#a98cc8]">MindfulCare</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container max-w-md">
          <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading...</div>}>
            <TherapistLoginForm />
          </Suspense>
        </div>
      </main>
      <footer className="py-6 border-t bg-white/80">
        <div className="container text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} MindfulCare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
