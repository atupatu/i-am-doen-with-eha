import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(req: NextRequest)
{
    try{

        const {data, error}= await supabase.from('therapist_schedule').select('*')

        if(error) throw error

        return NextResponse.json({ therapist_schedule: data })
    }catch(error:any)
    {
        return NextResponse.json({ error: error.message }, { status: 500 })

    }

}