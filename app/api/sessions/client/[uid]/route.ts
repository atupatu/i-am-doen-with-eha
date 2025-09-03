import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

interface TherapistAssignment {
  tid: string
  name: string
  assignment: {
    id: string
    status: string
    start_date: string
    end_date: string | null
    sessions_count: number
    next_session_date: string | null
    notes: string | null
  }
}

// API for user to view all their sessions and assigned therapists
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ uid: string }> }
) {
  try {
    // Get auth token from headers
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
            
    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const params = await context.params
    const uid = params.uid

    // Authorization: Ensure the authenticated user is accessing their own data
    if (user.id !== uid) {
      return NextResponse.json({ error: 'Forbidden - You can only access your own data' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const countOnly = searchParams.get('count') === 'true'
    const includeTherapists = searchParams.get('therapists') === 'true'

    // 1️⃣ Verify client exists
    const { data: client, error: clientError } = await supabase
      .from('users')
      .select('uid, name')
      .eq('uid', uid)
      .single()

    if (clientError || !client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    if (countOnly) {
      const { count, error } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true })
        .eq('uid', uid)
            
      if (error) throw error
      return NextResponse.json({ count })
    }

    // 2️⃣ Fetch sessions with therapist details
    const { data: sessions, error: sessionsError } = await supabase
      .from('sessions')
      .select(`
        *,
        therapists(name)
      `)
      .eq('uid', uid)
      .order('scheduled_date', { ascending: false })

    if (sessionsError) {
      console.error('Sessions error:', sessionsError)
      throw sessionsError
    }

    let therapists: TherapistAssignment[] = []
    
    // 3️⃣ Fetch assigned therapists if requested
    if (includeTherapists) {
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
          therapist:therapists!fk_assignment_therapist(tid, name)
        `)
        .eq('client_uid', uid)
        .eq('status', 'active')
        .order('start_date', { ascending: false })

      if (assignmentsError) {
        console.error('Assignments error:', assignmentsError)
        return NextResponse.json({ error: assignmentsError.message }, { status: 500 })
      }

      // 4️⃣ Transform assignments data to focus on therapists
      therapists = assignments?.map(assignment => ({
        tid: assignment.therapist.tid,
        name: assignment.therapist.name,
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
    }

    console.log('API Response data:', JSON.stringify(sessions, null, 2))
    
    // 5️⃣ Return result based on what was requested
    const baseResponse = {
      client: {
        uid: client.uid,
        name: client.name
      },
      sessions,
      requestedBy: user?.id
    }

    const response = includeTherapists 
      ? { ...baseResponse, therapists }
      : baseResponse

    return NextResponse.json(response)
    
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}