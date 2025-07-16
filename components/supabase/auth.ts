
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bncfzqaotztzwgnjhuon.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuY2Z6cWFvdHp0endnbmpodW9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMjM5MDMsImV4cCI6MjA2MDg5OTkwM30.ddJWDU4ywSHPrFzDzm8SdMvxq9pPjiLxqn7nfildTrk'
export const supabase = createClient(supabaseUrl, supabaseKey)