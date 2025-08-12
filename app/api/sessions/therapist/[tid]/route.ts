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
    
    if (userError) {
      return NextResponse.json({ error: 'Invalid token', details: userError.message }, { status: 401 })
    }
    
    if (!user) {
      return NextResponse.json({ error: 'No user found' }, { status: 401 })
    }

    const params = await context.params
    const requestedUserId = params.tid

    // Authorization: Ensure the authenticated user is the one requesting their sessions
    if (user.id !== requestedUserId) {
      return NextResponse.json({ error: 'Forbidden - You can only access your own sessions' }, { status: 403 })
    }

    // Get the therapist's tid from the therapists table
    const { data: therapistData, error: therapistError } = await supabase
      .from('therapists')
      .select('tid')
      .eq('user_id', user.id)
      .single()
    
    if (therapistError || !therapistData) {
      return NextResponse.json({ error: 'Therapist record not found' }, { status: 404 })
    }
    
    const therapistTid = therapistData.tid

    // Query sessions with user data
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        *,
        users!sessions_uid_fkey (
          name,
          email
        )
      `)
      .eq('tid', therapistTid)
      .order('scheduled_date', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({
      data: data || [],
      requestedBy: user?.id,
      count: data?.length || 0
    }, { status: 200 })

  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    }, { status: 500 })
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
    const requestedUserId = params.tid // This is actually the user ID from the URL

    // Authorization: Ensure the authenticated user is the one making the request
    if (user.id !== requestedUserId) {
      return NextResponse.json({ error: 'Forbidden - You can only modify your own sessions' }, { status: 403 })
    }

    // Get the therapist's actual tid from the therapists table
    const { data: therapistData, error: therapistError } = await supabase
      .from('therapists')
      .select('tid')
      .eq('user_id', user.id)
      .single()
    
    if (therapistError || !therapistData) {
      return NextResponse.json({ error: 'Therapist record not found' }, { status: 404 })
    }
    
    const therapistTid = therapistData.tid

    const body = await req.json()
    const { sid, status } = body

    if (!sid) {
      return NextResponse.json({ error: 'Session ID (sid) is required' }, { status: 400 })
    }

    if (!status || !['pending', 'approved', 'declined', 'completed'].includes(status)) {
      return NextResponse.json({ 
        error: 'Valid status is required. Use: pending, approved, declined, or completed' 
      }, { status: 400 })
    }

    const updateData = {
      status,
      verified: status === 'approved'
    }

    const { data, error } = await supabase
      .from('sessions')
      .update(updateData)
      .eq('sid', sid)
      .eq('tid', therapistTid) // Use the actual therapist tid, not user id
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      message: `Session status updated to ${status}`,
      data,
      updatedBy: user?.id
    }, { status: 200 })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}