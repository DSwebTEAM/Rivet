import { GlassCard } from '@/components/ui/GlassCard'
import { useSessionStore } from '@/store/sessionStore'
import { formatRelativeTime, truncate } from '@/lib/utils'

export function LastMessageCard() {
  const { lastMessage, lastMessageAt, contextChars, contextLimit, summaryCount, activeSkills } =
    useSessionStore()

  if (!lastMessage) return null

  const ctxPct = Math.round((contextChars / contextLimit) * 100)

  return (
    <GlassCard className="p-3 mb-2">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[12px] font-medium text-[var(--color-text-primary)]">Last from Rivet</p>
        {lastMessageAt && (
          <p className="text-[11px] text-[var(--color-text-muted)]">
            {formatRelativeTime(lastMessageAt)}
          </p>
        )}
      </div>
      <p className="text-[12px] text-[var(--color-text-secondary)] leading-relaxed mb-3">
        {truncate(lastMessage, 160)}
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/7 text-[var(--color-text-muted)] border border-white/7">
          {contextChars} / {contextLimit} ctx ({ctxPct}%)
        </span>
        {summaryCount > 0 && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/7 text-[var(--color-text-muted)] border border-white/7">
            {summaryCount} {summaryCount === 1 ? 'memory' : 'memories'}
          </span>
        )}
        {activeSkills.slice(0, 2).map((s) => (
          <span
            key={s}
            className="text-[10px] px-2 py-0.5 rounded-full bg-white/7 text-[var(--color-text-muted)] border border-white/7"
          >
            {s}
          </span>
        ))}
      </div>
    </GlassCard>
  )
}
