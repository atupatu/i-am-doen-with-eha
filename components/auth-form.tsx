/*"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useFormState } from "react-dom"
import { signIn, signUp } from "@/lib/actions"

const initialSignInState = { error: null, success: false }
const initialSignUpState = { error: null, success: false }

export default function AuthForm() {
  const [signInState, signInAction] = useFormState(signIn, initialSignInState)
  const [signUpState, signUpAction] = useFormState(signUp, initialSignUpState)
  const router = useRouter()
 
  // If sign-in is successful, redirect to the home page
  useEffect(() => {
    if (signInState.success) {
      // Set user info in localStorage for persistence
      localStorage.setItem("userAuthenticated", "true")
      localStorage.setItem("userName", "John Doe") // Default user name
      router.push("/")
    }
  }, [signInState.success, router])

  // If sign-up is successful, redirect to the onboarding form
  useEffect(() => {
    if (signUpState.success) {
      // Set user info in localStorage for persistence
      localStorage.setItem("userAuthenticated", "true")
      localStorage.setItem("userName", "John Doe") // Default user name
      router.push("/account/onboarding")
    }
  }, [signUpState.success, router])

  return (
    <Card className="w-full shadow-lg border-0">
      <CardHeader className="bg-[#a98cc8]/10 rounded-t-lg">
        <CardTitle className="text-2xl font-bold text-center text-gray-800">Welcome to MindfulCare</CardTitle>
        <CardDescription className="text-center text-gray-600">Your journey to wellness begins here</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger
              value="signin"
              className="rounded-l-lg data-[state=active]:bg-[#a98cc8] data-[state=active]:text-white"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="rounded-r-lg data-[state=active]:bg-[#a98cc8] data-[state=active]:text-white"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <form action={signInAction} className="space-y-4">
              {signInState.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                  {signInState.error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  className="rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-xs text-[#a98cc8] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="rounded-xl"
                  required
                />
              </div>

              <div className="flex items-center space-x-2 my-4">
                <Checkbox id="remember" name="remember" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>

              <Button type="submit" className="w-full bg-[#a98cc8] hover:bg-[#9678b4] text-white rounded-xl py-6">
                Sign In
              </Button>
            </form>

            <div className="text-center text-sm text-gray-500 mt-4">
              Don't have an account?{" "}
              <button
                className="text-[#a98cc8] hover:underline"
                onClick={() => document.getElementById("signup-tab")?.click()}
              >
                Sign up
              </button>
            </div>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4" id="signup-tab">
            <form action={signUpAction} className="space-y-4">
              {signUpState.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                  {signUpState.error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="new-username">Username</Label>
                <Input
                  id="new-username"
                  name="username"
                  placeholder="Choose a username"
                  className="rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">Password</Label>
                <Input
                  id="new-password"
                  name="password"
                  type="password"
                  placeholder="Choose a password"
                  className="rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className="rounded-xl"
                  required
                />
              </div>

              <div className="flex items-center space-x-2 my-4">
                <Checkbox id="terms" name="terms" required />
                <label htmlFor="terms" className="text-sm font-medium leading-none">
                  I agree to the{" "}
                  <Link href="/terms" className="text-[#a98cc8] hover:underline">
                    terms and conditions
                  </Link>
                </label>
              </div>

              <Button type="submit" className="w-full bg-[#a98cc8] hover:bg-[#9678b4] text-white rounded-xl py-6">
                Create Account
              </Button>
            </form>

            <div className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{" "}
              <button
                className="text-[#a98cc8] hover:underline"
                onClick={() => document.getElementById("signin-tab")?.click()}
              >
                Sign in
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
*/

"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"

