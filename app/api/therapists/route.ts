// app/api/therapists/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('therapists')
      .select('*')

    if (error) throw error

    return NextResponse.json({ therapists: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, info, availability_hours, user_id } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const { data, error } = await supabase.from('therapists').insert([
      {
        name,
        email,
        info,
        availability_hours,
        user_id,
      },
    ])

    if (error) throw error
    return NextResponse.json({ message: 'Therapist created', data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
