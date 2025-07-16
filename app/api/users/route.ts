import { NextRequest, NextResponse } from 'next/server'
import {supabase} from '@/lib/supabaseClient'

export async function GET(req: NextRequest){

    try{

        const {data, error}= await supabase.from('users').select('*')

        if (error) throw error
        return NextResponse.json({ users: data })
    }catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

}