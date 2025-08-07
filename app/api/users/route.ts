// import { NextRequest, NextResponse } from 'next/server'
// import { supabase } from '@/lib/supabaseClient'

// export async function GET(req: NextRequest) {
//   try {
//     console.log('Fetching users with role filter...')
    
//     // Step 1: Get all user_ids with 'user' role from user_roles table
//     const { data: roleData, error: roleError } = await supabase
//       .from('user_roles')
//       .select('user_id')
//       .eq('role', 'user')
    
//     console.log('Role data:', { roleData, roleError })
    
//     if (roleError) {
//       console.error('Role query error:', roleError)
//       throw roleError
//     }
    
//     if (!roleData || roleData.length === 0) {
//       console.log('No users found with role "user"')
//       return NextResponse.json({ users: [] })
//     }
    
//     // Extract the user IDs
//     const userIds = roleData.map(item => item.user_id)
//     console.log('User IDs with "user" role:', userIds)
    
//     // Step 2: Get users from your custom users table where uid matches these user_ids
//     const { data: usersData, error: usersError } = await supabase
//       .from('users')
//       .select('*')
//       .in('uid', userIds)
    
//     console.log('Users data:', { usersData, usersError })
    
//     if (usersError) {
//       console.error('Users query error:', usersError)
//       throw usersError
//     }
    
//     return NextResponse.json({ users: usersData || [] })
//   } catch (error: any) {
//     console.error('API Error:', error)
//     return NextResponse.json({ error: error.message }, { status: 500 })
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json()
    
//     // Validate required fields
//     if (!body.name || !body.email || !body.uid) {
//       return NextResponse.json(
//         { error: 'Name, email, and uid (auth user ID) are required' }, 
//         { status: 400 }
//       )
//     }

//     // Check if user with email already exists
//     const { data: existingUser, error: checkError } = await supabase
//       .from('users')
//       .select('email')
//       .eq('email', body.email)
//       .single()

//     if (existingUser) {
//       return NextResponse.json(
//         { error: 'User with this email already exists' }, 
//         { status: 409 }
//       )
//     }

//     // Validate call_request_status if provided
//     if (body.call_request_status && 
//         !['pending', 'completed', 'none'].includes(body.call_request_status)) {
//       return NextResponse.json(
//         { error: 'Invalid call_request_status value' }, 
//         { status: 400 }
//       )
//     }

//     // Create the new user
//     const { data, error } = await supabase
//       .from('users')
//       .insert({
//         uid: body.uid, // Required by your schema
//         name: body.name,
//         email: body.email,
//         phone: body.phone || null,
//         assigned_tid: body.assigned_tid || null,
//         is_active: body.is_active !== undefined ? body.is_active : true,
//         call_request_status: body.call_request_status || 'none',
//         form_response: body.form_response || null
//         // created_at is automatically set by default
//       })
//       .select()
//       .single()

//     if (error) throw error

//     return NextResponse.json(
//       { 
//         message: 'User created successfully', 
//         user: data 
//       }, 
//       { status: 201 }
//     )
//   } catch (error: any) {
//     console.error('Error creating user:', error)
//     return NextResponse.json(
//       { error: error.message || 'Failed to create user' }, 
//       { status: 500 }
//     )
//   }
// }

// api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(req: NextRequest) {
  try {
    // Get auth token from headers
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    console.log('Fetching users with role filter...')

    // Step 1: Get all user_ids with 'user' role from user_roles table
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'user')

    console.log('Role data:', { roleData, roleError })

    if (roleError) {
      console.error('Role query error:', roleError)
      throw roleError
    }

    if (!roleData || roleData.length === 0) {
      console.log('No users found with role "user"')
      return NextResponse.json({ users: [] })
    }

    // Extract the user IDs
    const userIds = roleData.map(item => item.user_id)
    console.log('User IDs with "user" role:', userIds)

    // Step 2: Get users from your custom users table where uid matches these user_ids
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*')
      .in('uid', userIds)

    console.log('Users data:', { usersData, usersError })

    if (usersError) {
      console.error('Users query error:', usersError)
      throw usersError
    }

    return NextResponse.json({ 
      users: usersData || [],
      requestedBy: user?.id
    })
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    // Get auth token from headers
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

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
        user: data,
        createdBy: user?.id
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