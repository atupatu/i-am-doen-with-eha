// app/api/reports/bySession/[sid]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(
  request: NextRequest,
  { params }: { params: { sid: string } }
) {
  try {
    const sessionId = parseInt(params.sid)

    if (isNaN(sessionId)) {
      return NextResponse.json({ error: 'Invalid session ID' }, { status: 400 })
    }

    // Fetch report by session ID
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .select(`
        *,
        session:sessions(
          sid,
          scheduled_date,
          start_time,
          end_time,
          status,
          verified,
          client:users(uid, name, email),
          therapist:therapists(tid, name, email)
        )
      `)
      .eq('session_id', sessionId)
      .single()

    if (reportError) {
      if (reportError.code === 'PGRST116') { // No rows returned
        return NextResponse.json({ error: 'Report not found for this session' }, { status: 404 })
      }
      console.error("Supabase error:", reportError)
      return NextResponse.json({ error: reportError.message }, { status: 500 })
    }

    return NextResponse.json({ report })

  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { sid: string } }
) {
  try {
    const sessionId = parseInt(params.sid)

    if (isNaN(sessionId)) {
      return NextResponse.json({ error: 'Invalid session ID' }, { status: 400 })
    }

    // Parse the request body
    const body = await request.json()
    
    // Validate enum values if provided
    const validMoodValues = ['not in good mood', 'neutral', 'in a good mood']
    const validEngagementValues = ['fully engaged', 'sometimes engaged', 'not engaged']
    
    if (body.mood_start && !validMoodValues.includes(body.mood_start)) {
      return NextResponse.json(
        { error: `Invalid mood_start. Must be one of: ${validMoodValues.join(', ')}` }, 
        { status: 400 }
      )
    }
    
    if (body.mood_end && !validMoodValues.includes(body.mood_end)) {
      return NextResponse.json(
        { error: `Invalid mood_end. Must be one of: ${validMoodValues.join(', ')}` }, 
        { status: 400 }
      )
    }
    
    if (body.engagement && !validEngagementValues.includes(body.engagement)) {
      return NextResponse.json(
        { error: `Invalid engagement. Must be one of: ${validEngagementValues.join(', ')}` }, 
        { status: 400 }
      )
    }
    
    // Validate that activities is an array if provided
    if (body.activities && !Array.isArray(body.activities)) {
      return NextResponse.json(
        { error: 'Activities must be an array' }, 
        { status: 400 }
      )
    }

    // Check if report exists for this session
    const { data: existingReport, error: checkError } = await supabase
      .from('reports')
      .select('report_id')
      .eq('session_id', sessionId)
      .single()

    if (checkError || !existingReport) {
      return NextResponse.json({ error: 'Report not found for this session' }, { status: 404 })
    }

    // Update the report
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .update({
        ...body,
        submitted_at: new Date().toISOString() // Update timestamp on modification
      })
      .eq('session_id', sessionId)
      .select(`
        *,
        session:sessions(
          sid,
          scheduled_date,
          start_time,
          end_time,
          status,
          verified,
          client:users(uid, name, email),
          therapist:therapists(tid, name, email)
        )
      `)
      .single()

    if (reportError) {
      console.error("Supabase error:", reportError)
      return NextResponse.json({ error: reportError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Report updated successfully',
      report 
    })

  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}