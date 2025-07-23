//this code is the component which is connected to  delete api

"use client"

import { useState } from "react"
import { Calendar, Edit, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { EditTherapistDialog } from "./EditTherapistDialog"

interface TherapistActionsProps {
  therapist: any
  onTherapistUpdated: (updatedTherapist: any) => void
  onTherapistDeleted: (tid: string) => void
}

export function TherapistActions({ therapist, onTherapistUpdated, onTherapistDeleted }: TherapistActionsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete ${therapist.name}?`)) {
      try {
        const response = await fetch(`/api/therapists/${therapist.tid}`, {
          method: 'DELETE'
        })

        if (!response.ok) {
          throw new Error('Failed to delete therapist')
        }

        onTherapistDeleted(therapist.tid)
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to delete therapist')
      }
    }
  }

  return (
    <>
      <div className="flex justify-end gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => router.push(`/admin/schedule?therapist=${therapist.tid}`)}
        >
          <Calendar className="h-4 w-4" />
          <span className="sr-only">View schedule</span>
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => setIsEditDialogOpen(true)}
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
              Edit therapist
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
              Delete therapist
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <EditTherapistDialog
        therapist={therapist}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onTherapistUpdated={onTherapistUpdated}
      />
    </>
  )
}