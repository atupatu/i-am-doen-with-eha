//Helper functions for formatting and status badges
import { Therapist } from "./types"

export const getTherapistName = (tid: string | null, therapists: Therapist[]) => {
  if (!tid) return 'Unassigned'
  const therapist = therapists.find(t => t.tid === tid)
  return therapist ? therapist.name : 'Unknown Therapist'
}

export const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}

export const getInitials = (name: string | null) => {
  if (!name) return 'U'
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

export const getStatusInfo = (isActive: boolean, callStatus: string | null) => {
  if (!isActive) {
    return {
      variant: "secondary" as const,
      text: "Inactive",
      className: ""
    }
  }
  
  if (callStatus === 'pending') {
    return {
      variant: "default" as const,
      text: "Call Pending",
      className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    }
  }

  return {
    variant: "default" as const,
    text: "Active",
    className: "bg-green-100 text-green-800 hover:bg-green-100"
  }
}