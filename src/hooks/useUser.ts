import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import { useSessionStore } from '@/store/sessionStore'
import type { Tier } from '@/lib/utils'

const DAILY_LIMITS: Record<Tier, number> = {
  free: 100,
  pro: 500,
  team: 2000,
}

export function useUser() {
  const { userId, token, tier } = useAuthStore()
  const setSession = useSessionStore((s) => s.setSession)
  const setAuth = useAuthStore((s) => s.setAuth)
  const authState = useAuthStore()

  useEffect(() => {
    if (!userId || !token) return

    // Load latest session context + usage from DB
    supabase
      .from('users')
      .select('tier, last_message, last_message_at, messages_today, context_chars, summary_count')
      .eq('id', userId)
      .single()
      .then(({ data }) => {
        if (!data) return
        // Update tier if it changed (e.g. after payment)
        if (data.tier !== tier && authState.token && authState.userId && authState.telegramId) {
          setAuth({
            token: authState.token,
            userId: authState.userId,
            tier: data.tier as Tier,
            telegramId: authState.telegramId,
            username: authState.username,
            firstName: authState.firstName,
          })
        }
        setSession({
          lastMessage: data.last_message,
          lastMessageAt: data.last_message_at,
          messagesUsedToday: data.messages_today ?? 0,
          messagesDailyLimit: DAILY_LIMITS[data.tier as Tier] ?? 100,
          contextChars: data.context_chars ?? 0,
          summaryCount: data.summary_count ?? 0,
        })
      })

    // Realtime: watch for tier changes (after Stars payment webhook)
    const channel = supabase
      .channel(`user:${userId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${userId}` },
        (payload) => {
          const updated = payload.new as { tier: Tier; messages_today: number }
          if (updated.tier && authState.token && authState.userId && authState.telegramId) {
            setAuth({
              token: authState.token,
              userId: authState.userId,
              tier: updated.tier,
              telegramId: authState.telegramId,
              username: authState.username,
              firstName: authState.firstName,
            })
            setSession({
              messagesUsedToday: updated.messages_today ?? 0,
              messagesDailyLimit: DAILY_LIMITS[updated.tier] ?? 100,
            })
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId, token]) // eslint-disable-line react-hooks/exhaustive-deps
}
