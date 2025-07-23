export interface Client {
  uid: string
  name: string
  email: string
}

export interface Therapist {
  tid: string
  name: string
}

export interface Assignment {
  id: string
  client: Client
  therapist: Therapist
  status: string
  start_date: string
  notes: string | null
}

export interface AvailableClient {
  uid: string
  name: string
  email: string
}

export interface AvailableTherapist {
  tid: string
  name: string
}

export interface AssignmentFormData {
  client_uid: string
  therapist_tid: string
  start_date: string
  notes: string | null
  status?: string
}