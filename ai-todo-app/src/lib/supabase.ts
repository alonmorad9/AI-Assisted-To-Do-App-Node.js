import { createClient } from '@supabase/supabase-js' // Import the Supabase client creation function

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL // Get the Supabase URL from environment variables
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY // Get the Supabase anonymous key from environment variables

if (!supabaseUrl || !supabaseAnonKey) { // Check if the necessary environment variables are set
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey) // Create a Supabase client instance with the URL and anonymous key