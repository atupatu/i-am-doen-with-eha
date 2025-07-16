import Link from "next/link"
import { CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar";
import SiteFooter from "@/components/site-footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Callback Requested - MindfulCare",
  description: "Your callback request has been received",
}

export default function CallbackConfirmationPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-[#fef6f9]/30 py-12 flex items-center justify-center">
        <div className="container max-w-md">
          <div className="bg-white p-8 rounded-3xl shadow-lg text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Callback Request Received</h1>
            <p className="text-gray-600 mb-6">
              Thank you for requesting a callback. One of our counselors will contact you within 24 hours at the phone
              number you provided.
            </p>
            <div className="space-y-4">
              <Link href="/dashboard">
                <Button className="w-full bg-[#a98cc8] hover:bg-[#9678b4] text-white rounded-xl py-6">
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/">
                <Button
                  variant="outline"
                  className="w-full border-[#a98cc8] text-[#a98cc8] hover:bg-[#fef6f9] rounded-xl py-6"
                >
                  Return to Home <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
