// app/api/therapists/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('therapists')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ therapists: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { 
      name, 
      email, 
      info, 
      availability_hours, 
      user_id,
      education,
      bio,
      languages,
      areas_covered
    } = body

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Validate availability_hours if provided
    if (availability_hours !== null && availability_hours !== undefined) {
      if (isNaN(availability_hours) || availability_hours < 0) {
        return NextResponse.json({ error: 'Availability hours must be a positive number' }, { status: 400 })
      }
    }

    // Validate user_id format if provided
    if (user_id && user_id.trim() !== '') {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      if (!uuidRegex.test(user_id)) {
        return NextResponse.json({ error: 'Invalid user_id format' }, { status: 400 })
      }
    }

    const { data, error } = await supabase.from('therapists').insert([
      {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        info: info?.trim() || null,
        availability_hours: availability_hours || null,
        user_id: (user_id && user_id.trim() !== '') ? user_id.trim() : null,
        education: education?.trim() || null,
        bio: bio?.trim() || null,
        languages: languages?.trim() || null,
        areas_covered: areas_covered?.trim() || null,
      },
    ]).select()

    if (error) {
      // Handle specific database errors
      if (error.code === '23505') {
        if (error.message.includes('therapists_email_key')) {
          return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
        }
        if (error.message.includes('therapists_user_id_key')) {
          return NextResponse.json({ error: 'User ID already associated with another therapist' }, { status: 409 })
        }
      }
      throw error
    }

    return NextResponse.json({ 
      message: 'Therapist created successfully', 
      data 
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating therapist:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}