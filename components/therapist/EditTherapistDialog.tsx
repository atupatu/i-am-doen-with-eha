"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface EditTherapistDialogProps {
  therapist: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onTherapistUpdated: (updatedTherapist: any) => void
}

export function EditTherapistDialog({ therapist, open, onOpenChange, onTherapistUpdated }: EditTherapistDialogProps) {
  const [formData, setFormData] = useState({
    name: therapist.name,
    email: therapist.email,
    info: therapist.info || "",
    availability_hours: therapist.availability_hours || 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpdate = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/therapists/${therapist.tid}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          info: formData.info,
          availability_hours: formData.availability_hours,
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update therapist')
      }

      const result = await response.json()
      onTherapistUpdated(result.data)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update therapist')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Therapist</DialogTitle>
          <DialogDescription>
            Update the details of {therapist.name}
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
              className="col-span-3" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="specialty" className="text-right">
              Specialty
            </Label>
            <Input 
              id="specialty" 
              className="col-span-3" 
              value={formData.info}
              onChange={(e) => setFormData({...formData, info: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="availability" className="text-right">
              Availability (hours/week)
            </Label>
            <Input 
              id="availability" 
              type="number"
              className="col-span-3" 
              value={formData.availability_hours}
              onChange={(e) => setFormData({...formData, availability_hours: parseInt(e.target.value) || 0})}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            className="bg-[#a98cc8] hover:bg-[#9678b4]" 
            onClick={handleUpdate}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Therapist"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}