//Admin: CRUD operations
//app/api/assignments/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// GET - Fetch all assignments (Admin only)
export async function GET() {
  try {
    const { data: assignments, error } = await supabase
      .from('assignments')
      .select(`
        *,
        client:users!fk_assignment_client(uid, name, email),
        therapist:therapists!fk_assignment_therapist(tid, name)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ assignments })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new assignment (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { client_uid, therapist_tid, start_date, notes } = body

    // Validate required fields
    if (!client_uid || !therapist_tid) {
      return NextResponse.json(
        { error: 'client_uid and therapist_tid are required' },
        { status: 400 }
      )
    }

    // Verify client exists
    const { data: client, error: clientError } = await supabase
      .from('users')
      .select('uid')
      .eq('uid', client_uid)
      .single()

    if (clientError || !client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // Verify therapist exists
    const { data: therapist, error: therapistError } = await supabase
      .from('therapists')
      .select('tid')
      .eq('tid', therapist_tid)
      .single()

    if (therapistError || !therapist) {
      return NextResponse.json({ error: 'Therapist not found' }, { status: 404 })
    }

    // Create assignment
    const { data: assignment, error: insertError } = await supabase
      .from('assignments')
      .insert({
        client_uid,
        therapist_tid,
        start_date: start_date || new Date().toISOString().split('T')[0],
        notes: notes || null,
        status: 'active'
      })
      .select(`
        *,
        client:users!fk_assignment_client(uid, name, email),
        therapist:therapists!fk_assignment_therapist(tid, name)
      `)
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Assignment created successfully',
      assignment 
    }, { status: 201 })

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}