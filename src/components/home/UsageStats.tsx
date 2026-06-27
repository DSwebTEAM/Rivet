import { MiniBar } from '@/components/ui/MiniBar'
import { useSessionStore } from '@/store/sessionStore'

export function UsageStats() {
  const { messagesUsedToday, messagesDailyLimit, summaryCount } = useSessionStore()
  const msgPct = (messagesUsedToday / messagesDailyLimit) * 100

  return (
    <div className="grid grid-cols-2 gap-2 mb-2">
      <div className="glass p-3 rounded-xl">
        <p
          className="text-[22px] font-medium leading-none mb-1"
          style={{ color: 'var(--color-accent)' }}
        >
          {messagesUsedToday}
        </p>
        <p className="text-[10px] text-[var(--color-text-muted)]">Messages today</p>
        <MiniBar
          value={msgPct}
          color="var(--color-accent)"
          className="mt-2"
        />
      </div>
      <div className="glass p-3 rounded-xl">
        <p
          className="text-[22px] font-medium leading-none mb-1"
          style={{ color: 'var(--color-success)' }}
        >
          {summaryCount}
        </p>
        <p className="text-[10px] text-[var(--color-text-muted)]">Memories stored</p>
        <MiniBar
          value={Math.min(100, summaryCount * 5)}
          color="var(--color-success)"
          className="mt-2"
        />
      </div>
    </div>
  )
}
