// //api for therapist to view all their sessions
// import { NextRequest, NextResponse } from 'next/server'
// import { supabase } from '@/lib/supabaseClient'

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { tid: string } }
// ) {
//   const { tid } = params

//   const { data, error } = await supabase
//     .from('sessions')
//     .select('*')
//     .eq('tid', tid)
//     .order('scheduled_date', { ascending: false })

//   if (error) return NextResponse.json({ error: error.message }, { status: 500 })

//   return NextResponse.json(data)
// }

// api/sessions/therapist/[tid]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ tid: string }> }
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
    const tid = params.tid

    // Authorization: Ensure the authenticated user is the therapist requesting their sessions
    if (user.id !== tid) {
      return NextResponse.json({ error: 'Forbidden - You can only access your own sessions' }, { status: 403 })
    }

    const { data, error } = await supabase
      .from('sessions')
      .select(`
        *,
        users!sessions_uid_fkey (
          name,
          email
        )
      `)
      .eq('tid', tid)
      .order('scheduled_date', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({
      data,
      requestedBy: user?.id
    }, { status: 200 })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PATCH method to update session status
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ tid: string }> }
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
    const tid = params.tid

    // Authorization: Ensure the authenticated user is the therapist
    if (user.id !== tid) {
      return NextResponse.json({ error: 'Forbidden - You can only modify your own sessions' }, { status: 403 })
    }

    const body = await req.json()
    const { sid, status } = body

    if (!sid) {
      return NextResponse.json({ error: 'Session ID (sid) is required' }, { status: 400 })
    }

    if (!status || !['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return NextResponse.json({ 
        error: 'Valid status is required. Use: pending, confirmed, cancelled, or completed' 
      }, { status: 400 })
    }

    const updateData = {
      status,
      verified: status === 'confirmed'
    }

    const { data, error } = await supabase
      .from('sessions')
      .update(updateData)
      .eq('sid', sid)
      .eq('tid', tid) // Double-check ownership
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      message: `Session status updated to ${status}`,
      data,
      updatedBy: user?.id
    }, { status: 200 })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}