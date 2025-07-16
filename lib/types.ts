export interface AppointmentProps {
    id: number
    date: string
    time: string
    therapist: string
    type: string
    notes: string
    report?: string
  }
  
  export interface TherapistProps {
    id: number
    name: string
    specialty: string
    experience: string
    image: string
  }
  