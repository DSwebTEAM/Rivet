import { cn } from '@/lib/utils'

interface Props {
  value: number // 0-100
  color?: string // CSS color value
  className?: string
}

export function MiniBar({ value, color, className }: Props) {
  const pct = Math.min(100, Math.max(0, value))
  const c = color ?? 'var(--color-accent)'
  return (
    <div
      className={cn('h-[3px] rounded-full bg-white/10 overflow-hidden', className)}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, background: c }}
      />
    </div>
  )
}
