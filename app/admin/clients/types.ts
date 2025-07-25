// Type definitions(All TypeScript interfaces)
export interface User {
  uid: string
  name: string | null
  email: string | null
  phone: string | null
  form_response: any | null
  assigned_tid: string | null
  created_at: string | null
  is_active: boolean
  call_request_status: 'pending' | 'completed' | 'none' | null
}

export interface Therapist {
  tid: string
  name: string
  email: string
  info: string | null
  availability_hours: number | null
  created_at: string | null
  user_id: string | null
}

export interface Notification {
  message: string
  details?: string
}

export interface FormData {
  name: string
  email: string
  phone: string
  // assigned_tid: string
  is_active: boolean
  call_request_status: 'pending' | 'completed' | 'none'
  form_response: string
}

// Type for the structured form response data
export interface FormResponseData {
  seniorName?: string
  preferredName?: string
  diagnosis?: string
  otherDiagnosis?: string
  timeSlots?: string
  address?: string
  language?: string
  otherLanguage?: string
  dob?: string
  birthPlace?: string
  family?: string
  educationHistory?: string
  workHistory?: string
  spouseName?: string
  meetingDetails?: string
  children?: string
  grandchildren?: string
  historicalEvent?: string
  hobbies?: string
  currentEnjoyment?: string
  readingPreferences?: string
  favColor?: string
  musicTaste?: string
  favFood?: string
  routine?: string
  carerName?: string
  carerPhone?: string
  invoiceEmail?: string
  payerPhone?: string
}