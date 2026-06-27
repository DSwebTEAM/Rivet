import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!url || !key) {
  console.warn('[rivet] Supabase env vars missing — check .env.local')
}

export const supabase = createClient(url, key, {
  auth: {
    // We handle auth ourselves via Telegram initData → JWT
    // Supabase auth is bypassed; we use the anon key + RLS
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: { eventsPerSecond: 10 },
  },
})
