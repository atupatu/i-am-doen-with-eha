import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(req:NextRequest)
{
    try{
        const {error: pendingError, data: pending}= supabase.from('users').select('name, email, phone, call_request_status')
        .eq('call_request_status', 'pending').order('created_at', { ascending: false })
    
        if (pendingError) {
            return NextResponse.json({ error: pendingError.message }, { status: 500 })
          }

          const {error: completedError, data:completed}= supabase.from('users').select('name, email,phone, call_request')
          .eq('call_request_status','completed').order('created_at', { ascending: false })
          .limit(5)

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