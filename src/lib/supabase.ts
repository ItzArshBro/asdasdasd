import { createClient } from '@supabase/supabase-js';

// Fallbacks are required to prevent build-time failures when environment variables are not set during static compilation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';

// Public client for client-side reads (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Administrative client for server-side writes (uses service role key to bypass RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
