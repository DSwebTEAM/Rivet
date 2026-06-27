import { ExternalLink, Download, RefreshCw } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { supabase } from '@/lib/supabase'
import { haptic } from '@/hooks/useTelegram'

interface Action {
  label: string
  Icon: typeof ExternalLink
  onClick: () => void
}

export function QuickActions() {
  const { userId, telegramId } = useAuthStore()

  const openBot = () => {
    haptic.tap()
    const botUsername = import.meta.env.VITE_BOT_USERNAME
    if (!botUsername) {
      console.warn('[rivet] VITE_BOT_USERNAME not set')
      return
    }
    window.Telegram?.WebApp.openTelegramLink(`tg://resolve?domain=${botUsername}`)
  }

  const exportConversation = async () => {
    haptic.tap()
    if (!userId) return
    const { data } = await supabase
      .from('messages')
      .select('role, content, created_at')
      .eq('user_id', userId)
      .order('created_at')
      .limit(200)

    if (!data) return
    const text = data
      .map((m) => `[${m.role.toUpperCase()}] ${m.content}`)
      .join('\n\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rivet-${telegramId}-export.txt`
    a.click()
    URL.revokeObjectURL(url)
    haptic.success()
  }

  const resetContext = async () => {
    haptic.tap()
    if (!userId) return
    // Signals backend to flush the active context window
    await fetch(`${import.meta.env.VITE_RIVET_API_URL}/webapp/reset-context`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${useAuthStore.getState().token}` },
    })
    haptic.success()
  }

  const actions: Action[] = [
    { label: 'Open bot', Icon: ExternalLink, onClick: openBot },
    { label: 'Export', Icon: Download, onClick: exportConversation },
    { label: 'Reset ctx', Icon: RefreshCw, onClick: resetContext },
  ]

  return (
    <div className="flex gap-2 mb-2">
      {actions.map(({ label, Icon, onClick }) => (
        <button
          key={label}
          onClick={onClick}
          aria-label={label}
          className="flex-1 glass rounded-xl py-2 px-2 flex flex-col items-center gap-1.5 active:bg-white/10 transition-colors duration-100"
        >
          <Icon size={16} className="text-[var(--color-text-secondary)]" aria-hidden />
          <span className="text-[11px] text-[var(--color-text-secondary)]">{label}</span>
        </button>
      ))}
    </div>
  )
}
