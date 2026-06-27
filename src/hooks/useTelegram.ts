import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { authenticateWithTelegram } from '@/lib/auth'

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void
        expand: () => void
        requestFullscreen?: () => void
        disableVerticalSwipes?: () => void
        colorScheme: 'light' | 'dark'
        themeParams: Record<string, string>
        initData: string
        initDataUnsafe: {
          user?: {
            id: number
            username?: string
            first_name?: string
            last_name?: string
          }
        }
        BackButton: {
          show: () => void
          hide: () => void
          onClick: (cb: () => void) => void
          offClick: (cb: () => void) => void
        }
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy') => void
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void
          selectionChanged: () => void
        }
        openTelegramLink: (url: string) => void
        openLink: (url: string) => void
        safeAreaInset: { top: number; bottom: number; left: number; right: number }
      }
    }
  }
}

export function useTelegramInit() {
  const { setAuth, setReady } = useAuthStore()

  useEffect(() => {
    const tg = window.Telegram?.WebApp

    if (!tg) {
      // No Telegram SDK at all — shouldn't happen in production
      // since we load telegram-web-app.js in index.html
      console.warn('[rivet] Telegram WebApp SDK not found')
      setReady()
      return
    }

    // Tell Telegram the app is ready (removes its loading screen)
    tg.ready()

    // Fullscreen
    tg.expand()
    tg.requestFullscreen?.()
    tg.disableVerticalSwipes?.()

    // Apply safe area insets
    const { top = 44, bottom = 20 } = tg.safeAreaInset ?? {}
    document.documentElement.style.setProperty('--safe-area-top', `${top}px`)
    document.documentElement.style.setProperty('--safe-area-bottom', `${bottom}px`)

    // Sync Telegram color scheme to our dark/light class
    const scheme = tg.colorScheme ?? 'dark'
    document.documentElement.classList.toggle('dark', scheme === 'dark')

    if (!tg.initData) {
      // Opened outside a real Telegram session (no user context)
      // App will show but with no user data — expected outside bot
      console.warn('[rivet] No initData — opened outside Telegram bot context')
      setReady()
      return
    }

    // Auth: send initData to Rivet Core for HMAC validation
    authenticateWithTelegram(tg.initData)
      .then((result) => {
        setAuth(result)
        setReady()
      })
      .catch((err) => {
        console.error('[rivet] auth error:', err)

        // Bug 2 fix: backend auth failed but we still have user info
        // from Telegram's initDataUnsafe — use it so UI renders
        // with the correct user name/id even without a JWT
        const tgUser = tg.initDataUnsafe?.user
        if (tgUser) {
          setAuth({
            token: '',          // empty — Supabase calls will fail gracefully
            userId: String(tgUser.id),
            tier: 'free',       // default until backend confirms
            telegramId: tgUser.id,
            firstName: tgUser.first_name,
            username: tgUser.username,
          })
        }

        // Always mark ready so the UI renders — never hang on a blank screen
        setReady()
      })
  }, [setAuth, setReady])
}

export function useTelegramBackButton(onBack: () => void, active: boolean) {
  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (!tg) return

    if (active) {
      tg.BackButton.show()
      tg.BackButton.onClick(onBack)
    } else {
      tg.BackButton.hide()
    }

    return () => {
      tg.BackButton.offClick(onBack)
      tg.BackButton.hide()
    }
  }, [onBack, active])
}

export const haptic = {
  tap: () => window.Telegram?.WebApp.HapticFeedback.impactOccurred('light'),
  success: () => window.Telegram?.WebApp.HapticFeedback.notificationOccurred('success'),
  error: () => window.Telegram?.WebApp.HapticFeedback.notificationOccurred('error'),
}
