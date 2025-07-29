"use client"

import { useState } from "react"
import { UserPlus, Mail, Clock, User, FileText, Award, GraduationCap, Globe, MapPin, Hash, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface AddTherapistDialogProps {
  onTherapistAdded: (newTherapist: any) => void
}

export function AddTherapistDialog({ onTherapistAdded }: AddTherapistDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    info: "",
    availability_hours: "",
    education: "",
    bio: "",
    languages: "",
    areas_covered: "",
    user_id: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddTherapist = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/therapists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          info: formData.info,
          availability_hours: formData.availability_hours ? parseInt(formData.availability_hours) : null,
          education: formData.education,
          bio: formData.bio,
          languages: formData.languages,
          areas_covered: formData.areas_covered,
          user_id: formData.user_id || null,
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add therapist')
      }

      const result = await response.json()
      onTherapistAdded(result.data[0])
      setIsOpen(false)
      setFormData({
        name: "",
        email: "",
        phone: "",
        info: "",
        availability_hours: "",
        education: "",
        bio: "",
        languages: "",
        areas_covered: "",
        user_id: ""
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add therapist')
    } finally {
      setIsLoading(false)
    }
  }

  const incrementAvailability = () => {
    const current = parseInt(formData.availability_hours) || 0
    setFormData({...formData, availability_hours: (current + 1).toString()})
  }

  const decrementAvailability = () => {
    const current = parseInt(formData.availability_hours) || 0
    if (current > 0) {
      setFormData({...formData, availability_hours: (current - 1).toString()})
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#a98cc8] hover:bg-[#9678b4] text-white">
          <UserPlus className="mr-2 h-4 w-4" />
          Add New Therapist
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl flex items-center">
            <UserPlus className="mr-2 h-5 w-5 text-[#a98cc8]" />
            Add New Therapist
          </DialogTitle>
          <DialogDescription>
            Enter therapist details below. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}
        <div className="space-y-6 py-2">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm flex items-center font-medium">
              <User className="mr-2 h-4 w-4 text-gray-500" />
              Name *
            </Label>
            <Input 
              id="name" 
              placeholder="Dr. Sarah Johnson" 
              className="focus:border-[#a98cc8] focus:ring-[#a98cc8]"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm flex items-center font-medium">
              <Mail className="mr-2 h-4 w-4 text-gray-500" />
              Email *
            </Label>
            <Input 
              id="email" 
              type="email"
              placeholder="sarah@example.com" 
              className="focus:border-[#a98cc8] focus:ring-[#a98cc8]"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          
          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm flex items-center font-medium">
              <Phone className="mr-2 h-4 w-4 text-gray-500" />
              Phone
            </Label>
            <Input 
              id="phone" 
              placeholder="+1 (555) 123-4567" 
              className="focus:border-[#a98cc8] focus:ring-[#a98cc8]"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          
          {/* Specialty */}
          <div className="space-y-2">
            <Label htmlFor="info" className="text-sm flex items-center font-medium">
              <Award className="mr-2 h-4 w-4 text-gray-500" />
              Specialty/Info
            </Label>
            <Input 
              id="info" 
              placeholder="Cognitive Behavioral Therapy, Anxiety, Depression" 
              className="focus:border-[#a98cc8] focus:ring-[#a98cc8]"
              value={formData.info}
              onChange={(e) => setFormData({...formData, info: e.target.value})}
            />
          </div>
          
          {/* Availability with controls */}
          <div className="space-y-2">
            <Label htmlFor="availability_hours" className="text-sm flex items-center font-medium">
              <Clock className="mr-2 h-4 w-4 text-gray-500" />
              Availability (hours/week)
            </Label>
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={decrementAvailability}
                disabled={!formData.availability_hours || parseInt(formData.availability_hours) <= 0}
                className="h-10 w-10 p-0 hover:bg-[#f3f0f7]"
              >
                −
              </Button>
              <Input 
                id="availability_hours" 
                type="number"
                placeholder="40" 
                className="text-center focus:border-[#a98cc8] focus:ring-[#a98cc8] flex-1"
                value={formData.availability_hours}
                onChange={(e) => setFormData({...formData, availability_hours: e.target.value})}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={incrementAvailability}
                className="h-10 w-10 p-0 hover:bg-[#f3f0f7]"
              >
                +
              </Button>
            </div>
          </div>
          
          {/* Education */}
          <div className="space-y-2">
            <Label htmlFor="education" className="text-sm flex items-center font-medium">
              <GraduationCap className="mr-2 h-4 w-4 text-gray-500" />
              Education
            </Label>
            <Textarea 
              id="education" 
              placeholder="Ph.D. in Clinical Psychology, University of California" 
              className="min-h-[70px] focus:border-[#a98cc8] focus:ring-[#a98cc8] resize-none"
              value={formData.education}
              onChange={(e) => setFormData({...formData, education: e.target.value})}
            />
          </div>
          
          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm flex items-center font-medium">
              <FileText className="mr-2 h-4 w-4 text-gray-500" />
              Professional Bio
            </Label>
            <Textarea 
              id="bio" 
              placeholder="Professional background, experience, and approach to therapy..." 
              className="min-h-[90px] focus:border-[#a98cc8] focus:ring-[#a98cc8] resize-none"
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
            />
          </div>
          
          {/* Languages */}
          <div className="space-y-2">
            <Label htmlFor="languages" className="text-sm flex items-center font-medium">
              <Globe className="mr-2 h-4 w-4 text-gray-500" />
              Languages
            </Label>
            <Input 
              id="languages" 
              placeholder="English, Spanish, French" 
              className="focus:border-[#a98cc8] focus:ring-[#a98cc8]"
              value={formData.languages}
              onChange={(e) => setFormData({...formData, languages: e.target.value})}
            />
          </div>
          
          {/* Areas Covered */}
          <div className="space-y-2">
            <Label htmlFor="areas_covered" className="text-sm flex items-center font-medium">
              <MapPin className="mr-2 h-4 w-4 text-gray-500" />
              Areas Covered
            </Label>
            <Input 
              id="areas_covered" 
              placeholder="Andheri, Powai, Churchgate" 
              className="focus:border-[#a98cc8] focus:ring-[#a98cc8]"
              value={formData.areas_covered}
              onChange={(e) => setFormData({...formData, areas_covered: e.target.value})}
            />
          </div>
        </div>
        <DialogFooter className="pt-6 gap-3">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)} 
            disabled={isLoading}
            className="min-w-[100px]"
          >
            Cancel
          </Button>
          <Button 
            className="bg-[#a98cc8] hover:bg-[#9678b4] min-w-[140px]" 
            onClick={handleAddTherapist}
            disabled={isLoading || !formData.name || !formData.email}
          >
            {isLoading ? "Saving..." : "Save Therapist"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}