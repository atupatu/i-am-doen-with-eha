"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, FileText, ChevronRight, ChevronLeft } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Main component
export default function OnboardingForm() {
  const [preferredMethod, setPreferredMethod] = useState<"call" | "form">("form")
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({})
  const [isRequestingCall, setIsRequestingCall] = useState(false)
  const [uid, setUid] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  // Total number of steps in the form
  const totalSteps = 4

  // Fetch user and onboarding data on mount
  useEffect(() => {
    const getUserAndData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUid(user.id)
        try {
          const res = await fetch(`/api/onboarding/${user.id}`)
          if (res.ok) {
            const data = await res.json()
            setFormData(data)
          }
        } catch (err) {
          console.error("Failed to fetch onboarding data", err)
        }
      } else {
        router.push("/login")
      }
    }
    getUserAndData()
  }, [router, supabase])

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!uid) {
      setError("User not authenticated")
      return
    }
    try {
      const res = await fetch(`/api/onboarding/${uid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        throw new Error("Failed to update")
      }
      router.push("/client/schedule")
    } catch (err) {
      setError("Failed to submit form. Please try again.")
    }
  }

  // Handle request call button click
  const handleRequestCall = () => {
    setIsRequestingCall(true)
  }

  // Navigate between form steps
  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  useEffect(() => {
    if (preferredMethod === "call" || isRequestingCall) {
      const timer = setTimeout(async () => {
        if (uid) {
          try {
            await fetch(`/api/onboarding/${uid}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ preferredMethod: "call" }),
            })
          } catch (err) {
            console.error("Failed to update preferred method", err)
          }
        }
        router.push("/client/schedule")
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [preferredMethod, isRequestingCall, router, uid])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 space-y-6">
      <Card className="border shadow-lg overflow-hidden">
        <CardHeader className="bg-[#a98cc8]/10 rounded-t-lg px-8 py-6">
          <CardTitle className="text-2xl font-bold text-center text-gray-800">Complete Your Profile</CardTitle>
          <CardDescription className="text-center text-gray-600">
            Help us understand how we can best support your loved one
          </CardDescription>
        </CardHeader>

        {/* Progress Bar */}
        {preferredMethod === "form" && !isRequestingCall && (
          <div className="px-8 pt-6">
            <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>{currentStep + 1} of {totalSteps}</span>
              <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}% completed</span>
            </div>
          </div>
        )}

        <CardContent className="pt-6 px-8 pb-8 space-y-6">
          {/* Method Selection */}
          {currentStep === 0 && !isRequestingCall && (
            <MethodSelection 
              preferredMethod={preferredMethod} 
              setPreferredMethod={setPreferredMethod} 
              nextStep={nextStep}
            />
          )}

          {/* Form Steps */}
          {preferredMethod === "form" && currentStep > 0 && !isRequestingCall && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Basic Information */}
              {currentStep === 1 && (
                <BasicInformation 
                  handleInputChange={handleInputChange} 
                  handleSelectChange={handleSelectChange}
                  formData={formData} 
                />
              )}

              {/* Personal History */}
              {currentStep === 2 && (
                <PersonalHistory 
                  handleInputChange={handleInputChange} 
                  formData={formData} 
                />
              )}

              {/* Preferences and Contact */}
              {currentStep === 3 && (
                <PreferencesAndContact 
                  handleInputChange={handleInputChange} 
                  formData={formData} 
                />
              )}

              {/* Request Call Instead Button - Show on form steps 1, 2, and 3 */}
              {currentStep >= 1 && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-3">
                      Having trouble filling out the form?
                    </p>
                    <Button 
                      type="button" 
                      onClick={handleRequestCall}
                      variant="outline"
                      className="border-[#a98cc8] text-[#a98cc8] hover:bg-[#a98cc8] hover:text-white flex items-center mx-auto"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Request a call instead
                    </Button>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                <Button 
                  type="button" 
                  onClick={prevStep} 
                  variant="outline"
                  className="flex items-center px-5"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>

                {currentStep < totalSteps - 1 ? (
                  <Button 
                    type="button" 
                    onClick={nextStep} 
                    className="bg-[#a98cc8] hover:bg-[#9678b4] text-white flex items-center px-5"
                  >
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    className="bg-[#a98cc8] hover:bg-[#9678b4] text-white px-6"
                  >
                    Submit
                  </Button>
                )}
              </div>
            </form>
          )}

          {/* Loading State for Call option */}
          {(preferredMethod === "call" || isRequestingCall) && (
            <div className="text-center py-12 animate-fadeIn">
              <Phone className="h-12 w-12 text-[#a98cc8] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">Signing you in...</h3>
              <p className="text-gray-600 mt-2">You'll be redirected to your schedule. Our team will call you shortly.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Progress Bar Component
function ProgressBar({ currentStep, totalSteps }) {
  const progress = ((currentStep + 1) / totalSteps) * 100
  
  return (
    <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="h-full bg-[#a98cc8] transition-all duration-300 ease-in-out" 
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

// Method Selection Component
function MethodSelection({ preferredMethod, setPreferredMethod, nextStep }) {
  return (
    <div className="animate-fadeIn">
      <h2 className="text-lg font-medium mb-6">How would you like to provide information?</h2>
      <RadioGroup
        defaultValue={preferredMethod}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        onValueChange={(value) => setPreferredMethod(value as "call" | "form")}
      >
        <div className={`border rounded-xl p-5 cursor-pointer transition-all ${preferredMethod === "call" ? "border-[#a98cc8] bg-[#a98cc8]/5" : "border-gray-200 hover:border-[#a98cc8]/50"}`}>
          <RadioGroupItem value="call" id="call" className="sr-only" />
          <Label htmlFor="call" className="flex items-start cursor-pointer">
            <Phone className="h-6 w-6 text-[#a98cc8] mt-0.5 mr-4" />
            <div>
              <span className="font-medium block mb-2">Request a Call</span>
              <span className="text-sm text-gray-500">Our team will call you to collect all necessary information</span>
            </div>
          </Label>
        </div>

        <div className={`border rounded-xl p-5 cursor-pointer transition-all ${preferredMethod === "form" ? "border-[#a98cc8] bg-[#a98cc8]/5" : "border-gray-200 hover:border-[#a98cc8]/50"}`}>
          <RadioGroupItem value="form" id="form" className="sr-only" />
          <Label htmlFor="form" className="flex items-start cursor-pointer">
            <FileText className="h-6 w-6 text-[#a98cc8] mt-0.5 mr-4" />
            <div>
              <span className="font-medium block mb-2">Complete the Form</span>
              <span className="text-sm text-gray-500">Fill out our comprehensive form with all details</span>
            </div>
          </Label>
        </div>
      </RadioGroup>

      {preferredMethod === "form" && (
        <div className="mt-8 flex justify-end">
          <Button 
            type="button" 
            onClick={nextStep} 
            className="bg-[#a98cc8] hover:bg-[#9678b4] text-white flex items-center px-5"
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}

// Basic Information Component
function BasicInformation({ handleInputChange, handleSelectChange, formData }) {
  return (
    <div className="space-y-5 animate-fadeIn">
      <h2 className="text-lg font-medium mb-5">Step 1: Basic Information</h2>
      
      <div className="space-y-2">
        <Label htmlFor="senior-name">Name of the Senior Citizen *</Label>
        <Input 
          id="senior-name" 
          name="seniorName" 
          placeholder="Full name" 
          required 
          className="rounded-xl"
          value={formData.seniorName || ""}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferred-name">How would you like us to address them?</Label>
        <Input 
          id="preferred-name" 
          name="preferredName" 
          placeholder="Preferred name or title" 
          className="rounded-xl"
          value={formData.preferredName || ""}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="diagnosis">Diagnosis *</Label>
        <Select 
          name="diagnosis" 
          required
          value={formData.diagnosis || ""}
          onValueChange={(value) => handleSelectChange("diagnosis", value)}
        >
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder="Select diagnosis" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mci">Mild Cognitive Impairment (MCI)</SelectItem>
            <SelectItem value="depression">Depression</SelectItem>
            <SelectItem value="dementia-early">Dementia - Early Stage</SelectItem>
            <SelectItem value="dementia-middle">Dementia - Middle Stage</SelectItem>
            <SelectItem value="dementia-late">Dementia - Late Stage</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="other-diagnosis">If Other, please specify</Label>
        <Input 
          id="other-diagnosis" 
          name="otherDiagnosis" 
          placeholder="Specify diagnosis" 
          className="rounded-xl"
          value={formData.otherDiagnosis || ""}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="time-slots">Preferred Time slots for Session *</Label>
        <Textarea 
          id="time-slots" 
          name="timeSlots" 
          placeholder="At least 2 options or time range" 
          required 
          className="rounded-xl min-h-[100px]"
          value={formData.timeSlots || ""}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address (To conduct sessions) *</Label>
        <Textarea 
          id="address" 
          name="address" 
          placeholder="Full address" 
          required 
          className="rounded-xl min-h-[100px]"
          value={formData.address || ""}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="language">Language Preference *</Label>
        <Select 
          name="language" 
          required
          value={formData.language || ""}
          onValueChange={(value) => handleSelectChange("language", value)}
        >
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder="Select preferred language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="hindi">Hindi</SelectItem>
            <SelectItem value="punjabi">Punjabi</SelectItem>
            <SelectItem value="gujarati">Gujarati</SelectItem>
            <SelectItem value="bengali">Bengali</SelectItem>
            <SelectItem value="marathi">Marathi</SelectItem>
            <SelectItem value="tamil">Tamil</SelectItem>
            <SelectItem value="telugu">Telugu</SelectItem>
            <SelectItem value="kannada">Kannada</SelectItem>
            <SelectItem value="malayalam">Malayalam</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="other-language">If Other, please specify</Label>
        <Input 
          id="other-language" 
          name="otherLanguage" 
          placeholder="Specify language" 
          className="rounded-xl"
          value={formData.otherLanguage || ""}
          onChange={handleInputChange}
        />
      </div>
    </div>
  )
}

// Personal History Component
function PersonalHistory({ handleInputChange, formData }) {
  return (
    <div className="space-y-5 animate-fadeIn">
      <h2 className="text-lg font-medium mb-5">Step 2: Personal History</h2>
      
      <div className="space-y-2">
        <Label htmlFor="dob">Date of Birth (or approximate birth year)</Label>
        <Input 
          id="dob" 
          name="dob" 
          placeholder="DD/MM/YYYY or YYYY" 
          className="rounded-xl"
          value={formData.dob || ""}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="birthPlace">Where were you born?</Label>
        <Input 
          id="birthPlace" 
          name="birthPlace" 
          placeholder="Place of birth" 
          className="rounded-xl"
          value={formData.birthPlace || ""}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="family">Parents and siblings – Comment on relationships</Label>
        <Textarea 
          id="family" 
          name="family" 
          placeholder="Family members and relationship details" 
          className="rounded-xl min-h-[100px]"
          value={formData.family || ""}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="educationHistory">Education History</Label>
        <Textarea 
          id="educationHistory" 
          name="educationHistory" 
          placeholder="School, college, and further education details" 
          className="rounded-xl min-h-[100px]"
          value={formData.educationHistory || ""}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="workHistory">Work History</Label>
        <Textarea 
          id="workHistory" 
          name="workHistory" 
          placeholder="Places worked, positions held" 
          className="rounded-xl min-h-[100px]"
          value={formData.workHistory || ""}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="spouseName">Partner/Spouse Name</Label>
        <Input 
          id="spouseName" 
          name="spouseName" 
          className="rounded-xl"
          value={formData.spouseName || ""}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="meetingDetails">When and where did you meet your spouse?</Label>
        <Textarea 
          id="meetingDetails" 
          name="meetingDetails" 
          className="rounded-xl"
          value={formData.meetingDetails || ""}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="children">Children (names, other info)</Label>
        <Textarea 
          id="children" 
          name="children" 
          className="rounded-xl"
          value={formData.children || ""}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="grandchildren">Grandchildren (names)</Label>
        <Textarea 
          id="grandchildren" 
          name="grandchildren" 
          className="rounded-xl"
          value={formData.grandchildren || ""}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="historicalEvent">Have you witnessed any major historical events?</Label>
        <Textarea 
          id="historicalEvent" 
          name="historicalEvent" 
          className="rounded-xl"
          value={formData.historicalEvent || ""}
          onChange={handleInputChange}
        />
      </div>
    </div>
  )
}

// Preferences and Contact Component
function PreferencesAndContact({ handleInputChange, formData }) {
  return (
    <div className="space-y-5 animate-fadeIn">
      <h2 className="text-lg font-medium mb-5">Step 3: Preferences & Contact Information</h2>
      
      <div className="space-y-2">
        <Label htmlFor="hobbies">Hobbies and interests</Label>
        <Textarea 
          id="hobbies" 
          name="hobbies" 
          placeholder="Shopping, socializing, etc." 
          className="rounded-xl min-h-[100px]"
          value={formData.hobbies || ""}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="currentEnjoyment">What do you enjoy doing now?</Label>
        <Input 
          id="currentEnjoyment" 
          name="currentEnjoyment" 
          className="rounded-xl"
          value={formData.currentEnjoyment || ""}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="readingPreferences">What do you like to read?</Label>
        <Input 
          id="readingPreferences" 
          name="readingPreferences" 
          className="rounded-xl"
          value={formData.readingPreferences || ""}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="favColor">Favourite colour? One you don't like?</Label>
        <Input 
          id="favColor" 
          name="favColor" 
          className="rounded-xl"
          value={formData.favColor || ""}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="musicTaste">What kind of music do you like?</Label>
        <Input 
          id="musicTaste" 
          name="musicTaste" 
          className="rounded-xl"
          value={formData.musicTaste || ""}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="favFood">Favourite food and drink?</Label>
        <Input 
          id="favFood" 
          name="favFood" 
          className="rounded-xl"
          value={formData.favFood || ""}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="routine">Daily Routine</Label>
        <Textarea 
          id="routine" 
          name="routine" 
          placeholder="From waking up to sleeping" 
          className="rounded-xl min-h-[100px]"
          value={formData.routine || ""}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="carerName">Family member/Carer for communication</Label>
        <Input 
          id="carerName" 
          name="carerName" 
          className="rounded-xl"
          value={formData.carerName || ""}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="carerPhone">Contact Number of Family member/Carer</Label>
        <Input 
          id="carerPhone" 
          name="carerPhone" 
          type="tel" 
          className="rounded-xl"
          value={formData.carerPhone || ""}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="invoiceEmail">Email Address (To send invoice)</Label>
        <Input 
          id="invoiceEmail" 
          name="invoiceEmail" 
          type="email" 
          className="rounded-xl"
          value={formData.invoiceEmail || ""}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="payerPhone">Contact Number for Payer of Invoice</Label>
        <Input 
          id="payerPhone" 
          name="payerPhone" 
          type="tel" 
          className="rounded-xl"
          value={formData.payerPhone || ""}
          onChange={handleInputChange}
        />
      </div>
    </div>
  )
}