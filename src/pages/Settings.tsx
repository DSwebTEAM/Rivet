import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, MessageSquare, Languages, Clock, Bell, Info } from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassCell } from '@/components/ui/GlassCell'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Badge } from '@/components/ui/Badge'
import { Toggle } from '@/components/ui/Toggle'
import { useAuthStore } from '@/store/authStore'
import { tierLabel, tierColor } from '@/lib/utils'

export function Settings() {
  const navigate = useNavigate()
  const { tier, firstName, username } = useAuthStore()
  const [usageAlerts, setUsageAlerts] = useState(true)

  const initials = firstName
    ? firstName.slice(0, 2).toUpperCase()
    : (username ?? 'RV').slice(0, 2).toUpperCase()

  const tierBadgeVariant = tier === 'free' ? 'gray' : tier === 'pro' ? 'blue' : 'amber'

  return (
    <PageShell>
      {/* Profile cell */}
      <GlassCard className="mb-3">
        <div className="flex items-center gap-3 px-3 py-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-medium flex-shrink-0"
            style={{ background: 'var(--color-accent-dim)', color: 'var(--color-accent)' }}
            aria-hidden
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-[var(--color-text-primary)]">
              {firstName ?? 'Rivet user'}
            </p>
            {username && (
              <p className="text-[11px] text-[var(--color-text-muted)]">@{username}</p>
            )}
          </div>
          <Badge variant={tierBadgeVariant}>{tierLabel(tier)}</Badge>
        </div>
      </GlassCard>

      {/* Plan — always shown; layout differs by tier */}
      <SectionLabel>Plan</SectionLabel>
      <GlassCard className="mb-3">
        {tier === 'free' ? (
          <GlassCell
            icon={<Zap size={14} className="text-[var(--color-accent)]" aria-hidden />}
            title="Manage plan"
            subtitle="Free · upgrade to Pro or Team"
            chevron
            onClick={() => navigate('/upgrade')}
          />
        ) : (
          <GlassCell
            icon={
              <Zap
                size={14}
                className={tierColor(tier)}
                aria-hidden
              />
            }
            title={`${tierLabel(tier)} plan`}
            subtitle={`Renews monthly · ${tier === 'pro' ? '500' : '1,500'} ★`}
            chevron
            onClick={() => navigate('/upgrade')}
          />
        )}
      </GlassCard>

      {/* Preferences */}
      <SectionLabel>Preferences</SectionLabel>
      <GlassCard className="mb-3">
        <GlassCell
          icon={<MessageSquare size={14} className="text-[var(--color-accent)]" aria-hidden />}
          title="Response tone"
          subtitle="Balanced"
          chevron
          onClick={() => {}}
        />
        <GlassCell
          icon={<Languages size={14} className="text-[var(--color-success)]" aria-hidden />}
          title="Language"
          subtitle="English"
          chevron
          onClick={() => {}}
        />
        <GlassCell
          icon={<Clock size={14} className="text-[var(--color-warning)]" aria-hidden />}
          title="Timezone"
          subtitle={Intl.DateTimeFormat().resolvedOptions().timeZone}
          chevron
          onClick={() => {}}
        />
      </GlassCard>

      {/* Notifications */}
      <SectionLabel>Notifications</SectionLabel>
      <GlassCard className="mb-3">
        <GlassCell
          icon={<Bell size={14} className="text-[var(--color-text-secondary)]" aria-hidden />}
          title="Usage alerts"
          subtitle="Warn at 80% of daily message limit"
          right={
            <Toggle
              checked={usageAlerts}
              onChange={setUsageAlerts}
              label="Toggle usage alerts"
            />
          }
        />
      </GlassCard>

      {/* About */}
      <SectionLabel>About</SectionLabel>
      <GlassCard className="mb-6">
        <GlassCell
          icon={<Info size={14} className="text-[var(--color-text-muted)]" aria-hidden />}
          title="Rivet Console"
          subtitle="v0.1.0 · DSwebTEAM"
        />
      </GlassCard>
    </PageShell>
  )
}
