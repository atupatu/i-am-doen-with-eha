"use client"

// import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
// import { uploadReport } from "@/lib/therapist-actions"

// interface UploadReportFormProps {
//   appointmentId?: number
//   clientName?: string
//   onSuccess?: () => void
// }

// export default function UploadReportForm({ appointmentId, clientName, onSuccess }: UploadReportFormProps) {
//   const [title, setTitle] = useState("")
//   const [content, setContent] = useState("")
//   const [reportType, setReportType] = useState("session")
//   const [isDraft, setIsDraft] = useState(false)
//   const [isUploading, setIsUploading] = useState(false)
//   const [file, setFile] = useState<File | null>(null)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsUploading(true)

//     try {
//       await uploadReport({
//         appointmentId,
//         title,
//         content,
//         reportType,
//         isDraft,
//         file,
//       })

//       // Reset form
//       setTitle("")
//       setContent("")
//       setReportType("session")
//       setIsDraft(false)
//       setFile(null)

//       // Call success callback
//       if (onSuccess) onSuccess()
//     } catch (error) {
//       console.error("Error uploading report:", error)
//     } finally {
//       setIsUploading(false)
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div className="space-y-2">
//         <Label htmlFor="title">Report Title</Label>
//         <Input
//           id="title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder={`Session Report - ${clientName || "Client"}`}
//           className="rounded-xl"
//           required
//         />
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="report-type">Report Type</Label>
//           <Select value={reportType} onValueChange={setReportType}>
//             <SelectTrigger id="report-type" className="rounded-xl">
//               <SelectValue placeholder="Select report type" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="session">Session Report</SelectItem>
//               <SelectItem value="progress">Progress Report</SelectItem>
//               <SelectItem value="assessment">Assessment Report</SelectItem>
//               <SelectItem value="treatment">Treatment Plan</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="file">Attach File (Optional)</Label>
//           <Input id="file" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="rounded-xl" />
//         </div>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="content">Report Content</Label>
//         <Textarea
//           id="content"
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           placeholder="Enter the report content here..."
//           className="rounded-xl min-h-[200px]"
//           required
//         />
//       </div>

//       <div className="flex items-center space-x-2">
//         <Switch id="draft" checked={isDraft} onCheckedChange={setIsDraft} />
//         <Label htmlFor="draft">Save as draft</Label>
//       </div>

//       <div className="flex justify-end gap-2 pt-4">
//         <Button type="button" variant="outline" onClick={onSuccess}>
//           Cancel
//         </Button>
//         <Button type="submit" className="bg-[#a98cc8] hover:bg-[#9678b4]" disabled={isUploading}>
//           {isUploading ? "Uploading..." : isDraft ? "Save Draft" : "Upload Report"}
//         </Button>
//       </div>
//     </form>
//   )
// }

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface SessionLogFormProps {
  appointmentId?: number
  onSuccess?: () => void
}

interface AvailableClient {
  uid: string
  name: string
  email: string
}

interface AvailableTherapist {
  tid: string
  name: string
}

