// app/api/uniClients/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Therapist email is required' }, { status: 400 })
    }

    const { data: therapist, error: therapistError } = await supabase
      .from('therapists')
      .select('tid, name, email')
      .eq('email', email)
      .single()

    if (therapistError || !therapist) {
      return NextResponse.json({ error: 'Therapist not found' }, { status: 404 })
    }

    const { data: assignments, error: assignmentsError } = await supabase
      .from('assignments')
      .select(`
        client:users!fk_assignment_client(uid, name, email, phone)
      `)
      .eq('therapist_tid', therapist.tid)
      .eq('status', 'active')

    if (assignmentsError) {
      return NextResponse.json({ error: assignmentsError.message }, { status: 500 })
    }

    const uniqueClientsMap = new Map()
    assignments?.forEach(assignment => {
      const client = (assignment.client as any)?.[0]

      if (client && !uniqueClientsMap.has(client.uid)) {
        uniqueClientsMap.set(client.uid, {
          id: client.uid,
          name: client.name,
          email: client.email,
          phone: client.phone
        })
      }
    })

    const uniqueClients = Array.from(uniqueClientsMap.values())

    return NextResponse.json({
      therapist: {
        tid: therapist.tid,
        name: therapist.name,
        email: therapist.email
      },
      clients: uniqueClients
    })

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
