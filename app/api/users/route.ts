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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validate required fields
    if (!body.name || !body.email || !body.uid) {
      return NextResponse.json(
        { error: 'Name, email, and uid (auth user ID) are required' }, 
        { status: 400 }
      )
    }

    // Check if user with email already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('email')
      .eq('email', body.email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' }, 
        { status: 409 }
      )
    }

    // Validate call_request_status if provided
    if (body.call_request_status && 
        !['pending', 'completed', 'none'].includes(body.call_request_status)) {
      return NextResponse.json(
        { error: 'Invalid call_request_status value' }, 
        { status: 400 }
      )
    }

    // Create the new user
    const { data, error } = await supabase
      .from('users')
      .insert({
        uid: body.uid, // Required by your schema
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        assigned_tid: body.assigned_tid || null,
        is_active: body.is_active !== undefined ? body.is_active : true,
        call_request_status: body.call_request_status || 'none',
        form_response: body.form_response || null
        // created_at is automatically set by default
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(
      { 
        message: 'User created successfully', 
        user: data 
      }, 
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create user' }, 
      { status: 500 }
    )
  }
}