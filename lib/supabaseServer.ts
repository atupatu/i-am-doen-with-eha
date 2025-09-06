import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export function createSupabaseServerClient() {
  // ✅ Get cookies synchronously
  const cookieStore = cookies()

  // ✅ Pass as function
  return createServerComponentClient({
    cookies: () => cookieStore
  })
}