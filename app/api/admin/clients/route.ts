import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// API endpoint: /api/admin/clients
export async function POST(request: NextRequest) {
  try {
    console.log('=== API ENDPOINT START ===');
    
    const body = await request.json();
    console.log('Request body received:', body);
    
    const { name, email, phone, is_active, call_request_status, form_response } = body;

    if (!name || !email) {
      console.log('Validation failed: Missing name or email');
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    console.log('Validation passed, preparing database call...');
    
    const dbParams = {
      name,
      email,
      phone: phone || null,
      assigned_tid: null, // Always null - no therapist assignment
      is_active: is_active !== undefined ? is_active : true,
      call_request_status: call_request_status || 'none',
      form_response: form_response || null
    };
    
    console.log('Database parameters:', dbParams);

    // Call the PostgreSQL function
    console.log('Calling supabase.rpc...');
    const { data, error } = await supabase.rpc('add_new_client_user', dbParams);

    console.log('Supabase RPC result:');
    console.log('- data:', data);
    console.log('- error:', error);

    if (error) {
      console.error('Supabase RPC error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Check if RPC returned a valid UID
    if (!data) {
      console.error('RPC did not return a UID');
      return NextResponse.json(
        { error: 'Failed to create user - no UID returned' },
        { status: 500 }
      );
    }

    console.log('RPC successful, fetching created user...');

    // Fetch the created user to return complete data
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select(`
        *,
        therapists:assigned_tid (
          tid,
          name
        )
      `)
      .eq('uid', data)
      .single();

    console.log('User fetch result:');
    console.log('- user:', user);
    console.log('- fetchError:', fetchError);

    if (fetchError) {
      console.error('Error fetching created user:', fetchError);
      return NextResponse.json({
        success: true,
        uid: data,
        message: 'User created but could not fetch details'
      });
    }

    console.log('=== API ENDPOINT SUCCESS ===');
    return NextResponse.json({
      success: true,
      user: user
    });

  } catch (error) {
    console.error('=== API ENDPOINT ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}