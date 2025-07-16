/*import Link from "next/link"
import { Heart } from "lucide-react"
import SignInForm from "@/components/sign-in-form"

export default function SignInPage() {
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
          <SignInForm />
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


'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'

export default function SignUpForm() {
  const [step, setStep] = useState<'login' | 'signup' | 'counselling'>('login')

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Card>
        <CardContent className="p-6 space-y-6">
          {step === 'login' && (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                // add your sign in logic here
                console.log('Sign in successful')
              }}
            >
              <h1 className="text-2xl font-bold">Sign In</h1>
              <Input placeholder="Username" required />
              <Input placeholder="Password" type="password" required />
              <Button className="w-full" type="submit">Sign In</Button>
              <p className="text-sm text-center">
                First time user?{' '}
                  <button
                    type="button"
                    onClick={() => setStep('signup')}
                    className="text-purple-600 hover:underline"
                  >
                    Create an account
                  </button>
              </p>
            </form>
          )}

          {step === "signup" && (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      // Add password confirmation logic here if needed
      setStep("counselling");
    }}
    className="flex flex-col items-center gap-4"
  >
    <h2 className="text-2xl font-bold text-indigo-600 mb-4">Sign Up</h2>

    <input
      type="text"
      placeholder="Full Name"
      className="w-full max-w-xs px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      required
    />
    <input
      type="email"
      placeholder="Email"
      className="w-full max-w-xs px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      required
    />
    <input
      type="password"
      placeholder="Password"
      className="w-full max-w-xs px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      required
    />
    <input
      type="password"
      placeholder="Confirm Password"
      className="w-full max-w-xs px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      required
    />
    <button
      type="submit"
      className="mt-2 px-6 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none"
    >
      Sign Up
    </button>
    <p
      className="text-sm text-indigo-600 cursor-pointer"
      onClick={() => setStep("signin")}
    >
      Already have an account? Sign in
    </p>
  </form>
)}



          {step === 'counselling' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Request for Counselling</h1>
              <div className="space-y-3">
                <p>Choose how you want to proceed:</p>
                <Button variant="outline">Request a Call from MindfulCare</Button>
                <p className="text-center">or</p>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Name of the Senior Citizen *" required />
                  <Input placeholder="How would you like us to address him/her as?" />
                  <Input placeholder="Diagnosis (e.g., MCI, Depression, Dementia - stage if any)" />
                  <Input placeholder="Preferred Time Slots for Session (min 2)" />
                  <Textarea placeholder="Address for sessions" className="md:col-span-2" />
                  <Input placeholder="Language Preference" />
                  <Input placeholder="Date of Birth or Approx. Year" />
                  <Input placeholder="Place of Birth" />
                  <Textarea placeholder="Family members: Parents, siblings, relationship" className="md:col-span-2" />
                  <Textarea placeholder="Parents' Occupations" className="md:col-span-2" />
                  <Textarea placeholder="Places lived till date" className="md:col-span-2" />
                  <Input placeholder="School attended" />
                  <Input placeholder="Favourite subject" />
                  <Textarea placeholder="Family pets (names, duration)" className="md:col-span-2" />
                  <Textarea placeholder="Education history, college, more info" className="md:col-span-2" />
                  <Textarea placeholder="Work history, roles, special training" className="md:col-span-2" />
                  <Textarea placeholder="Special work memories, major historical events" className="md:col-span-2" />
                  <Textarea placeholder="Spouse details: Name, meeting, marriage info" className="md:col-span-2" />
                  <Textarea placeholder="Life post marriage, children, grandchildren info" className="md:col-span-2" />
                  <Textarea placeholder="Special friends and their info" className="md:col-span-2" />
                  <Textarea placeholder="Retirement, hobbies, major life changes" className="md:col-span-2" />
                  <Textarea placeholder="Current likes/dislikes, favourite color/music/food" className="md:col-span-2" />
                  <Textarea placeholder="Current daily routine (waking to sleeping)" className="md:col-span-2" />
                  <Input placeholder="Name of Family Member/Carer" />
                  <Input placeholder="Contact Number for Communication" />
                  <Input placeholder="Email Address for Invoice *" />
                  <Input placeholder="Contact Number for Invoice Payer *" />
                  <Textarea placeholder="Billing Address" className="md:col-span-2" />
                  <Button className="w-full col-span-1 md:col-span-2">Submit Counselling Details</Button>
                </form>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { HeartIcon } from 'lucide-react'

export default function SignUpForm() {
  const [step, setStep] = useState<'login' | 'signup' | 'counselling'>('login')

  return (
    <div className="min-h-screen flex flex-col">
      {}
      <header className="flex items-center justify-between px-6 py-4 border-b shadow-sm">
        <div className="flex items-center space-x-2">
          <HeartIcon className="text-purple-600" />
          <span className="text-xl font-semibold text-purple-700">MindfulCare</span>
        </div>
      </header>

      {}
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <Card>
            <CardContent className="p-6 space-y-6">
              {step === 'login' && (
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold">Sign In</h1>
                  <Input placeholder="Username" />
                  <Input placeholder="Password" type="password" />
                  <Button className="w-full">Sign In</Button>
                  <p className="text-sm text-center">
                    First time user?{' '}
                    <button
                      onClick={() => setStep('signup')}
                      className="text-purple-600 hover:underline"
                    >
                      Create an account
                    </button>
                  </p>
                </div>
              )}

              {step === 'signup' && (
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold">Create Account</h1>
                  <Input placeholder="Create Username" />
                  <Input placeholder="Create Password" type="password" />
                  <Button className="w-full" onClick={() => setStep('counselling')}>
                    Sign Up
                  </Button>
                </div>
              )}

              {step === 'counselling' && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold">Request for Counselling</h1>
                  <div className="space-y-3">
                    <p>Choose how you want to proceed:</p>
                    <Button variant="outline">Request a Call from MindfulCare</Button>
                    <p className="text-center">or</p>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input placeholder="Name of the Senior Citizen *" required />
                      <Input placeholder="How would you like us to address him/her as?" />
                      <Input placeholder="Diagnosis (e.g., MCI, Depression, Dementia - stage if any)" />
                      <Input placeholder="Preferred Time Slots for Session (min 2)" />
                      <Textarea placeholder="Address for sessions" className="md:col-span-2" />
                      <Input placeholder="Language Preference" />
                      <Input placeholder="Date of Birth or Approx. Year" />
                      <Input placeholder="Place of Birth" />
                      <Textarea placeholder="Family members: Parents, siblings, relationship" className="md:col-span-2" />
                      <Textarea placeholder="Parents' Occupations" className="md:col-span-2" />
                      <Textarea placeholder="Places lived till date" className="md:col-span-2" />
                      <Input placeholder="School attended" />
                      <Input placeholder="Favourite subject" />
                      <Textarea placeholder="Family pets (names, duration)" className="md:col-span-2" />
                      <Textarea placeholder="Education history, college, more info" className="md:col-span-2" />
                      <Textarea placeholder="Work history, roles, special training" className="md:col-span-2" />
                      <Textarea placeholder="Special work memories, major historical events" className="md:col-span-2" />
                      <Textarea placeholder="Spouse details: Name, meeting, marriage info" className="md:col-span-2" />
                      <Textarea placeholder="Life post marriage, children, grandchildren info" className="md:col-span-2" />
                      <Textarea placeholder="Special friends and their info" className="md:col-span-2" />
                      <Textarea placeholder="Retirement, hobbies, major life changes" className="md:col-span-2" />
                      <Textarea placeholder="Current likes/dislikes, favourite color/music/food" className="md:col-span-2" />
                      <Textarea placeholder="Current daily routine (waking to sleeping)" className="md:col-span-2" />
                      <Input placeholder="Name of Family Member/Carer" />
                      <Input placeholder="Contact Number for Communication" />
                      <Input placeholder="Email Address for Invoice *" />
                      <Input placeholder="Contact Number for Invoice Payer *" />
                      <Textarea placeholder="Billing Address" className="md:col-span-2" />
                      <Button className="w-full col-span-1 md:col-span-2">Submit Counselling Details</Button>
                    </form>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {}
      <footer className="text-center text-sm text-gray-500 py-6 border-t">
        © 2025 MindfulCare. All rights reserved.
      </footer>
    </div>
  )
}
*/

import Link from "next/link"
import { Heart } from "lucide-react"
import SignInForm from "@/components/sign-in-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In - MindfulCare",
  description: "Sign in to your MindfulCare account to manage your therapy sessions",
}

export default function SignInPage() {
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
          <SignInForm />
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
