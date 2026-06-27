import { truncate, formatRelativeTime } from '@/lib/utils'
import type { MemorySummary } from '@/hooks/useMemory'

interface Props {
  summary: MemorySummary
}

export function MemoryCard({ summary }: Props) {
  return (
    <div className="glass rounded-2xl p-3 mb-2">
      <div className="flex items-start justify-between mb-1.5">
        <p className="text-[12px] font-medium text-[var(--color-text-primary)] flex-1 pr-3 leading-snug">
          {summary.title}
        </p>
        <p className="text-[10px] text-[var(--color-text-muted)] flex-shrink-0 mt-0.5">
          {formatRelativeTime(summary.created_at)}
        </p>
      </div>
      <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed mb-2">
        {truncate(summary.content, 120)}
      </p>
      {summary.skill_tag && (
        <span
          className="inline-block text-[10px] px-2 py-0.5 rounded-full border"
          style={{
            background: 'var(--color-accent-dim)',
            color: 'var(--color-accent)',
            borderColor: 'var(--color-accent-border)',
          }}
        >
          {summary.skill_tag}
        </span>
      )}
    </div>
  )
}
