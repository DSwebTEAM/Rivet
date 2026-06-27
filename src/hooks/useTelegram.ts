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
        // Physical device safe area (notch, home indicator)
        safeAreaInset: { top: number; bottom: number; left: number; right: number }
        // Telegram's OWN UI overlay safe area (fullscreen Close/Minimize buttons)
        contentSafeAreaInset: { top: number; bottom: number; left: number; right: number }
      }
    }
  }
}

function applySafeAreas(tg: NonNullable<Window['Telegram']>['WebApp']) {
  const safe    = tg.safeAreaInset        ?? { top: 0, bottom: 0, left: 0, right: 0 }
  const content = tg.contentSafeAreaInset ?? { top: 0, bottom: 0, left: 0, right: 0 }

  // Top: contentSafeAreaInset already includes the physical notch PLUS Telegram's
  // own buttons (Close, Minimize in fullscreen). Use whichever is bigger.
  const top    = Math.max(safe.top, content.top)
  const bottom = Math.max(safe.bottom, content.bottom)

  document.documentElement.style.setProperty('--safe-area-top',    `${top}px`)
  document.documentElement.style.setProperty('--safe-area-bottom', `${bottom}px`)
}

export function useTelegramInit() {
  const { setAuth, setReady } = useAuthStore()

  useEffect(() => {
    const tg = window.Telegram?.WebApp

    if (!tg) {
      console.warn('[rivet] Telegram WebApp SDK not found')
      setReady()
      return
    }

    // Tell Telegram the app is ready
    tg.ready()

    // Expand to fullscreen
    tg.expand()
    tg.requestFullscreen?.()
    tg.disableVerticalSwipes?.()

    // Apply safe areas immediately on init
    applySafeAreas(tg)

    // Re-apply when Telegram reports safe area changes (rotation, keyboard etc.)
    // The Telegram SDK fires these events on the WebApp object
    const onSafeAreaChange = () => applySafeAreas(tg)
    window.addEventListener('safeAreaChanged', onSafeAreaChange)
    window.addEventListener('contentSafeAreaChanged', onSafeAreaChange)

    // Sync color scheme
    const scheme = tg.colorScheme ?? 'dark'
    document.documentElement.classList.toggle('dark', scheme === 'dark')

    if (!tg.initData) {
      console.warn('[rivet] No initData — opened outside Telegram bot context')
      setReady()
      return
    }

    authenticateWithTelegram(tg.initData)
      .then((result) => {
        setAuth(result)
        setReady()
      })
      .catch((err) => {
        console.error('[rivet] auth error:', err)
        // Fall back to initDataUnsafe so the UI still renders
        const tgUser = tg.initDataUnsafe?.user
        if (tgUser) {
          setAuth({
            token: '',
            userId: String(tgUser.id),
            tier: 'free',
            telegramId: tgUser.id,
            firstName: tgUser.first_name,
            username: tgUser.username,
          })
        }
        setReady()
      })

    return () => {
      window.removeEventListener('safeAreaChanged', onSafeAreaChange)
      window.removeEventListener('contentSafeAreaChanged', onSafeAreaChange)
    }
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
  tap:     () => window.Telegram?.WebApp.HapticFeedback.impactOccurred('light'),
  success: () => window.Telegram?.WebApp.HapticFeedback.notificationOccurred('success'),
  error:   () => window.Telegram?.WebApp.HapticFeedback.notificationOccurred('error'),
}
