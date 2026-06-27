// Bug 3 fix: Vite bakes env vars at build time.
// If VITE_RIVET_API_URL was missing during the Cloudflare build,
// this will be undefined. We guard against it and log clearly.
const API = import.meta.env.VITE_RIVET_API_URL as string | undefined

export interface AuthResult {
  token: string
  userId: string
  tier: 'free' | 'pro' | 'team'
  telegramId: number
  username?: string
  firstName?: string
}

export async function authenticateWithTelegram(
  initDataRaw: string
): Promise<AuthResult> {
  if (!API) {
    throw new Error(
      '[rivet] VITE_RIVET_API_URL is not set. ' +
      'Add it to Cloudflare Pages environment variables and redeploy.'
    )
  }

  const res = await fetch(`${API}/webapp/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `tma ${initDataRaw}`,
    },
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Auth failed (${res.status}): ${body}`)
  }

  return res.json() as Promise<AuthResult>
}
