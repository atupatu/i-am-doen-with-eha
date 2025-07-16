import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// GET /api/sessions/[id] - Get a specific session
export async function GET(req: NextRequest) {
    try {
     
  
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          users (uid, name, email),
          therapists (tid, name, email)
        `)
        .order('scheduled_date', { ascending: false })
        .order('start_time', { ascending: true })
      
      if (error) throw error
      
      return NextResponse.json({ sessions: data })
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }