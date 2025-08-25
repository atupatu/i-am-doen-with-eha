'use client'

import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  // This creates a Supabase client for the browser and stores it in state.
  const [supabase] = useState(() => createBrowserSupabaseClient())

  return (
    // The SessionContextProvider makes the Supabase client and session available to all child components.
    <SessionContextProvider supabaseClient={supabase}>
      {children}
    </SessionContextProvider>
  )
}