// app/api/reports/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    // Get optional query parameters for filtering
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1')
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10')
    const sortBy = request.nextUrl.searchParams.get('sort_by') || 'submitted_at'
    const sortOrder = request.nextUrl.searchParams.get('sort_order') || 'desc'
    
    // Calculate pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    // Fetch reports with related session, client, and therapist data
    const { data: reports, error: reportsError, count } = await supabase
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
      `, { count: 'exact' })
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(from, to)

    if (reportsError) {
      console.error("Supabase error:", reportsError)
      return NextResponse.json({ error: reportsError.message }, { status: 500 })
    }

    // Calculate total pages
    const totalPages = count ? Math.ceil(count / limit) : 0

    return NextResponse.json({
      reports,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count || 0,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })

  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json()
    
    // Validate required fields
    const { session_id, activities, mood_start, mood_end, engagement } = body
    
    if (!session_id || !activities || !mood_start || !mood_end || !engagement) {
      return NextResponse.json(
        { error: 'Missing required fields: session_id, activities, mood_start, mood_end, engagement' }, 
        { status: 400 }
      )
    }
    
    // Validate enum values
    const validMoodValues = ['not in good mood', 'neutral', 'in a good mood']
    const validEngagementValues = ['fully engaged', 'sometimes engaged', 'not engaged']
    
    if (!validMoodValues.includes(mood_start)) {
      return NextResponse.json(
        { error: `Invalid mood_start. Must be one of: ${validMoodValues.join(', ')}` }, 
        { status: 400 }
      )
    }
    
    if (!validMoodValues.includes(mood_end)) {
      return NextResponse.json(
        { error: `Invalid mood_end. Must be one of: ${validMoodValues.join(', ')}` }, 
        { status: 400 }
      )
    }
    
    if (!validEngagementValues.includes(engagement)) {
      return NextResponse.json(
        { error: `Invalid engagement. Must be one of: ${validEngagementValues.join(', ')}` }, 
        { status: 400 }
      )
    }
    
    // Validate that activities is an array
    if (!Array.isArray(activities)) {
      return NextResponse.json(
        { error: 'Activities must be an array' }, 
        { status: 400 }
      )
    }
    
    // Check if session exists
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('sid')
      .eq('sid', session_id)
      .single()
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Session not found' }, 
        { status: 404 }
      )
    }
    
    // Check if report already exists for this session
    const { data: existingReport, error: existingReportError } = await supabase
      .from('reports')
      .select('report_id')
      .eq('session_id', session_id)
    
    if (existingReportError) {
      console.error("Error checking existing report:", existingReportError)
    }
    
    if (existingReport && existingReport.length > 0) {
      return NextResponse.json(
        { error: 'A report already exists for this session' }, 
        { status: 409 }
      )
    }
    
    // Insert the new report
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .insert({
        session_id,
        activities,
        mood_start,
        mood_end,
        engagement,
        key_observations: body.key_observations || null,
        overall_comments: body.overall_comments || null,
        improvements_or_challenges: body.improvements_or_challenges || null,
        submitted_at: new Date().toISOString()
      })
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
    
    // Update session to mark that a report has been submitted
    const { error: updateSessionError } = await supabase
      .from('sessions')
      .update({ 
        report_submitted_at: new Date().toISOString() 
      })
      .eq('sid', session_id)
    
    if (updateSessionError) {
      console.error("Error updating session:", updateSessionError)
      // We don't return an error here since the report was created successfully
    }
    
    return NextResponse.json({ 
      message: 'Report created successfully',
      report 
    }, { status: 201 })
    
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}