export default function SessionLogForm({ appointmentId, onSuccess }: SessionLogFormProps) {
  // Email
  const [email, setEmail] = useState("")
  
  // Session log basic info
  const [therapistName, setTherapistName] = useState("")
  const [clientName, setClientName] = useState("")
  
  // Session details
  const [sessionMonth, setSessionMonth] = useState("")
  const [sessionDate, setSessionDate] = useState("")
  const [sessionStartTime, setSessionStartTime] = useState("")
  const [sessionStartAMPM, setSessionStartAMPM] = useState("AM")
  const [sessionEndTime, setSessionEndTime] = useState("")
  const [sessionEndAMPM, setSessionEndAMPM] = useState("AM")
  const [sessionType, setSessionType] = useState("")
  
  // Activities conducted
  const [activities, setActivities] = useState({
    artTherapy: false,
    cognitiveActivities: false,
    sensoryActivities: false,
    other: false
  })
  const [otherActivity, setOtherActivity] = useState("")
  
  // Mood assessments
  const [moodBeginning, setMoodBeginning] = useState("")
  const [moodEnd, setMoodEnd] = useState("")
  
  // Engagement
  const [engagement, setEngagement] = useState("")
  
  // Text inputs
  const [keyObservations, setKeyObservations] = useState("")
  const [sessionComments, setSessionComments] = useState("")
  const [sessionImprovements, setSessionImprovements] = useState("")
  
  // Data states
  const [availableClients, setAvailableClients] = useState<AvailableClient[]>([
    { uid: "1", name: "John Doe", email: "john@example.com" },
    { uid: "2", name: "Jane Smith", email: "jane@example.com" }
  ])
  const [availableTherapists, setAvailableTherapists] = useState<AvailableTherapist[]>([
    { tid: "1", name: "Dr. Sarah Wilson" },
    { tid: "2", name: "Dr. Michael Chen" }
  ])
  const [isLoadingData, setIsLoadingData] = useState(false)
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Generate month options
  const generateMonthOptions = () => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]
    const currentYear = new Date().getFullYear()
    const options = []
    
    // Current year and previous year
    for (let year = currentYear; year >= currentYear - 1; year--) {
      months.forEach(month => {
        options.push(`${month} '${year.toString().slice(-2)}`)
      })
    }
    
    return options
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value
    setSessionDate(date)
  }

  const handleActivityChange = (activity: string, checked: boolean) => {
    setActivities(prev => ({
      ...prev,
      [activity]: checked
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = {
        email,
        therapistName,
        clientName,
        sessionMonth,
        sessionDate,
        sessionStartTime: `${sessionStartTime} ${sessionStartAMPM}`,
        sessionEndTime: `${sessionEndTime} ${sessionEndAMPM}`,
        sessionType,
        activities: {
          ...activities,
          otherActivity: activities.other ? otherActivity : ""
        },
        moodBeginning,
        moodEnd,
        engagement,
        keyObservations,
        sessionComments,
        sessionImprovements,
        appointmentId
      }

      console.log("Session log submitted:", formData)

      // Reset form
      setEmail("")
      setTherapistName("")
      setClientName("")
      setSessionMonth("")
      setSessionDate("")
      setSessionStartTime("")
      setSessionStartAMPM("AM")
      setSessionEndTime("")
      setSessionEndAMPM("AM")
      setSessionType("")
      setActivities({
        artTherapy: false,
        cognitiveActivities: false,
        sensoryActivities: false,
        other: false
      })
      setOtherActivity("")
      setMoodBeginning("")
      setMoodEnd("")
      setEngagement("")
      setKeyObservations("")
      setSessionComments("")
      setSessionImprovements("")

      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Error submitting session log:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Session Log Report</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-300 to-purple-200 mx-auto rounded-full"></div>
      </div>
      
      <div className="space-y-8">
        {/* Email */}
        <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-800 flex items-center">
              <span className="w-2 h-2 bg-purple-300 rounded-full mr-2"></span>
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border-purple-200 focus:border-purple-300 focus:ring-purple-200"
              required
            />
          </div>
        </div>

        {/* Session Log Basic Info */}
        <div className="bg-purple-50/30 p-6 rounded-2xl border border-purple-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-3 h-3 bg-purple-300 rounded-full mr-3"></span>
            Session Participants
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="therapist" className="text-sm font-semibold text-gray-800">
                Name of Therapist *
              </Label>
              <Select value={therapistName} onValueChange={setTherapistName}>
                <SelectTrigger id="therapist" className="rounded-xl border-purple-200 focus:border-purple-300">
                  <SelectValue placeholder={isLoadingData ? "Loading therapists..." : "Select therapist"} />
                </SelectTrigger>
                <SelectContent>
                  {availableTherapists.map(therapist => (
                    <SelectItem key={therapist.tid} value={therapist.tid}>
                      {therapist.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="client" className="text-sm font-semibold text-gray-800">
                Name of Client *
              </Label>
              <Select value={clientName} onValueChange={setClientName}>
                <SelectTrigger id="client" className="rounded-xl border-purple-200 focus:border-purple-300">
                  <SelectValue placeholder={isLoadingData ? "Loading clients..." : "Select client"} />
                </SelectTrigger>
                <SelectContent>
                  {availableClients.map(client => (
                    <SelectItem key={client.uid} value={client.uid}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Session Details */}
        <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-3 h-3 bg-purple-300 rounded-full mr-3"></span>
            Session Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <Label htmlFor="session-month" className="text-sm font-semibold text-gray-800">
                Session Month *
              </Label>
              <Select value={sessionMonth} onValueChange={setSessionMonth}>
                <SelectTrigger id="session-month" className="rounded-xl border-purple-200 focus:border-purple-300">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {generateMonthOptions().map(month => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="session-date" className="text-sm font-semibold text-gray-800">
                Session Date *
              </Label>
              <Input
                id="session-date"
                type="date"
                value={sessionDate}
                onChange={handleDateChange}
                className="rounded-xl border-purple-200 focus:border-purple-300 focus:ring-purple-200"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-800">Session Start Time *</Label>
              <div className="flex gap-3">
                <Input
                  type="time"
                  value={sessionStartTime}
                  onChange={(e) => setSessionStartTime(e.target.value)}
                  className="rounded-xl flex-1 border-purple-200 focus:border-purple-300 focus:ring-purple-200"
                  required
                />
                <Select value={sessionStartAMPM} onValueChange={setSessionStartAMPM}>
                  <SelectTrigger className="rounded-xl w-20 border-purple-200 focus:border-purple-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-800">Session End Time *</Label>
              <div className="flex gap-3">
                <Input
                  type="time"
                  value={sessionEndTime}
                  onChange={(e) => setSessionEndTime(e.target.value)}
                  className="rounded-xl flex-1 border-purple-200 focus:border-purple-300 focus:ring-purple-200"
                  required
                />
                <Select value={sessionEndAMPM} onValueChange={setSessionEndAMPM}>
                  <SelectTrigger className="rounded-xl w-20 border-purple-200 focus:border-purple-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="session-type" className="text-sm font-semibold text-gray-800">
              Session Type *
            </Label>
            <Select value={sessionType} onValueChange={setSessionType}>
              <SelectTrigger id="session-type" className="rounded-xl border-purple-200 focus:border-purple-300">
                <SelectValue placeholder="Select session type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in-person">In Person</SelectItem>
                <SelectItem value="online">Online</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Session Narrative */}
        <div className="bg-purple-50/30 p-6 rounded-2xl border border-purple-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-3 h-3 bg-purple-300 rounded-full mr-3"></span>
            Session Narrative
          </h3>
          
          {/* Activities Conducted */}
          <div className="bg-white/70 p-5 rounded-xl border border-purple-100 mb-6">
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-gray-800 flex items-center">
                <span className="w-2 h-2 bg-purple-300 rounded-full mr-2"></span>
                Activities Conducted * (Select all that apply)
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-50/50 transition-colors">
                  <Checkbox 
                    id="art-therapy"
                    checked={activities.artTherapy}
                    onCheckedChange={(checked) => handleActivityChange('artTherapy', checked as boolean)}
                    className="border-purple-300"
                  />
                  <Label htmlFor="art-therapy" className="text-sm">Art Therapy</Label>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-50/50 transition-colors">
                  <Checkbox 
                    id="cognitive-activities"
                    checked={activities.cognitiveActivities}
                    onCheckedChange={(checked) => handleActivityChange('cognitiveActivities', checked as boolean)}
                    className="border-purple-300"
                  />
                  <Label htmlFor="cognitive-activities" className="text-sm">Cognitive Activities</Label>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-50/50 transition-colors">
                  <Checkbox 
                    id="sensory-activities"
                    checked={activities.sensoryActivities}
                    onCheckedChange={(checked) => handleActivityChange('sensoryActivities', checked as boolean)}
                    className="border-purple-300"
                  />
                  <Label htmlFor="sensory-activities" className="text-sm">Sensory Activities</Label>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-50/50 transition-colors">
                    <Checkbox 
                      id="other-activity"
                      checked={activities.other}
                      onCheckedChange={(checked) => handleActivityChange('other', checked as boolean)}
                      className="border-purple-300"
                    />
                    <Label htmlFor="other-activity" className="text-sm">Other:</Label>
                  </div>
                  {activities.other && (
                    <Input
                      placeholder="Specify other activity"
                      value={otherActivity}
                      onChange={(e) => setOtherActivity(e.target.value)}
                      className="rounded-xl ml-8 border-purple-200 focus:border-purple-300 focus:ring-purple-200"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mood assessments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white/70 p-5 rounded-xl border border-purple-100">
              <div className="space-y-4">
                <Label className="text-sm font-semibold text-gray-800 flex items-center">
                  <span className="w-2 h-2 bg-purple-300 rounded-full mr-2"></span>
                  Client Mood (Beginning) *
                </Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-50/50 transition-colors">
                    <Checkbox 
                      id="mood-begin-bad"
                      checked={moodBeginning === "not-good"}
                      onCheckedChange={(checked) => checked && setMoodBeginning("not-good")}
                      className="border-purple-300"
                    />
                    <Label htmlFor="mood-begin-bad" className="text-sm">Not in a good mood</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-50/50 transition-colors">
                    <Checkbox 
                      id="mood-begin-neutral"
                      checked={moodBeginning === "neutral"}
                      onCheckedChange={(checked) => checked && setMoodBeginning("neutral")}
                      className="border-purple-300"
                    />
                    <Label htmlFor="mood-begin-neutral" className="text-sm">Neutral</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-50/50 transition-colors">
                    <Checkbox 
                      id="mood-begin-good"
                      checked={moodBeginning === "good"}
                      onCheckedChange={(checked) => checked && setMoodBeginning("good")}
                      className="border-purple-300"
                    />
                    <Label htmlFor="mood-begin-good" className="text-sm">In a good mood</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/70 p-5 rounded-xl border border-purple-100">
              <div className="space-y-4">
                <Label className="text-sm font-semibold text-gray-800 flex items-center">
                  <span className="w-2 h-2 bg-purple-300 rounded-full mr-2"></span>
                  Client Mood (End) *
                </Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-50/50 transition-colors">
                    <Checkbox 
                      id="mood-end-bad"
                      checked={moodEnd === "not-good"}
                      onCheckedChange={(checked) => checked && setMoodEnd("not-good")}
                      className="border-purple-300"
                    />
                    <Label htmlFor="mood-end-bad" className="text-sm">Not in a good mood</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-50/50 transition-colors">
                    <Checkbox 
                      id="mood-end-neutral"
                      checked={moodEnd === "neutral"}
                      onCheckedChange={(checked) => checked && setMoodEnd("neutral")}
                      className="border-purple-300"
                    />
                    <Label htmlFor="mood-end-neutral" className="text-sm">Neutral</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-50/50 transition-colors">
                    <Checkbox 
                      id="mood-end-good"
                      checked={moodEnd === "good"}
                      onCheckedChange={(checked) => checked && setMoodEnd("good")}
                      className="border-purple-300"
                    />
                    <Label htmlFor="mood-end-good" className="text-sm">In a good mood</Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Engagement */}
          <div className="bg-white/70 p-5 rounded-xl border border-purple-100 mb-6">
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-gray-800 flex items-center">
                <span className="w-2 h-2 bg-purple-300 rounded-full mr-2"></span>
                Client Engagement Throughout Session *
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-50/50 transition-colors">
                  <Checkbox 
                    id="engagement-full"
                    checked={engagement === "fully-engaged"}
                    onCheckedChange={(checked) => checked && setEngagement("fully-engaged")}
                    className="border-purple-300"
                  />
                  <Label htmlFor="engagement-full" className="text-sm">Fully Engaged</Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-50/50 transition-colors">
                  <Checkbox 
                    id="engagement-sometimes"
                    checked={engagement === "sometimes-engaged"}
                    onCheckedChange={(checked) => checked && setEngagement("sometimes-engaged")}
                    className="border-purple-300"
                  />
                  <Label htmlFor="engagement-sometimes" className="text-sm">Sometimes engaged</Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-50/50 transition-colors">
                  <Checkbox 
                    id="engagement-not"
                    checked={engagement === "not-engaged"}
                    onCheckedChange={(checked) => checked && setEngagement("not-engaged")}
                    className="border-purple-300"
                  />
                  <Label htmlFor="engagement-not" className="text-sm">Not engaged</Label>
                </div>
              </div>
            </div>
          </div>

          {/* Text areas */}
          <div className="space-y-6">
            <div className="bg-white/70 p-5 rounded-xl border border-purple-100">
              <div className="space-y-3">
                <Label htmlFor="key-observations" className="text-sm font-semibold text-gray-800 flex items-center">
                  <span className="w-2 h-2 bg-purple-300 rounded-full mr-2"></span>
                  Key Observations on Client (Positives and negatives) *
                </Label>
                <Textarea
                  id="key-observations"
                  value={keyObservations}
                  onChange={(e) => setKeyObservations(e.target.value)}
                  placeholder="Describe key observations about the client during this session..."
                  className="rounded-xl min-h-[120px] border-purple-200 focus:border-purple-300 focus:ring-purple-200"
                  required
                />
              </div>
            </div>

            <div className="bg-white/70 p-5 rounded-xl border border-purple-100">
              <div className="space-y-3">
                <Label htmlFor="session-comments" className="text-sm font-semibold text-gray-800 flex items-center">
                  <span className="w-2 h-2 bg-purple-300 rounded-full mr-2"></span>
                  Overall Session Comments (Team notes) *
                </Label>
                <Textarea
                  id="session-comments"
                  value={sessionComments}
                  onChange={(e) => setSessionComments(e.target.value)}
                  placeholder="Provide overall comments and team notes for this session..."
                  className="rounded-xl min-h-[120px] border-purple-200 focus:border-purple-300 focus:ring-purple-200"
                  required
                />
              </div>
            </div>

            <div className="bg-white/70 p-5 rounded-xl border border-purple-100">
              <div className="space-y-3">
                <Label htmlFor="session-improvements" className="text-sm font-semibold text-gray-800 flex items-center">
                  <span className="w-2 h-2 bg-purple-300 rounded-full mr-2"></span>
                  Session Improvements Needed or Challenges Faced *
                </Label>
                <Textarea
                  id="session-improvements"
                  value={sessionImprovements}
                  onChange={(e) => setSessionImprovements(e.target.value)}
                  placeholder="Describe any improvements needed or challenges faced..."
                  className="rounded-xl min-h-[120px] border-purple-200 focus:border-purple-300 focus:ring-purple-200"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit buttons */}
        <div className="bg-purple-50/40 p-6 rounded-2xl border border-purple-100">
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onSuccess} 
              className="rounded-xl border-purple-200 text-purple-700 hover:bg-purple-50 px-8"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-[#a98cc8] hover:bg-[#9678b4] text-white rounded-xl px-8 shadow-md hover:shadow-lg transition-all" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Session Log"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}