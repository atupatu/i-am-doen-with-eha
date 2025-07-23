//this is component which is connected to post api for therapist

"use client"

import { useState } from "react"
import { UserCog } from "lucide-react"
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
    specialty: "",
    availability: "",
    bio: ""
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
          info: formData.specialty,
          availability_hours: parseInt(formData.availability) || 0,
        })
      })

      if (!response.ok) {
        throw new Error('Failed to add therapist')
      }

      const result = await response.json()
      onTherapistAdded(result.data[0])
      setIsOpen(false)
      setFormData({
        name: "",
        email: "",
        phone: "",
        specialty: "",
        availability: "",
        bio: ""
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add therapist')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#a98cc8] hover:bg-[#9678b4]">
          <UserCog className="mr-2 h-4 w-4" />
          Add New Therapist
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Therapist</DialogTitle>
          <DialogDescription>
            Enter the details of the new therapist. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {error && <div className="text-red-500 text-sm p-2">{error}</div>}
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input 
              id="name" 
              placeholder="Dr. John Doe" 
              className="col-span-3" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input 
              id="email" 
              placeholder="john@example.com" 
              className="col-span-3" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input 
              id="phone" 
              placeholder="+1 (555) 123-4567" 
              className="col-span-3" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="specialty" className="text-right">
              Specialty
            </Label>
            <Input 
              id="specialty" 
              placeholder="Cognitive Behavioral Therapy" 
              className="col-span-3" 
              value={formData.specialty}
              onChange={(e) => setFormData({...formData, specialty: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="availability" className="text-right">
              Availability (hours/week)
            </Label>
            <Input 
              id="availability" 
              type="number"
              placeholder="20" 
              className="col-span-3" 
              value={formData.availability}
              onChange={(e) => setFormData({...formData, availability: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bio" className="text-right">
              Bio
            </Label>
            <Textarea 
              id="bio" 
              placeholder="Professional background and experience..." 
              className="col-span-3" 
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            className="bg-[#a98cc8] hover:bg-[#9678b4]" 
            onClick={handleAddTherapist}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Therapist"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}