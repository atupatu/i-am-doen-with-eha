// app/api/therapists/[tid]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
{/* 
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ tid: string }> }
) {
  try {{
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
    const params = await context.params;
    const tid = params.tid;

    const { data: therapist, error: fetchError } = await supabase
      .from('therapists')
      .select(' tid, name,education,bio,areas_covered, languages, Why_counselling,One_thing,expect, image_data')
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
*/}
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ tid: string }> }
) {
  try {
    const params = await context.params;
    const tid = params.tid;

    // Fetch therapist details - removed authentication check for public viewing
    const { data: therapist, error: fetchError } = await supabase
      .from('therapists')
      .select(`
        tid,
        name,
        education,
        bio,
        areas_covered,
        languages,
        Why_counselling,
        One_thing,
        expect,
        selfcare_tips,
        image_data
      `)
      .eq('tid', tid)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Therapist not found' }, { status: 404 })
      }
      throw fetchError
    }

    // Convert image data to base64 if it exists
    let imageUrl = null;
    if (therapist.image_data) {
      // Convert bytea to base64 string
      const base64String = Buffer.from(therapist.image_data).toString('base64');
      imageUrl = `data:image/jpeg;base64,${base64String}`;
    }

    // Return therapist data with processed image
    const therapistData = {
      ...therapist,
      image: imageUrl || '/images/therapist_placeholder.jpg'
    };

    return NextResponse.json({ therapist: therapistData }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching therapist:', error)
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