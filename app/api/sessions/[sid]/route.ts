//apis to edit and delete a session by their sid.

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'


export async function PATCH(
  req: NextRequest,
  { params }: { params: { sid: string } }
) {
  const sid = parseInt(params.sid)
  const body = await req.json()

  if (!sid) return NextResponse.json({ error: 'Session ID missing' }, { status: 400 })

  const { scheduled_date, start_time, end_time, tid } = body

  // Check for conflicts if rescheduling
  if (scheduled_date && start_time && end_time && tid) {
    const { data: conflicts, error: conflictError } = await supabase
      .from('sessions')
      .select('sid')
      .eq('tid', tid)
      .eq('scheduled_date', scheduled_date)
      .neq('sid', sid) // exclude current session
      .or(`start_time.lte.${end_time},end_time.gte.${start_time}`)

    if (conflictError)
      return NextResponse.json({ error: conflictError.message }, { status: 500 })

    if (conflicts.length > 0)
      return NextResponse.json({ error: 'Time slot overlaps with another session' }, { status: 409 })
  }

  const { data, error } = await supabase
    .from('sessions')
    .update(body)
    .eq('sid', sid)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}


export async function DELETE(
    req: NextRequest,
    { params }: { params: { sid: string } }
  ) {
    const sid = params.sid
  
    if (!sid) return NextResponse.json({ error: 'Session ID missing' }, { status: 400 })
  
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('sid', sid)
  
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  
    return NextResponse.json({ success: true, message: `Session ${sid} deleted` })
  }
  