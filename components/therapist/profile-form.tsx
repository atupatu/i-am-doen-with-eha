"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { updateTherapistProfile } from "@/lib/therapist-actions"

interface Education {
  degree: string
  institution: string
  year: string
}

interface Certification {
  name: string
  issuer: string
  year: string
}

interface ProfileFormProps {
  profile: {
    id: number
    name: string
    email: string
    phone: string
    specialty: string
    experience: string
    education: Education[]
    certifications: Certification[]
    bio: string
  }
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [name, setName] = useState(profile.name)
  const [email, setEmail] = useState(profile.email)
  const [phone, setPhone] = useState(profile.phone)
  const [specialty, setSpecialty] = useState(profile.specialty)
  const [experience, setExperience] = useState(profile.experience)
  const [bio, setBio] = useState(profile.bio)
  const [education, setEducation] = useState<Education[]>(profile.education)
  const [certifications, setCertifications] = useState<Certification[]>(profile.certifications)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddEducation = () => {
    setEducation([...education, { degree: "", institution: "", year: "" }])
  }

  const handleRemoveEducation = (index: number) => {
    const newEducation = [...education]
    newEducation.splice(index, 1)
    setEducation(newEducation)
  }

  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    const newEducation = [...education]
    newEducation[index][field] = value
    setEducation(newEducation)
  }

  const handleAddCertification = () => {
    setCertifications([...certifications, { name: "", issuer: "", year: "" }])
  }

  const handleRemoveCertification = (index: number) => {
    const newCertifications = [...certifications]
    newCertifications.splice(index, 1)
    setCertifications(newCertifications)
  }

  const handleCertificationChange = (index: number, field: keyof Certification, value: string) => {
    const newCertifications = [...certifications]
    newCertifications[index][field] = value
    setCertifications(newCertifications)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await updateTherapistProfile({
        id: profile.id,
        name,
        email,
        phone,
        specialty,
        experience,
        bio,
        education,
        certifications,
      })
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
          <AvatarImage src="/placeholder.svg?height=80&width=80" alt={name} />
          <AvatarFallback>
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-medium">{name}</h3>
          <p className="text-sm text-gray-500">{specialty}</p>
          <Button type="button" variant="outline" size="sm" className="mt-2">
            Change Photo
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl" required />
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
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-xl"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="specialty">Specialty</Label>
          <Input
            id="specialty"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="rounded-xl"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="experience">Experience</Label>
          <Input
            id="experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="rounded-xl"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Professional Bio</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="rounded-xl min-h-[150px]"
          required
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Education</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddEducation}
            className="text-[#a98cc8] border-[#a98cc8] hover:bg-[#a98cc8]/10"
          >
            Add Education
          </Button>
        </div>
        {education.map((edu, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`degree-${index}`}>Degree</Label>
                <Input
                  id={`degree-${index}`}
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`institution-${index}`}>Institution</Label>
                <Input
                  id={`institution-${index}`}
                  value={edu.institution}
                  onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`year-${index}`}>Year</Label>
                <Input
                  id={`year-${index}`}
                  value={edu.year}
                  onChange={(e) => handleEducationChange(index, "year", e.target.value)}
                  className="rounded-xl"
                  required
                />
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveEducation(index)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Certifications</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddCertification}
            className="text-[#a98cc8] border-[#a98cc8] hover:bg-[#a98cc8]/10"
          >
            Add Certification
          </Button>
        </div>
        {certifications.map((cert, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`cert-name-${index}`}>Certification Name</Label>
                <Input
                  id={`cert-name-${index}`}
                  value={cert.name}
                  onChange={(e) => handleCertificationChange(index, "name", e.target.value)}
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`cert-issuer-${index}`}>Issuing Organization</Label>
                <Input
                  id={`cert-issuer-${index}`}
                  value={cert.issuer}
                  onChange={(e) => handleCertificationChange(index, "issuer", e.target.value)}
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`cert-year-${index}`}>Year</Label>
                <Input
                  id={`cert-year-${index}`}
                  value={cert.year}
                  onChange={(e) => handleCertificationChange(index, "year", e.target.value)}
                  className="rounded-xl"
                  required
                />
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveCertification(index)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      <Button type="submit" className="bg-[#a98cc8] hover:bg-[#9678b4]" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}
