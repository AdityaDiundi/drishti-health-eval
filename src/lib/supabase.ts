import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  '';

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  '';

// Service role / secret key strictly from environment variables (never committed to git)
const envSecret = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';

// Client-side Supabase client (anon)
// If SUPABASE_URL is not configured in local environment, initialize with a safe placeholder
// while Next.js API routes fall back gracefully to offline bundled baseline votes.
export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder-anon-key'
);

// Server-side admin client using service_role / secret key
export function getAdminSupabase() {
  if (!SUPABASE_URL || !envSecret) {
    return null;
  }
  return createClient(SUPABASE_URL, envSecret, {
    auth: { persistSession: false },
  });
}


