//Single assignment operations
//app/api/assignments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// GET - Fetch single assignment by ID (Admin only)
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const id = params.id
    
    const { data: assignment, error } = await supabase
      .from('assignments')
      .select(`
        *,
        client:users!fk_assignment_client(uid, name, email),
        therapist:therapists!fk_assignment_therapist(tid, name)
      `)
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    return NextResponse.json({ assignment })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Partially update assignment (Admin only)
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const id = params.id
    const body = await request.json()
    const { client_uid, therapist_tid, status, start_date, end_date, notes, sessions_count, next_session_date } = body

    // Check if assignment exists first
    const { data: existingAssignment, error: existsError } = await supabase
      .from('assignments')
      .select('id')
      .eq('id', id)
      .single()

    if (existsError || !existingAssignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    // Validate status if provided
    if (status && !['active', 'inactive', 'completed'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be: active, inactive, or completed' },
        { status: 400 }
      )
    }

    // If changing client or therapist, verify they exist
    if (client_uid) {
      const { data: client, error: clientError } = await supabase
        .from('users')
        .select('uid')
        .eq('uid', client_uid)
        .single()

      if (clientError || !client) {
        return NextResponse.json({ error: 'Client not found' }, { status: 404 })
      }
    }

    if (therapist_tid) {
      const { data: therapist, error: therapistError } = await supabase
        .from('therapists')
        .select('tid')
        .eq('tid', therapist_tid)
        .single()

      if (therapistError || !therapist) {
        return NextResponse.json({ error: 'Therapist not found' }, { status: 404 })
      }
    }

    // Build update object with only provided fields
    const updateData = {}
    if (client_uid !== undefined) updateData.client_uid = client_uid
    if (therapist_tid !== undefined) updateData.therapist_tid = therapist_tid
    if (status !== undefined) updateData.status = status
    if (start_date !== undefined) updateData.start_date = start_date
    if (end_date !== undefined) updateData.end_date = end_date
    if (notes !== undefined) updateData.notes = notes
    if (sessions_count !== undefined) updateData.sessions_count = sessions_count
    if (next_session_date !== undefined) updateData.next_session_date = next_session_date

    // If no fields to update, return error
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No fields provided to update' },
        { status: 400 }
      )
    }

    // Update assignment
    const { data: assignment, error: updateError } = await supabase
      .from('assignments')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        client:users!fk_assignment_client(uid, name, email),
        therapist:therapists!fk_assignment_therapist(tid, name)
      `)
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Assignment updated successfully',
      assignment 
    })

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete assignment (Admin only)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const id = params.id
    
    const { error } = await supabase
      .from('assignments')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Assignment deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
