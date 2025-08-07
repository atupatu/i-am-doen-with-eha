// //To fetch a particular client's assigned therapists
// //app/api/users/[uid]/therapists/route.ts
// import { NextRequest, NextResponse } from 'next/server'
// import { supabase } from '@/lib/supabaseClient'

// // GET - Fetch therapists assigned to a specific client
// export async function GET(
//   request: NextRequest,
//   context: { params: Promise<{ uid: string }> }
// ) {
//   try {
//     const params = await context.params
//     const uid = params.uid
    
//     // Verify client exists
//     const { data: client, error: clientError } = await supabase
//       .from('users')
//       .select('uid, name')
//       .eq('uid', uid)
//       .single()

//     if (clientError || !client) {
//       return NextResponse.json({ error: 'Client not found' }, { status: 404 })
//     }

//     // Get active assignments for this client
//     const { data: assignments, error: assignmentsError } = await supabase
//       .from('assignments')
//       .select(`
//         id,
//         status,
//         start_date,
//         end_date,
//         sessions_count,
//         next_session_date,
//         notes,
//         therapist:therapists!fk_assignment_therapist(tid, name)
//       `)
//       .eq('client_uid', uid)
//       .eq('status', 'active')
//       .order('start_date', { ascending: false })

//     if (assignmentsError) {
//       return NextResponse.json({ error: assignmentsError.message }, { status: 500 })
//     }

//     // Transform data to focus on therapists
//     const therapists = assignments?.map(assignment => ({
//       tid: assignment.therapist.tid,
//       name: assignment.therapist.name,
//       assignment: {
//         id: assignment.id,
//         status: assignment.status,
//         start_date: assignment.start_date,
//         end_date: assignment.end_date,
//         sessions_count: assignment.sessions_count,
//         next_session_date: assignment.next_session_date,
//         notes: assignment.notes
//       }
//     })) || []

//     return NextResponse.json({ 
//       client: {
//         uid: client.uid,
//         name: client.name
//       },
//       therapists 
//     })

//   } catch (error) {
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
//   }
// }

//To fetch a particular client's assigned therapists
//app/api/users/[uid]/therapists/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// GET - Fetch therapists assigned to a specific client
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ uid: string }> }
) {
  try {
    // Get auth token from headers
    const authHeader = request.headers.get('authorization')
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

    // Verify client exists
    const { data: client, error: clientError } = await supabase
      .from('users')
      .select('uid, name')
      .eq('uid', uid)
      .single()

    if (clientError || !client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // Get active assignments for this client
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
      return NextResponse.json({ error: assignmentsError.message }, { status: 500 })
    }

    // Transform data to focus on therapists
    const therapists = assignments?.map(assignment => ({
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

    return NextResponse.json({ 
      client: {
        uid: client.uid,
        name: client.name
      },
      therapists,
      requestedBy: user?.id
    })

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}