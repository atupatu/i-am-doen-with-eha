// app/api/packages/[pid]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { pid: string } }
) {
  try {
    const pid = parseInt(params.pid)
    const body = await req.json()
    const { name, description, cost, duration, min_commitment } = body

    const { data, error } = await supabase
      .from('packages')
      .update({ name, description, cost, duration, min_commitment })
      .eq('pid', pid)

    if (error) throw error
    return NextResponse.json({ message: 'Package updated', data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { pid: string } }
) {
  try {
    const pid = parseInt(params.pid)

    const { error } = await supabase.from('packages').delete().eq('pid', pid)

    if (error) throw error
    return NextResponse.json({ message: `Package ${pid} deleted` })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
