import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const { uid } = await params
    
    // Fetch any user's onboarding data
    const { data, error } = await supabase
      .from('users')
      .select('form_response')
      .eq('uid', uid)
      .single()

    if (error) throw error
    return NextResponse.json(data?.form_response || {})
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch onboarding data' },
      { status: 500 }
    )
  }
}