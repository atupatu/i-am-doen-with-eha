//api for a user to view all therapists assigned to them.

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(
  req: NextRequest,
  { params }: { params: { uid: string } }
) {
  const uid = params.uid
  if (!uid) return NextResponse.json({ error: 'User ID missing' }, { status: 400 })

  const { data, error } = await supabase
    .from('assignments')
    .select('therapist_tid, therapists(name, tid)')
    .eq('client_uid', uid)
    .eq('status', 'active')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data.map(a => a.therapists))
}
