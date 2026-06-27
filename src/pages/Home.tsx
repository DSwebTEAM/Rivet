import { PageShell } from '@/components/layout/PageShell'
import { LastMessageCard } from '@/components/home/LastMessageCard'
import { UsageStats } from '@/components/home/UsageStats'
import { QuickActions } from '@/components/home/QuickActions'
import { UpgradeBanner } from '@/components/home/UpgradeBanner'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassCell } from '@/components/ui/GlassCell'
import { Brain, BarChart2 } from 'lucide-react'
import { useSessionStore } from '@/store/sessionStore'
import { useAuthStore } from '@/store/authStore'
import { tierLabel } from '@/lib/utils'

export function Home() {
  const { firstName } = useAuthStore()
  const { messagesDailyLimit, messagesUsedToday, summaryCount } = useSessionStore()
  const tier = useAuthStore((s) => s.tier)

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  })()

  return (
    <PageShell>
      {/* Greeting row */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[12px] text-[var(--color-text-muted)] leading-none mb-1">
            {greeting}
          </p>
          <p className="text-[22px] font-medium text-[var(--color-text-primary)] leading-none">
            {firstName ?? 'there'}
          </p>
        </div>
        <span
          className="text-[11px] font-medium px-3 py-1.5 rounded-full border"
          style={
            tier === 'free'
              ? {
                  background: 'rgba(255,255,255,0.06)',
                  color: 'var(--color-text-muted)',
                  borderColor: 'rgba(255,255,255,0.1)',
                }
              : tier === 'pro'
              ? {
                  background: 'var(--color-accent-dim)',
                  color: 'var(--color-accent)',
                  borderColor: 'var(--color-accent-border)',
                }
              : {
                  background: 'var(--color-warning-dim)',
                  color: 'var(--color-warning)',
                  borderColor: 'rgba(255,159,10,0.28)',
                }
          }
        >
          {tierLabel(tier)}
        </span>
      </div>

      {/* Upgrade banner — free tier only */}
      <UpgradeBanner />

      {/* Last message from bot */}
      <LastMessageCard />

      {/* Usage stats */}
      <UsageStats />

      {/* Quick actions */}
      <QuickActions />

      {/* Quick nav links */}
      <GlassCard className="mb-3">
        <GlassCell
          icon={<Brain size={15} className="text-[var(--color-success)]" aria-hidden />}
          title="Memory"
          subtitle={`${summaryCount} summaries stored`}
          chevron
        />
        <GlassCell
          icon={<BarChart2 size={15} className="text-[var(--color-warning)]" aria-hidden />}
          title="Daily usage"
          subtitle={`${messagesUsedToday} / ${messagesDailyLimit} messages`}
          right={
            <div className="w-12 h-[3px] rounded-full bg-white/10 overflow-hidden" aria-hidden>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (messagesUsedToday / messagesDailyLimit) * 100)}%`,
                  background: 'var(--color-warning)',
                }}
              />
            </div>
          }
        />
      </GlassCard>
    </PageShell>
  )
}
