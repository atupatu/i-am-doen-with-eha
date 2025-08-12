import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// API for user to view all their sessions
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ uid: string }> }
) {
  try {
    // Get auth token from headers
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
            
    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const params = await context.params
    const uid = params.uid

    // Authorization: Ensure the authenticated user is accessing their own sessions
    if (user.id !== uid) {
      return NextResponse.json({ error: 'Forbidden - You can only access your own sessions' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const countOnly = searchParams.get('count') === 'true'

    if (countOnly) {
      const { count, error } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true })
        .eq('uid', uid)
            
      if (error) throw error
      return NextResponse.json({ count })
    }

    // Simple join approach - Supabase should auto-detect the relationship
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        *,
        therapists(name)
      `)
      .eq('uid', uid)
      .order('scheduled_date', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    
    console.log('API Response data:', JSON.stringify(data, null, 2))
    return NextResponse.json(data)
    
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}