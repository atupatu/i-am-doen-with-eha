//api to get schedule of a particular therapist

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
export async function GET(
  req: NextRequest,
  { params }: { params: { tid: string } }
) {
  const tid = params.tid
  if (!tid) return NextResponse.json({ error: 'Therapist ID missing' }, { status: 400 })

  const { data, error } = await supabase
    .from('therapist_schedule')
    .select()
    .eq('tid', tid)
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}
