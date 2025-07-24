"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AvailableClient, AvailableTherapist, Assignment } from "./types"

interface CreateAssignmentDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedClient: string
  onClientChange: (clientId: string) => void
  selectedTherapist: string
  onTherapistChange: (therapistId: string) => void
  startDate: string
  onStartDateChange: (date: string) => void
  notes: string
  onNotesChange: (notes: string) => void
  availableClients: AvailableClient[]
  availableTherapists: AvailableTherapist[]
  isCreating: boolean
  onSubmit: () => void
  onCancel: () => void
}

export default function CreateAssignmentDialog({
  isOpen,
  onOpenChange,
  selectedClient,
  onClientChange,
  selectedTherapist,
  onTherapistChange,
  startDate,
  onStartDateChange,
  notes,
  onNotesChange,
  availableClients,
  availableTherapists,
  isCreating,
  onSubmit,
  onCancel
}: CreateAssignmentDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Assign Client to Therapist</DialogTitle>
          <DialogDescription>
            Select a client and therapist to create a new assignment.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="client" className="text-right">
              Client
            </Label>
            <Select value={selectedClient} onValueChange={onClientChange}>
              <SelectTrigger className="col-span-3 text-left">
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {availableClients.map((client) => (
                  <SelectItem key={client.uid} value={client.uid}>
                    {client.name} ({client.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="therapist" className="text-right">
              Therapist
            </Label>
            <Select value={selectedTherapist} onValueChange={onTherapistChange}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select therapist" />
              </SelectTrigger>
              <SelectContent>
                {availableTherapists.map((therapist) => (
                  <SelectItem key={therapist.tid} value={therapist.tid}>
                    {therapist.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startDate" className="text-right">
              Start Date
            </Label>
            <Input
              id="startDate"
              type="date"
              className="col-span-3"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Textarea 
              id="notes" 
              placeholder="Session frequency, focus areas, etc." 
              className="col-span-3"
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            className="bg-[#a98cc8] hover:bg-[#9678b4]"
            onClick={onSubmit}
            disabled={isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Assignment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface EditAssignmentDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  editingAssignment: Assignment | null
  selectedClient: string
  onClientChange: (clientId: string) => void
  selectedTherapist: string
  onTherapistChange: (therapistId: string) => void
  startDate: string
  onStartDateChange: (date: string) => void
  notes: string
  onNotesChange: (notes: string) => void
  editStatus: string
  onStatusChange: (status: string) => void
  availableClients: AvailableClient[]
  availableTherapists: AvailableTherapist[]
  isUpdating: boolean
  onSubmit: () => void
  onCancel: () => void
}

export function EditAssignmentDialog({
  isOpen,
  onOpenChange,
  editingAssignment,
  selectedClient,
  onClientChange,
  selectedTherapist,
  onTherapistChange,
  startDate,
  onStartDateChange,
  notes,
  onNotesChange,
  editStatus,
  onStatusChange,
  availableClients,
  availableTherapists,
  isUpdating,
  onSubmit,
  onCancel
}: EditAssignmentDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Assignment</DialogTitle>
          <DialogDescription>
            Update the assignment details for {editingAssignment?.client.name} and {editingAssignment?.therapist.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-client" className="text-right">
              Client
            </Label>
            <Select value={selectedClient} onValueChange={onClientChange}>
              <SelectTrigger className="col-span-3 text-left">
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {availableClients.map((client) => (
                  <SelectItem key={client.uid} value={client.uid}>
                    {client.name} ({client.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-therapist" className="text-right">
              Therapist
            </Label>
            <Select value={selectedTherapist} onValueChange={onTherapistChange}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select therapist" />
              </SelectTrigger>
              <SelectContent>
                {availableTherapists.map((therapist) => (
                  <SelectItem key={therapist.tid} value={therapist.tid}>
                    {therapist.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-status" className="text-right">
              Status
            </Label>
            <Select value={editStatus} onValueChange={onStatusChange}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-startDate" className="text-right">
              Start Date
            </Label>
            <Input
              id="edit-startDate"
              type="date"
              className="col-span-3"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-notes" className="text-right">
              Notes
            </Label>
            <Textarea 
              id="edit-notes" 
              placeholder="Session frequency, focus areas, etc." 
              className="col-span-3"
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            className="bg-[#a98cc8] hover:bg-[#9678b4]"
            onClick={onSubmit}
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update Assignment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}