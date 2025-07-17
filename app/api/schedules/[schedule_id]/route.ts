// schedules/[schedule_id]/route.ts
// For updating/deleting specific schedule slots by schedule_id
// ==========================================
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// PATCH /api/schedules/[schedule_id] - Update specific schedule slot
export async function PATCH(req: NextRequest, { params }: { params: { schedule_id: string } }) {
  try {
    const { schedule_id } = params
    const body = await req.json()
    const { day_of_week, start_time, end_time } = body
    
    // Check if schedule exists
    const { data: existingSchedule } = await supabase
      .from('therapist_schedule')
      .select('*')
      .eq('schedule_id', schedule_id)
      .single()
    
    if (!existingSchedule) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 })
    }
    
    // Use existing values if not provided in body
    const newDayOfWeek = day_of_week !== undefined ? day_of_week : existingSchedule.day_of_week
    const newStartTime = start_time || existingSchedule.start_time
    const newEndTime = end_time || existingSchedule.end_time
    
    // Validate new values
    if (newDayOfWeek < 0 || newDayOfWeek > 6) {
      return NextResponse.json(
        { error: 'day_of_week must be between 0 (Sunday) and 6 (Saturday)' },
        { status: 400 }
      )
    }
    
    if (newStartTime >= newEndTime) {
      return NextResponse.json(
        { error: 'start_time must be before end_time' },
        { status: 400 }
      )
    }
    
    // Check for overlapping schedules (excluding current one)
    const { data: overlapping } = await supabase
      .from('therapist_schedule')
      .select('*')
      .eq('tid', existingSchedule.tid)
      .eq('day_of_week', newDayOfWeek)
      .or(`start_time.lte.${newEndTime},end_time.gte.${newStartTime}`)
      .neq('schedule_id', schedule_id)
    
    if (overlapping && overlapping.length > 0) {
      return NextResponse.json(
        { error: 'Schedule overlaps with existing time slot' },
        { status: 400 }
      )
    }
    
    // Update schedule (much simpler now!)
    const { data, error } = await supabase
      .from('therapist_schedule')
      .update({
        day_of_week: newDayOfWeek,
        start_time: newStartTime,
        end_time: newEndTime
      })
      .eq('schedule_id', schedule_id)
      .select()
    
    if (error) throw error
    
    return NextResponse.json({ schedule: data[0] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/schedules/[schedule_id] - Delete specific schedule slot
export async function DELETE(req: NextRequest, { params }: { params: { schedule_id: string } }) {
  try {
    const { schedule_id } = params
    
    // Check if schedule exists
    const { data: existingSchedule } = await supabase
      .from('therapist_schedule')
      .select('*')
      .eq('schedule_id', schedule_id)
      .single()
    
    if (!existingSchedule) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 })
    }
    
    // Check if schedule is linked to any sessions
    const { data: sessionsWithSchedule } = await supabase
      .from('sessions')
      .select('sid, scheduled_date, start_time, status')
      .eq('tid', existingSchedule.tid)
      .eq('start_time', existingSchedule.start_time)
      .in('status', ['pending', 'approved']) // Only check active sessions
      .limit(1)
    
    if (sessionsWithSchedule && sessionsWithSchedule.length > 0) {
      const session = sessionsWithSchedule[0]
      const sessionDate = new Date(session.scheduled_date)
      const sessionDay = sessionDate.getDay() // 0 = Sunday, 6 = Saturday
      
      // Check if the session day matches the schedule day
      if (sessionDay === existingSchedule.day_of_week) {
        return NextResponse.json(
          { 
            error: 'Cannot delete schedule that has active sessions linked to it',
            details: `Found ${session.status} session on ${session.scheduled_date} at ${session.start_time}`
          },
          { status: 400 }
        )
      }
    }
    
    // Delete schedule
    const { error } = await supabase
      .from('therapist_schedule')
      .delete()
      .eq('schedule_id', schedule_id)
    
    if (error) throw error
    
    return NextResponse.json({ message: 'Schedule deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}