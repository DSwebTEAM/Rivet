/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Supabase
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string

  // Rivet Core backend (Replit)
  readonly VITE_RIVET_API_URL: string

  // Telegram bot username (without @) — used for deep links
  readonly VITE_BOT_USERNAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
