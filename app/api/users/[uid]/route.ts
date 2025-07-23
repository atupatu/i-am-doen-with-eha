// app/api/users/[uid]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ uid: string }> }
) {
  try {
    const params = await context.params  // Await params first
    const uid = params.uid

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('uid', uid)
      .single()

    if (error) throw error
    return NextResponse.json({ data }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ uid: string }> }
) {
  try {
    const params = await context.params  // Await params first
    const uid = params.uid
    const body = await req.json()

    const { data, error } = await supabase
      .from('users')
      .update(body)
      .eq('uid', uid)

    if (error) throw error
    return NextResponse.json({ message: 'User updated', data }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ uid: string }> }
) {
  try {
    const params = await context.params  // Await params first
    const uid = params.uid
    
    const { error } = await supabase.from('users').delete().eq('uid', uid)
    if (error) throw error
    return NextResponse.json({ message: `User ${uid} deleted` }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}