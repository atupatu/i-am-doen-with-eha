// app/api/therapists/[tid]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// PATCH — Update therapist by ID
export async function PATCH(
  req: NextRequest,
  context: { params: { tid: string } }
) {
  try {
    const tid = context.params.tid
    const body = await req.json()
    const { name, email, info, availability_hours, user_id } = body

    const { data, error } = await supabase
      .from('therapists')
      .update({ name, email, info, availability_hours, user_id })
      .eq('tid', tid)

    if (error) throw error
    return NextResponse.json({ message: 'Therapist updated', data }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE — Remove therapist by ID
export async function DELETE(
  req: NextRequest,
  context: { params: { tid: string } }
) {
  try {
    const tid = context.params.tid

    const { error } = await supabase.from('therapists').delete().eq('tid', tid)

    if (error) throw error
    return NextResponse.json({ message: `Therapist ${tid} deleted` }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
