import { Check, User, Zap, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Tier } from '@/lib/utils'

interface Feature {
  label: string
}

interface Props {
  tier: Tier
  starsPerMonth?: number
  usdEstimate?: string
  features: Feature[]
  isCurrent?: boolean
  onUpgrade?: () => void
}

const config = {
  free: {
    label: 'Free',
    sub: 'Forever',
    Icon: User,
    iconBg: 'bg-white/8',
    iconColor: 'text-[var(--color-text-muted)]',
    cardBg: 'bg-white/2',
    cardBorder: 'border-white/7',
    ctaBg: 'bg-white/7',
    ctaText: 'text-[var(--color-text-muted)]',
    starsColor: 'text-[var(--color-text-muted)]',
    headBg: 'bg-white/3',
  },
  pro: {
    label: 'Pro',
    sub: '~$6.50 / month',
    Icon: Zap,
    iconBg: 'bg-[var(--color-accent-dim)]',
    iconColor: 'text-[var(--color-accent)]',
    cardBg: 'bg-[rgba(59,140,232,0.05)]',
    cardBorder: 'border-[rgba(59,140,232,0.38)]',
    ctaBg: 'bg-[var(--color-accent)]',
    ctaText: 'text-white',
    starsColor: 'text-[var(--color-accent)]',
    headBg: 'bg-[rgba(59,140,232,0.08)]',
  },
  team: {
    label: 'Team',
    sub: '~$20 / month',
    Icon: Crown,
    iconBg: 'bg-[var(--color-warning-dim)]',
    iconColor: 'text-[var(--color-warning)]',
    cardBg: 'bg-[rgba(255,159,10,0.04)]',
    cardBorder: 'border-[rgba(255,159,10,0.28)]',
    ctaBg: 'bg-[rgba(255,159,10,0.85)]',
    ctaText: 'text-white',
    starsColor: 'text-[var(--color-warning)]',
    headBg: 'bg-[rgba(255,159,10,0.07)]',
  },
}

export function TierCard({ tier, starsPerMonth, usdEstimate: _, features, isCurrent, onUpgrade }: Props) {
  const c = config[tier]
  const { Icon } = c

  return (
    <div
      className={cn('rounded-2xl overflow-hidden border mb-3', c.cardBg, c.cardBorder)}
    >
      {/* Header */}
      <div className={cn('flex items-center justify-between px-3 py-3', c.headBg)}>
        <div className="flex items-center gap-2.5">
          <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', c.iconBg)}>
            <Icon size={14} className={c.iconColor} aria-hidden />
          </div>
          <div>
            <p className="text-[13px] font-medium text-[var(--color-text-primary)]">{c.label}</p>
            <p className="text-[11px] text-[var(--color-text-muted)]">{c.sub}</p>
          </div>
        </div>
        {starsPerMonth && (
          <p className={cn('text-[15px] font-medium', c.starsColor)}>
            {starsPerMonth.toLocaleString()}{' '}
            <span className="text-[11px] font-normal text-[var(--color-text-muted)]">★/mo</span>
          </p>
        )}
      </div>

      {/* Features */}
      {features.length > 0 && (
        <div className="px-3 py-2.5 bg-black/15">
          {features.map((f) => (
            <div key={f.label} className="flex items-center gap-2 mb-1.5 last:mb-0">
              <Check size={11} className="text-[var(--color-success)] flex-shrink-0" aria-hidden />
              <span className="text-[11px] text-[var(--color-text-secondary)]">{f.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="px-3 pt-2 pb-3">
        {isCurrent ? (
          <div
            className="w-full py-2 rounded-xl text-center text-[12px]"
            style={{ background: 'rgba(255,255,255,0.07)', color: 'var(--color-text-muted)' }}
          >
            Current plan
          </div>
        ) : (
          <button
            onClick={onUpgrade}
            className={cn(
              'w-full py-2 rounded-xl text-[12px] font-medium transition-opacity active:opacity-80',
              c.ctaBg,
              c.ctaText
            )}
          >
            Upgrade to {c.label}
            {starsPerMonth ? ` · ${starsPerMonth.toLocaleString()} ★` : ''}
          </button>
        )}
      </div>
    </div>
  )
}
