// // app/api/users/[uid]/route.ts
// import { NextRequest, NextResponse } from 'next/server'
// import { supabase } from '@/lib/supabaseClient'

// export async function GET(
//   req: NextRequest,
//   context: { params: Promise<{ uid: string }> }
// ) {
//   try {
//     const params = await context.params  // Await params first
//     const uid = params.uid

//     const { data, error } = await supabase
//       .from('users')
//       .select('*')
//       .eq('uid', uid)
//       .single()

//     if (error) throw error
//     return NextResponse.json({ data }, { status: 200 })
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 })
//   }
// }
// export async function PATCH(
//   req: NextRequest,
//   context: { params: Promise<{ uid: string }> }
// ) {
//   try {
//     const params = await context.params
//     const uid = params.uid
//     console.log(`PATCH request for UID: ${uid}`)

//     const body = await req.json()
//     console.log('Request body:', body)

//     const { data, error } = await supabase
//       .from('users')
//       .update(body)
//       .eq('uid', uid)
//       .select()
//       .single()

//     if (error) throw error
//     return NextResponse.json({ message: 'User updated', data }, { status: 200 })
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 })
//   }
// }


// export async function DELETE(
//   req: NextRequest,
//   context: { params: Promise<{ uid: string }> }
// ) {
//   try {
//     const params = await context.params  // Await params first
//     const uid = params.uid
    
//     const { error } = await supabase.from('users').delete().eq('uid', uid)
//     if (error) throw error
//     return NextResponse.json({ message: `User ${uid} deleted` }, { status: 200 })
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 })
//   }
// }



// app/api/users/[uid]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ uid: string }> }
) {
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

    const params = await context.params  // Await params first
    const uid = params.uid

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('uid', uid)
      .single()

    if (error) throw error
    return NextResponse.json({ 
      data,
      requestedBy: user?.id
    }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ uid: string }> }
) {
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

    const params = await context.params
    const uid = params.uid
    console.log(`PATCH request for UID: ${uid}`)

    const body = await req.json()
    console.log('Request body:', body)

    const { data, error } = await supabase
      .from('users')
      .update(body)
      .eq('uid', uid)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ 
      message: 'User updated', 
      data,
      updatedBy: user?.id
    }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ uid: string }> }
) {
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

    const params = await context.params  // Await params first
    const uid = params.uid

    const { error } = await supabase.from('users').delete().eq('uid', uid)
    if (error) throw error
    return NextResponse.json({ 
      message: `User ${uid} deleted`,
      deletedBy: user?.id
    }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}