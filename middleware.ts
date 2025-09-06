import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Create Supabase client for middleware
  const supabase = createMiddlewareClient({ req, res })

  // Get user session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const url = req.nextUrl
  const pathname = url.pathname

  // Allow public access to the home page and static assets
  if (
    pathname === '/' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/public') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return res
  }

  // If no session, redirect to login
  if (!session) {
    return NextResponse.redirect(new URL('/account', req.url))
  }

  // Fetch user role from your Supabase table
  const { data: roleData, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', session.user.id)
    .single()

  if (error || !roleData) {
    console.error('Error fetching user role:', error)
    return NextResponse.redirect(new URL('/account', req.url))
  }

  const role = roleData.role
  console.log('User role:', role);

  // ✅ Role-based route protection
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/403', req.url)) // or redirect somewhere safe
  }
  if (pathname.startsWith('/therapist') && role !== 'therapist') {
    return NextResponse.redirect(new URL('/403', req.url))
  }
  if (pathname.startsWith('/client') && role !== 'user') {
    return NextResponse.redirect(new URL('/403', req.url))
  }

  return res
}

// Apply middleware to relevant routes
export const config = {
  matcher: [
    '/admin/:path*',
    '/therapist/:path*',
    '/client/:path*',
  ],
}
