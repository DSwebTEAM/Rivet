import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Tier } from '@/lib/utils'

interface AuthState {
  token: string | null
  userId: string | null
  tier: Tier
  telegramId: number | null
  username: string | undefined
  firstName: string | undefined
  isReady: boolean
  setAuth: (payload: {
    token: string
    userId: string
    tier: Tier
    telegramId: number
    username?: string
    firstName?: string
  }) => void
  clear: () => void
  setReady: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      tier: 'free',
      telegramId: null,
      username: undefined,
      firstName: undefined,
      // isReady is intentionally NOT persisted — always starts false
      // so auth always re-runs on every app open
      isReady: false,

      setAuth: (p) =>
        set({
          token: p.token,
          userId: p.userId,
          tier: p.tier,
          telegramId: p.telegramId,
          username: p.username,
          firstName: p.firstName,
        }),

      clear: () =>
        set({
          token: null,
          userId: null,
          tier: 'free',
          telegramId: null,
          username: undefined,
          firstName: undefined,
        }),

      setReady: () => set({ isReady: true }),
    }),
    {
      name: 'rivet-auth',
      // isReady deliberately excluded — must re-auth every session
      partialize: (s) => ({
        token: s.token,
        userId: s.userId,
        tier: s.tier,
        telegramId: s.telegramId,
        username: s.username,
        firstName: s.firstName,
      }),
    }
  )
)
