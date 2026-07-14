import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// In dev/demo mode (VITE_DEV_JWT set) Supabase auth is bypassed, so the client
// may be absent. Components must not assume it exists.
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;
