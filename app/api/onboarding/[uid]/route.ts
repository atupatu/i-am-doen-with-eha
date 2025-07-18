import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const { uid } = await params
    
    // Fetch user's onboarding data
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const { uid } = await params
    const updates = await request.json()
    
    // Perform partial update
    const { data, error } = await supabase
      .from('users')
      .update({ 
        form_response: updates 
      })
      .eq('uid', uid)
      .select()

    if (error) throw error
    return NextResponse.json(data[0].form_response)
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update onboarding data' },
      { status: 500 }
    )
  }
}