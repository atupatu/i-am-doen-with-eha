// // lib/therapist-actions.ts
// 'use server'

// import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
// import { cookies } from 'next/headers'

// interface TimeSlot {
//   start: string
//   end: string
// }

// interface DayAvailability {
//   isAvailable: boolean
//   timeSlots: TimeSlot[]
// }

// interface WeeklyAvailability {
//   monday: DayAvailability
//   tuesday: DayAvailability
//   wednesday: DayAvailability
//   thursday: DayAvailability
//   friday: DayAvailability
//   saturday: DayAvailability
//   sunday: DayAvailability
//   maxHoursPerWeek: number
// }

// export async function updateTherapistAvailability(availability: WeeklyAvailability) {
//   const supabase = createServerComponentClient({ cookies })
//   const { data: { session } } = await supabase.auth.getSession()

//   if (!session) {
//     throw new Error('Not authenticated')
//   }

//   const { data: therapist, error: therapistError } = await supabase
//     .from('therapists')
//     .select('tid')
//     .eq('user_id', session.user.id)
//     .single()

//   if (therapistError || !therapist) {
//     throw new Error('Therapist not found')
//   }

//   const response = await fetch(`http://localhost:3000/api/therapists/${therapist.tid}`, {
//     method: 'PATCH',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${session.access_token}`,
//     },
//     body: JSON.stringify({
//       availability,
//       availability_hours: availability.maxHoursPerWeek,
//     }),
//   })

//   if (!response.ok) {
//     const errorData = await response.json()
//     throw new Error(errorData.error || 'Failed to update availability')
//   }

//   return await response.json()
// }

// lib/therapist-actions.ts
'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

interface TimeSlot {
  start: string
  end: string
}

interface DayAvailability {
  isAvailable: boolean
  timeSlots: TimeSlot[]
}

interface WeeklyAvailability {
  monday: DayAvailability
  tuesday: DayAvailability
  wednesday: DayAvailability
  thursday: DayAvailability
  friday: DayAvailability
  saturday: DayAvailability
  sunday: DayAvailability
  maxHoursPerWeek: number
}

export async function updateTherapistAvailability(availability: WeeklyAvailability) {
const cookieStore = cookies() // ✅ No await here
const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    throw new Error('Not authenticated')
  }

  const { data: therapist, error: therapistError } = await supabase
    .from('therapists')
    .select('tid')
    .eq('user_id', session.user.id)
    .single()

  if (therapistError || !therapist) {
    throw new Error('Therapist not found')
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/therapists/${therapist.tid}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      availability: availability,
      availability_hours: availability.maxHoursPerWeek,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to update availability')
  }

  return await response.json()
}