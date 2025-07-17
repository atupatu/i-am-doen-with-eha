// schedules/therapist/[tid]/route.ts
// For therapist-specific operations
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// GET /api/schedules/therapist/[tid] - Get therapist's schedule
export async function GET(req: NextRequest, { params }: { params: { tid: string } }) {
  try {
    const { tid } = params
    
    const { data, error } = await supabase
      .from('therapist_schedule')
      .select('schedule_id, tid, day_of_week, start_time, end_time')
      .eq('tid', tid)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true })
    
    if (error) throw error
    
    return NextResponse.json({ schedules: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/schedules/therapist/[tid] - Add new schedule slot
export async function POST(req: NextRequest, { params }: { params: { tid: string } }) {
  try {
    const { tid } = params
    const body = await req.json()
    const { day_of_week, start_time, end_time } = body
    
    // Validate required fields
    if (day_of_week === undefined || !start_time || !end_time) {
      return NextResponse.json(
        { error: 'Missing required fields: day_of_week, start_time, or end_time' },
        { status: 400 }
      )
    }
    
    // Validate day_of_week range
    if (day_of_week < 0 || day_of_week > 6) {
      return NextResponse.json(
        { error: 'day_of_week must be between 0 (Sunday) and 6 (Saturday)' },
        { status: 400 }
      )
    }
    
    // Validate time format and logic
    if (start_time >= end_time) {
      return NextResponse.json(
        { error: 'start_time must be before end_time' },
        { status: 400 }
      )
    }
    
    // Check if therapist exists
    const { data: therapist } = await supabase
      .from('therapists')
      .select('tid')
      .eq('tid', tid)
      .single()
    
    if (!therapist) {
      return NextResponse.json({ error: 'Therapist not found' }, { status: 404 })
    }
    
    // Check for overlapping schedules
    const { data: overlapping } = await supabase
      .from('therapist_schedule')
      .select('*')
      .eq('tid', tid)
      .eq('day_of_week', day_of_week)
      .or(`start_time.lte.${end_time},end_time.gte.${start_time}`)
    
    if (overlapping && overlapping.length > 0) {
      return NextResponse.json(
        { error: 'Schedule overlaps with existing time slot' },
        { status: 400 }
      )
    }
    
    // Insert new schedule
    const { data, error } = await supabase
      .from('therapist_schedule')
      .insert({
        tid,
        day_of_week,
        start_time,
        end_time
      })
      .select('schedule_id, tid, day_of_week, start_time, end_time')
    
    if (error) throw error
    
    return NextResponse.json({ message: 'Schedule created', schedule: data[0] }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}