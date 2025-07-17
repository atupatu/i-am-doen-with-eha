//api for user to view all their sessions
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(
  req: NextRequest,
  { params }: { params: { uid: string } }
) {
  const { uid } = params

  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('uid', uid)
    .order('scheduled_date', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}
