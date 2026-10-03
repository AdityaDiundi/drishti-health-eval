import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  'https://snypgasuopheucxlzmgi.supabase.co';

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_--8MYNnsHLvxG_RzOdNVZg_UY4AyO_E';

const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  SUPABASE_ANON_KEY;

// Client-side Supabase client (anon)
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Server-side admin client using service_role / secret key
export function getAdminSupabase() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false },
  });
}
