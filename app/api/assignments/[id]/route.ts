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

    // First, get the current assignment to check if therapist is changing
    const { data: currentAssignment, error: fetchError } = await supabase
      .from('assignments')
      .select('client_uid, therapist_tid')
      .eq('id', id)
      .single()

    if (fetchError || !currentAssignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    // Define the type for updateData
    const updateData: {
      client_uid?: string;
      therapist_tid?: string;
      status?: string;
      start_date?: string;
      end_date?: string;
      notes?: string;
      sessions_count?: number;
      next_session_date?: string;
    } = {};

    // Add properties conditionally
    if (client_uid !== undefined) updateData.client_uid = client_uid;
    if (therapist_tid !== undefined) updateData.therapist_tid = therapist_tid;
    if (status !== undefined) updateData.status = status;
    if (start_date !== undefined) updateData.start_date = start_date;
    if (end_date !== undefined) updateData.end_date = end_date;
    if (notes !== undefined) updateData.notes = notes;
    if (sessions_count !== undefined) updateData.sessions_count = sessions_count;
    if (next_session_date !== undefined) updateData.next_session_date = next_session_date;

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

    // Check if therapist was changed or client was changed
    const finalClientUid = client_uid || currentAssignment.client_uid
    const finalTherapistTid = therapist_tid || currentAssignment.therapist_tid
    
    // Update user's assigned_tid if therapist changed or client changed
    if (therapist_tid !== undefined || client_uid !== undefined) {
      // If client changed, update the old client's assigned_tid to null
      if (client_uid !== undefined && client_uid !== currentAssignment.client_uid) {
        const { error: oldUserUpdateError } = await supabase
          .from('users')
          .update({ assigned_tid: null })
          .eq('uid', currentAssignment.client_uid)

        if (oldUserUpdateError) {
          console.error('Failed to clear old user assigned_tid:', oldUserUpdateError.message)
        }
      }

      // Update the current/new client's assigned_tid
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({ assigned_tid: finalTherapistTid })
        .eq('uid', finalClientUid)

      if (userUpdateError) {
        console.error('Failed to update user assigned_tid:', userUpdateError.message)
      }
    }

    // Handle status changes - if assignment is ended/cancelled, clear assigned_tid
    // if (status && (status === 'ended' || status === 'cancelled' || status === 'inactive')) {
    //   const { error: userClearError } = await supabase
    //     .from('users')
    //     .update({ assigned_tid: null })
    //     .eq('uid', finalClientUid)

    //   if (userClearError) {
    //     console.error('Failed to clear user assigned_tid:', userClearError.message)
    //   }
    // }

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
    
    // First get the assignment to know which user to update
    const { data: assignment, error: fetchError } = await supabase
      .from('assignments')
      .select('client_uid')
      .eq('id', id)
      .single()

    if (fetchError || !assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    // Delete the assignment
    const { error: deleteError } = await supabase
      .from('assignments')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    // Clear the user's assigned_tid
    // const { error: userUpdateError } = await supabase
    //   .from('users')
    //   .update({ assigned_tid: null })
    //   .eq('uid', assignment.client_uid)

    // if (userUpdateError) {
    //   console.error('Failed to clear user assigned_tid:', userUpdateError.message)
    // }

    return NextResponse.json({ message: 'Assignment deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}