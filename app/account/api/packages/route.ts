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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { name, description, cost, duration, min_commitment } = body

    if (!name || !cost || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields: name, cost, or duration' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase.from('packages').insert([
      {
        name,
        description,
        cost,
        duration,
        min_commitment,
      },
    ])

    if (error) throw error

    return NextResponse.json({ message: 'Package created', data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

