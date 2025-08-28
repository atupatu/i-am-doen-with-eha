// app/api/therapists/[tid]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ tid: string }> }
) {
  try {
    // Auth check
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params
    const tid = params.tid

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(tid)) {
      return NextResponse.json({ error: 'Invalid therapist ID format' }, { status: 400 })
    }

    // Fetch therapist to check ownership
    const { data: therapist, error: fetchError } = await supabase
      .from('therapists')
      .select('*')
      .eq('tid', tid)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Therapist not found' }, { status: 404 })
      }
      throw fetchError
    }

    if (therapist.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ therapist }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching therapist:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ tid: string }> }
) {
  try {
    // Auth check
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params
    const tid = params.tid
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
      areas_covered,
      availability
    } = body

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(tid)) {
      return NextResponse.json({ error: 'Invalid therapist ID format' }, { status: 400 })
    }

    // Fetch therapist to check ownership
    const { data: therapist, error: fetchError } = await supabase
      .from('therapists')
      .select('user_id')
      .eq('tid', tid)
      .single()

    if (fetchError || !therapist) {
      return NextResponse.json({ error: 'Therapist not found' }, { status: 404 })
    }

    if (therapist.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Validate required fields if provided
    if (name !== undefined && (!name || name.trim() === '')) {
      return NextResponse.json({ error: 'Name cannot be empty' }, { status: 400 })
    }

    if (email !== undefined) {
      if (!email || email.trim() === '') {
        return NextResponse.json({ error: 'Email cannot be empty' }, { status: 400 })
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
      }
    }

    // Validate availability_hours if provided
    if (availability_hours !== undefined && availability_hours !== null) {
      if (isNaN(availability_hours) || availability_hours < 0) {
        return NextResponse.json({ error: 'Availability hours must be a positive number' }, { status: 400 })
      }
    }

    // Validate user_id format if provided
    if (user_id !== undefined && user_id !== null && user_id.trim() !== '') {
      if (!uuidRegex.test(user_id)) {
        return NextResponse.json({ error: 'Invalid user_id format' }, { status: 400 })
      }
    }

    // Basic validation for availability if provided
    if (availability !== undefined && availability !== null) {
      if (typeof availability !== 'object' || Array.isArray(availability)) {
        return NextResponse.json({ error: 'Availability must be an object' }, { status: 400 })
      }
    }

    // Build update object with only provided fields
    const updateData: any = {}
    if (name !== undefined) updateData.name = name.trim()
    if (email !== undefined) updateData.email = email.trim().toLowerCase()
    if (info !== undefined) updateData.info = info?.trim() || null
    if (availability_hours !== undefined) updateData.availability_hours = availability_hours || null
    if (user_id !== undefined) updateData.user_id = (user_id && user_id.trim() !== '') ? user_id.trim() : null
    if (education !== undefined) updateData.education = education?.trim() || null
    if (bio !== undefined) updateData.bio = bio?.trim() || null
    if (languages !== undefined) updateData.languages = languages?.trim() || null
    if (areas_covered !== undefined) updateData.areas_covered = areas_covered?.trim() || null
    if (availability !== undefined) updateData.availability = availability || null

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('therapists')
      .update(updateData)
      .eq('tid', tid)
      .select()

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

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Therapist not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      message: 'Therapist updated successfully', 
      data: data[0] 
    }, { status: 200 })
  } catch (error: any) {
    console.error('Error updating therapist:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ tid: string }> }
) {
  try {
    // Auth check
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params
    const tid = params.tid

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(tid)) {
      return NextResponse.json({ error: 'Invalid therapist ID format' }, { status: 400 })
    }

    // Fetch therapist to check ownership
    const { data: therapist, error: fetchError } = await supabase
      .from('therapists')
      .select('user_id')
      .eq('tid', tid)
      .single()

    if (fetchError || !therapist) {
      return NextResponse.json({ error: 'Therapist not found' }, { status: 404 })
    }

    if (therapist.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error } = await supabase
      .from('therapists')
      .delete()
      .eq('tid', tid)

    if (error) throw error

    return NextResponse.json({ 
      message: `Therapist ${tid} deleted successfully` 
    }, { status: 200 })
  } catch (error: any) {
    console.error('Error deleting therapist:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}