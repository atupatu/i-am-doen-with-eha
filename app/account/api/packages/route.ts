import { supabase } from '@/lib/supabaseClient'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase.from('packages').select('*')
    if (error) throw error

    return NextResponse.json({ packages: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
