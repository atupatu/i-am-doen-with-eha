//components/therapist/profile-form.tsx
"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ProfileFormProps {
  profile: {
    tid: string
    name: string
    email: string
    education?: string
    bio?: string
    languages?: string
    areas_covered?: string
    image?: string
    Why_counselling?: string
    One_thing?: string
    expect?: string
    selfcare_tips?: string
  }
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [name, setName] = useState(profile.name || "")
  const [email, setEmail] = useState(profile.email || "")
  const [education, setEducation] = useState(profile.education || "")
  const [bio, setBio] = useState(profile.bio || "")
  const [languages, setLanguages] = useState(profile.languages || "")
  const [areasCovered, setAreasCovered] = useState(profile.areas_covered || "")
  const [whyCounselling, setWhyCounselling] = useState(profile.Why_counselling || "")
  const [oneThing, setOneThing] = useState(profile.One_thing || "")
  const [expect, setExpect] = useState(profile.expect || "")
  const [selfcareTips, setSelfcareTips] = useState(profile.selfcare_tips || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const updateData = {
        name,
        email,
        education,
        bio,
        languages,
        areas_covered: areasCovered,
        Why_counselling: whyCounselling,
        One_thing: oneThing,
        expect,
        selfcare_tips: selfcareTips,
      }

      const response = await fetch(`/api/therapists/${profile.tid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      alert("Profile updated successfully!")
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={profile.image || "/placeholder.svg?height=80&width=80"} alt={name} />
          <AvatarFallback>
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-medium">{name}</h3>
          <p className="text-sm text-gray-500">{areasCovered}</p>
          <Button type="button" variant="outline" size="sm" className="mt-2">
            Change Photo
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="rounded-xl" 
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="languages">Languages</Label>
          <Input
            id="languages"
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
            className="rounded-xl"
            placeholder="e.g., English, Spanish, French"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="areasCovered">Areas of Expertise</Label>
          <Input
            id="areasCovered"
            value={areasCovered}
            onChange={(e) => setAreasCovered(e.target.value)}
            className="rounded-xl"
            placeholder="e.g., Anxiety, Depression, CBT"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="education">Education</Label>
        <Textarea
          id="education"
          value={education}
          onChange={(e) => setEducation(e.target.value)}
          className="rounded-xl min-h-[100px]"
          placeholder="List your educational background, degrees, and institutions"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Professional Bio</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="rounded-xl min-h-[150px]"
          placeholder="Describe your professional background and approach to therapy"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="whyCounselling">Why Counselling?</Label>
        <Textarea
          id="whyCounselling"
          value={whyCounselling}
          onChange={(e) => setWhyCounselling(e.target.value)}
          className="rounded-xl min-h-[100px]"
          placeholder="Explain your philosophy and approach to counselling"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="oneThing">One Thing You Want Clients to Know</Label>
        <Textarea
          id="oneThing"
          value={oneThing}
          onChange={(e) => setOneThing(e.target.value)}
          className="rounded-xl min-h-[100px]"
          placeholder="What's one important thing you want your clients to know about you or your practice?"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="expect">What Clients Can Expect</Label>
        <Textarea
          id="expect"
          value={expect}
          onChange={(e) => setExpect(e.target.value)}
          className="rounded-xl min-h-[100px]"
          placeholder="Describe what clients can expect from working with you"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="selfcareTips">Self-Care Tips</Label>
        <Textarea
          id="selfcareTips"
          value={selfcareTips}
          onChange={(e) => setSelfcareTips(e.target.value)}
          className="rounded-xl min-h-[100px]"
          placeholder="Share some self-care tips you recommend to clients"
        />
      </div>

      <Button type="submit" className="bg-[#a98cc8] hover:bg-[#9678b4]" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}