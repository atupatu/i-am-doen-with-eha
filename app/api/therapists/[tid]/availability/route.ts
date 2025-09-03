// api/therapists/[tid]/availability/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { format, getDay } from 'date-fns'

// GET /api/therapists/[tid]/availability?date=2024-01-15
export async function GET(req: NextRequest, { params }: { params: { tid: string } }) {
  try {
    const { tid } = params
    const { searchParams } = new URL(req.url)
    const dateParam = searchParams.get('date')
    
    if (!dateParam) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 })
    }
    
    const requestedDate = new Date(dateParam)
    const dayOfWeek = getDay(requestedDate) // 0 = Sunday, 1 = Monday, etc.
    
    // Get therapist's schedule for the requested day
    const { data: schedules, error: scheduleError } = await supabase
      .from('therapist_schedule')
      .select('schedule_id, start_time, end_time')
      .eq('tid', tid)
      .eq('day_of_week', dayOfWeek)
      .order('start_time', { ascending: true })
    
    if (scheduleError) throw scheduleError
    
    if (!schedules || schedules.length === 0) {
      return NextResponse.json([]) // No schedule for this day
    }
    
    // Get existing sessions for this therapist on this date
    const { data: existingSessions, error: sessionsError } = await supabase
      .from('sessions')
      .select('start_time, end_time, status')
      .eq('tid', tid)
      .eq('scheduled_date', dateParam)
      .in('status', ['pending', 'approved']) // Don't block declined/completed sessions
    
    if (sessionsError) throw sessionsError
    
    // Convert schedule slots to available time slots
    const availableSlots = schedules.map(schedule => {
      // Check if this time slot is already booked
      const isBooked = existingSessions?.some(session => 
        session.start_time === schedule.start_time && 
        session.end_time === schedule.end_time
      ) || false
      
      return {
        id: `${schedule.schedule_id}-${dateParam}`,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        date: dateParam,
        available: !isBooked
      }
    })
    
    return NextResponse.json(availableSlots)
    
  } catch (error: any) {
    console.error('Error fetching therapist availability:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}