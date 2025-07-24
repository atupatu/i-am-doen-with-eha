import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(req:NextRequest)
{
    try{
        const {error: pendingError, data: pending}= await supabase.from('users').select('name, email, phone, call_request_status')
        .eq('call_request_status', 'pending').order('created_at', { ascending: false })
    
        if (pendingError) {
            return NextResponse.json({ error: pendingError.message }, { status: 500 })
          }

          const {error: completedError, data:completed}= await supabase.from('users').select('name, email,phone, call_request_status')
          .eq('call_request_status','completed').order('created_at', { ascending: false })
         

          if (completedError) {
            return NextResponse.json({ error: completedError.message }, { status: 500 })
          }

         const combined = [...pending, ...completed]
         return NextResponse.json({ data: combined })

    }catch(error: any)
    {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
   

      

}

/*

export async function PATCH(req: NextRequest, { params }: { params: { uid: string } }) {
  try {
    const { uid } = params
    const body = await req.json()
    const { newStatus } = body

    if (!newStatus) {
      return NextResponse.json({ error: 'Missing newStatus in body' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('users')
      .update({ call_request_status: newStatus })
      .eq('uid', uid)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Call request status updated', data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
*/