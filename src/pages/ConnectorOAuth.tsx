/**
 * ConnectorOAuth.tsx
 *
 * Handles the OAuth redirect after a user connects a platform (GitHub, Notion, etc.)
 * Flow:
 *   1. User taps "Connect" on a connector card
 *   2. App opens the OAuth URL via Telegram's openLink
 *   3. OAuth provider redirects back to: https://your-console.pages.dev/oauth/callback?code=xxx&state=yyy
 *   4. This page reads the code + state, sends to Rivet Core to exchange for a token
 *   5. Rivet Core stores the connector token in Supabase under user_connectors
 *   6. This page shows success/failure and navigates back to Space tab
 */

import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Loader } from 'lucide-react'
import { useTelegramBackButton, haptic } from '@/hooks/useTelegram'
import { useAuthStore } from '@/store/authStore'

type Status = 'loading' | 'success' | 'error'

export function ConnectorOAuth() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = useAuthStore((s) => s.token)
  const [status, setStatus] = useState<Status>('loading')
  const [connectorName, setConnectorName] = useState('connector')
  const [errorMsg, setErrorMsg] = useState('')

  // BackButton goes to /space
  useTelegramBackButton(() => navigate('/space', { replace: true }), true)

  useEffect(() => {
    const code = params.get('code')
    const state = params.get('state') // encodes connectorId
    const error = params.get('error')

    if (error) {
      setStatus('error')
      setErrorMsg(error === 'access_denied' ? 'Access denied — you cancelled the connection.' : error)
      haptic.error()
      return
    }

    if (!code || !state) {
      setStatus('error')
      setErrorMsg('Missing OAuth parameters. Try connecting again.')
      haptic.error()
      return
    }

    // Exchange code for token via Rivet Core
    fetch(`${import.meta.env.VITE_RIVET_API_URL}/webapp/oauth/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ code, state }),
    })
      .then((r) => r.json())
      .then((data: { connector: string; success: boolean; error?: string }) => {
        if (data.success) {
          setConnectorName(data.connector)
          setStatus('success')
          haptic.success()
          // Auto-navigate back after 1.5 s
          setTimeout(() => navigate('/space', { replace: true }), 1500)
        } else {
          throw new Error(data.error ?? 'Exchange failed')
        }
      })
      .catch((e: Error) => {
        setStatus('error')
        setErrorMsg(e.message)
        haptic.error()
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="flex flex-col items-center justify-center h-full px-6 text-center"
      style={{ paddingTop: 'var(--safe-area-top)' }}
    >
      {status === 'loading' && (
        <>
          <Loader
            size={32}
            className="animate-spin mb-4"
            style={{ color: 'var(--color-accent)' }}
            aria-hidden
          />
          <p className="text-[14px] font-medium text-[var(--color-text-primary)]">
            Connecting…
          </p>
          <p className="text-[12px] text-[var(--color-text-muted)] mt-1">
            Exchanging token with Rivet Core
          </p>
        </>
      )}

      {status === 'success' && (
        <>
          <CheckCircle
            size={40}
            className="mb-4"
            style={{ color: 'var(--color-success)' }}
            aria-hidden
          />
          <p className="text-[14px] font-medium text-[var(--color-text-primary)] capitalize">
            {connectorName} connected
          </p>
          <p className="text-[12px] text-[var(--color-text-muted)] mt-1">
            Returning to Space…
          </p>
        </>
      )}

      {status === 'error' && (
        <>
          <XCircle
            size={40}
            className="mb-4"
            style={{ color: 'var(--color-destructive)' }}
            aria-hidden
          />
          <p className="text-[14px] font-medium text-[var(--color-text-primary)]">
            Connection failed
          </p>
          <p className="text-[12px] text-[var(--color-text-muted)] mt-2 leading-relaxed max-w-[260px]">
            {errorMsg}
          </p>
          <button
            onClick={() => navigate('/space', { replace: true })}
            className="mt-5 px-6 py-2.5 rounded-xl text-[13px] font-medium text-white"
            style={{ background: 'var(--color-accent)' }}
          >
            Back to Space
          </button>
        </>
      )}
    </div>
  )
}
