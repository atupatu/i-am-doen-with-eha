// app/api/uniClients/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Therapist email is required' }, { status: 400 })
    }

    // 1️⃣ Find therapist
    const { data: therapist, error: therapistError } = await supabase
      .from('therapists')
      .select('tid, name, email')
      .eq('email', email)
      .single()

    if (therapistError || !therapist) {
      return NextResponse.json({ error: 'Therapist not found' }, { status: 404 })
    }

    console.log("Therapist found:", therapist.tid);

    // 2️⃣ Fetch assignments with client details
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

    console.log("Assignments fetched:", assignments);

    // 3️⃣ Deduplicate clients
    const uniqueClientsMap = new Map<string, any>()

    assignments?.forEach(assignment => {
      const client = assignment.client as any   // 👈 FIX: no [0]

      if (client) {
        const uid = String(client.uid)
        if (!uniqueClientsMap.has(uid)) {
          uniqueClientsMap.set(uid, {
            id: uid,
            name: client.name,
            email: client.email,
            phone: client.phone
          })
        }
      }
    })

    const uniqueClients = Array.from(uniqueClientsMap.values())
    console.log("Unique clients:", uniqueClients);

    // 4️⃣ Return result
    return NextResponse.json({
      therapist: {
        tid: therapist.tid,
        name: therapist.name,
        email: therapist.email
      },
      clients: uniqueClients
    })

  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
