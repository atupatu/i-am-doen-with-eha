import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// GET /api/sessions/
export async function GET(req: NextRequest) {
    try {
     
  
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          users (uid, name, email),
          therapists (tid, name, email)
        `)
        .order('scheduled_date', { ascending: false })
        .order('start_time', { ascending: true })
      
      if (error) throw error
      
      return NextResponse.json({ sessions: data })
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

/* api for user to book a session.- it will only allow for those therapists which
are assigned to them. */

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { uid, tid, scheduled_date, start_time, end_time } = body

  if (!uid || !tid || !scheduled_date || !start_time || !end_time)
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const { data: assignment } = await supabase
    .from('assignments')
    .select()
    .eq('client_uid', uid)
    .eq('therapist_tid', tid)
    .eq('status', 'active')
    .single()

  if (!assignment) return NextResponse.json({ error: 'Therapist not assigned' }, { status: 403 })

  const { data: conflicts, error: conflictError } = await supabase
    .from('sessions')
    .select()
    .eq('tid', tid)
    .eq('scheduled_date', scheduled_date)
    .or(`start_time.lte.${end_time},end_time.gte.${start_time}`)

  if (conflictError) return NextResponse.json({ error: conflictError.message }, { status: 500 })

  if (conflicts.length > 0)
    return NextResponse.json({ error: 'Time slot already booked' }, { status: 409 })

  const { error } = await supabase.from('sessions').insert([{
    uid,
    tid,
    scheduled_date,
    start_time,
    end_time,
    status: 'pending'
  }])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
