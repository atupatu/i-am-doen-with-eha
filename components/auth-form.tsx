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

  // Helper function to redirect based on role using window.location
  const redirectByRole = (role: string) => {
    let redirectPath = "/"
    
    switch (role) {
      case 'user':
        redirectPath = "/client/schedule"
        break
      case 'therapist':
        redirectPath = "/therapist/schedule"
        break
      case 'admin':
        redirectPath = "/admin/dashboard"
        break
      default:
        redirectPath = "/"
    }

    console.log(`Redirecting to: ${redirectPath}`)
    
    // Use window.location.href for more reliable redirection
    window.location.href = redirectPath
  }

  // Handle sign in
  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const email = form.get("email") as string
    const password = form.get("password") as string

    setLoading(true)
    setError(null)
    
    try {
      console.log("Starting sign in process...")
      
      const { error, data } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      })

      if (error) {
        console.error("Sign in error:", error)
        setError(error.message)
        return
      }

      if (!data.user?.id) {
        setError("Authentication failed - no user found")
        return
      }

      console.log("User signed in successfully, fetching role...")

      // Wait for the session to be properly set
      await new Promise(resolve => setTimeout(resolve, 500))

      // 🔑 Fetch user role from Supabase
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .single()

      if (roleError) {
        console.error("Error fetching user role:", roleError)
        // If no role exists, redirect to onboarding
        window.location.href = "/account/onboarding"
        return
      }

      if (!roleData?.role) {
        console.log("No role found, redirecting to onboarding")
        window.location.href = "/account/onboarding"
        return
      }

      const role = roleData.role
      console.log("User role found:", role)
      
      // ✅ Redirect based on role
      redirectByRole(role)

    } catch (err) {
      console.error("Unexpected sign in error:", err)
      setError("An unexpected error occurred during sign in")
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
      console.log("Starting sign up process...")
      
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/account/onboarding`,
        },
      })

      if (error) {
        console.error("Sign up error:", error)
        
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
        return
      }

      // ✅ Handle successful signup
      if (data.user) {
        console.log("User signed up successfully")
        
        // Check if user needs email confirmation
        if (!data.session) {
          console.log("Email confirmation required")
          setShowVerifyMessage(true)
          return
        }

        console.log("User confirmed, checking for role...")

        // Wait for the session to be properly set
        await new Promise(resolve => setTimeout(resolve, 500))

        // User is immediately confirmed, check if they have a role
        const { data: roleData, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .single()

        if (roleError || !roleData?.role) {
          console.log("No role found, redirecting to onboarding")
          router.refresh()
          router.push("/account/onboarding")
          return
        }

        const role = roleData.role
        console.log("User role found after signup:", role)
        redirectByRole(role)
      }
    } catch (err) {
      console.error("Unexpected sign up error:", err)
      setError("An unexpected error occurred during sign up")
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
    setError(null)
  }

  if (alreadyRegistered) {
    return (
      <Card className="w-full shadow-lg border-0">
        <CardHeader className="bg-[#a98cc8]/10 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-center text-gray-800">Account Already Exists</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4 text-center text-gray-700">
          <p>
            The email <span className="font-medium">{registeredEmail}</span> is already registered with Echoing Healthy Aging.
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
        <CardTitle className="text-2xl font-bold text-center text-gray-800">Welcome to Echoing Healthy Aging</CardTitle>
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

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#a98cc8] hover:bg-[#9678b4] text-white rounded-xl py-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-500 mt-4">
              Don't have an account?{" "}
              <button
                className="text-[#a98cc8] hover:underline"
                onClick={() => setActiveTab("signup")}
                disabled={loading}
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

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#a98cc8] hover:bg-[#9678b4] text-white rounded-xl py-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{" "}
              <button
                className="text-[#a98cc8] hover:underline"
                onClick={() => setActiveTab("signin")}
                disabled={loading}
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