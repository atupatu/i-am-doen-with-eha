//api for user to view all their sessions
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// Modified version that could return count or full data
export async function GET(
  req: NextRequest,
  { params }: { params: { uid: string } }
) {
  const { uid } = params
  const { searchParams } = new URL(req.url)
  const countOnly = searchParams.get('count') === 'true'

  if (countOnly) {
    const { count, error } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('uid', uid)
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ count })
  }

  // Existing logic for full data
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('uid', uid)
    .order('scheduled_date', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}