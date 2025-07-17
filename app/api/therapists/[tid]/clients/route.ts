//api to get all clients of a particular therapist

// app/api/therapists/[tid]/clients/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(
  req: NextRequest,
  context: { params: { tid: string } }
) {
  try {
    const tid = context.params.tid

    const { data, error } = await supabase
      .from('assignments')
      .select(`
        client_uid,
        users (
          uid,
          name,
          email,
          phone,
          form_response,
          call_request_status
        )
      `)
      .eq('therapist_tid', tid)
      .eq('status', 'active')

    if (error) throw error

    const activeClients = data.map(entry => entry.users)

    return NextResponse.json({ clients: activeClients }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
