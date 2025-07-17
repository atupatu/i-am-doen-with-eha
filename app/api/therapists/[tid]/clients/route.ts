//api to get all clients of a particular therapist
//app/api/therapists/[tid]/clients/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// GET - Fetch clients assigned to a specific therapist
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ tid: string }> }
) {
  try {
    // Await the params object before accessing its properties
    const params = await context.params
    const tid = params.tid
    
    // Verify therapist exists
    const { data: therapist, error: therapistError } = await supabase
      .from('therapists')
      .select('tid, name')
      .eq('tid', tid)
      .single()
    
    if (therapistError || !therapist) {
      return NextResponse.json({ error: 'Therapist not found' }, { status: 404 })
    }
    
    // Get active assignments for this therapist
    const { data: assignments, error: assignmentsError } = await supabase
      .from('assignments')
      .select(`
        id,
        status,
        start_date,
        end_date,
        sessions_count,
        next_session_date,
        notes,
        client:users!fk_assignment_client(uid, name, email)
      `)
      .eq('therapist_tid', tid)
      .eq('status', 'active')
      .order('start_date', { ascending: false })
    
    if (assignmentsError) {
      return NextResponse.json({ error: assignmentsError.message }, { status: 500 })
    }
    
    // Transform data to focus on clients
    const clients = assignments?.map(assignment => ({
      uid: assignment.client.uid,
      name: assignment.client.name,
      email: assignment.client.email,
      assignment: {
        id: assignment.id,
        status: assignment.status,
        start_date: assignment.start_date,
        end_date: assignment.end_date,
        sessions_count: assignment.sessions_count,
        next_session_date: assignment.next_session_date,
        notes: assignment.notes
      }
    })) || []
    
    return NextResponse.json({
      therapist: {
        tid: therapist.tid,
        name: therapist.name
      },
      clients
    })
    
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}