export default function AuthForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showVerifyMessage, setShowVerifyMessage] = useState(false)
  const [alreadyRegistered, setAlreadyRegistered] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState("")
  const [activeTab, setActiveTab] = useState("signin")
  // Password visibility states
  const [showSignInPassword, setShowSignInPassword] = useState(false)
  const [showSignUpPassword, setShowSignUpPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const router = useRouter()
  const supabase = createClientComponentClient()
  const signinEmailRef = useRef<HTMLInputElement>(null)

  // Handle sign in
  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const email = form.get("email") as string
    const password = form.get("password") as string

    setLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      })

      if (error) {
        setError(error.message)
      } else {
        // This will trigger a refresh of the server-side auth state
        router.refresh()
        router.push("/client/schedule")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Handle sign up
  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const email = form.get("email") as string
    const password = form.get("password") as string
    const confirmPassword = form.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/account/onboarding`
        }
      })

      if (error) {
        if (
          error.message.toLowerCase().includes("already registered") || 
          error.message.toLowerCase().includes("email already") ||
          error.message.toLowerCase().includes("already taken") ||
          error.message.toLowerCase().includes("already exists") ||
          error.message.toLowerCase().includes("user exists")
        ) {
          setAlreadyRegistered(true)
          setRegisteredEmail(email)
        } else {
          setError(error.message)
        }
      } else {
        if (data?.user?.identities?.length === 0) {
          setAlreadyRegistered(true)
          setRegisteredEmail(email)
        } else {
          setShowVerifyMessage(true)
        }
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleSwitchToSignIn = () => {
    setActiveTab("signin")
    setTimeout(() => {
      if (signinEmailRef.current) {
        signinEmailRef.current.value = registeredEmail
      }
    }, 100)
    setAlreadyRegistered(false)
  }

  if (alreadyRegistered) {
    return (
      <Card className="w-full shadow-lg border-0">
        <CardHeader className="bg-[#a98cc8]/10 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-center text-gray-800">Account Already Exists</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4 text-center text-gray-700">
          <p>
            The email <span className="font-medium">{registeredEmail}</span> is already registered with MindfulCare.
          </p>
          <p>Would you like to sign in using this email instead?</p>
          <Button 
            onClick={handleSwitchToSignIn}
            className="mt-4 bg-[#a98cc8] hover:bg-[#9678b4] text-white rounded-xl py-6 px-8"
          >
            Sign In Instead
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (showVerifyMessage) {
    return (
      <Card className="w-full shadow-lg border-0">
        <CardHeader className="bg-[#a98cc8]/10 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-center text-gray-800">Verify Your Email</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4 text-center text-gray-700">
          <p>
            A verification link has been sent to your registered email address.
            Please click the link in your email to complete your registration.
          </p>
          <p className="text-sm text-gray-500">
            After verification, you'll be redirected to onboarding.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full shadow-lg border-0">
      <CardHeader className="bg-[#a98cc8]/10 rounded-t-lg">
        <CardTitle className="text-2xl font-bold text-center text-gray-800">Welcome to MindfulCare</CardTitle>
        <CardDescription className="text-center text-gray-600">Your journey to wellness begins here</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger
              value="signin"
              className="rounded-l-lg data-[state=active]:bg-[#a98cc8] data-[state=active]:text-white"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="rounded-r-lg data-[state=active]:bg-[#a98cc8] data-[state=active]:text-white"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input 
                  id="signin-email" 
                  name="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  className="rounded-xl" 
                  ref={signinEmailRef}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <div className="relative">
                  <Input 
                    id="signin-password" 
                    name="password" 
                    type={showSignInPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="rounded-xl pr-10" 
                    required 
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                  >
                    {showSignInPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2 my-4">
                <Checkbox id="remember" name="remember" />
                <label htmlFor="remember" className="text-sm font-medium">Remember me</label>
              </div>

              <Button type="submit" className="w-full bg-[#a98cc8] hover:bg-[#9678b4] text-white rounded-xl py-6">
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-500 mt-4">
              Don't have an account?{" "}
              <button
                className="text-[#a98cc8] hover:underline"
                onClick={() => setActiveTab("signup")}
              >
                Sign up
              </button>
            </div>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" name="email" type="email" placeholder="you@example.com" className="rounded-xl" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Input 
                    id="signup-password" 
                    name="password" 
                    type={showSignUpPassword ? "text" : "password"} 
                    placeholder="Create a password" 
                    className="rounded-xl pr-10" 
                    required 
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                  >
                    {showSignUpPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="Confirm your password" 
                    className="rounded-xl pr-10" 
                    required 
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2 my-4">
                <Checkbox id="terms" name="terms" required />
                <label htmlFor="terms" className="text-sm font-medium leading-none">
                  I agree to the{" "}
                  <Link href="/terms" className="text-[#a98cc8] hover:underline">
                    terms and conditions
                  </Link>
                </label>
              </div>

              <Button type="submit" className="w-full bg-[#a98cc8] hover:bg-[#9678b4] text-white rounded-xl py-6">
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{" "}
              <button
                className="text-[#a98cc8] hover:underline"
                onClick={() => setActiveTab("signin")}
              >
                Sign in
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}