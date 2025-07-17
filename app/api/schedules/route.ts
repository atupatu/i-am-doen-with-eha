// schedules/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// GET /api/schedules - Get all schedules (for admin)
export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('therapist_schedule')
      .select(`
        schedule_id,
        tid,
        day_of_week,
        start_time,
        end_time,
        therapists (tid, name, email)
      `)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true })
    
    if (error) throw error
    
    return NextResponse.json({ schedules: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}