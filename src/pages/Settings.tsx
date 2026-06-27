import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, MessageSquare, Languages, Clock, Bell, Info, Check } from 'lucide-react'
import { Drawer } from 'vaul'
import { PageShell } from '@/components/layout/PageShell'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassCell } from '@/components/ui/GlassCell'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Badge } from '@/components/ui/Badge'
import { Toggle } from '@/components/ui/Toggle'
import { useAuthStore } from '@/store/authStore'
import { tierLabel, tierColor } from '@/lib/utils'
import { haptic } from '@/hooks/useTelegram'

// ── Selection sheet ──────────────────────────────────────────────────────────

interface SelectSheetProps<T extends string> {
  open: boolean
  onClose: () => void
  title: string
  options: { label: string; value: T }[]
  selected: T
  onSelect: (v: T) => void
}

function SelectSheet<T extends string>({
  open, onClose, title, options, selected, onSelect,
}: SelectSheetProps<T>) {
  return (
    <Drawer.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Drawer.Content
          className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[20px] overflow-hidden"
          style={{
            background: 'rgba(20,20,26,0.97)',
            border: '0.5px solid rgba(255,255,255,0.09)',
            WebkitBackdropFilter: 'blur(24px)',
            backdropFilter: 'blur(24px)',
          }}
          aria-label={title}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-9 h-1 rounded-full bg-white/20" />
          </div>
          <p className="text-[15px] font-medium text-[var(--color-text-primary)] px-4 pt-2 pb-3">
            {title}
          </p>
          <div className="px-3 pb-8">
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.08)' }}
            >
              {options.map((opt, i) => (
                <button
                  key={opt.value}
                  onClick={() => { haptic.tap(); onSelect(opt.value); onClose() }}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left active:bg-white/5 transition-colors"
                  style={{
                    borderBottom: i < options.length - 1 ? '0.5px solid rgba(255,255,255,0.06)' : 'none',
                  }}
                >
                  <span
                    className="text-[14px]"
                    style={{
                      color: selected === opt.value
                        ? 'var(--color-accent)'
                        : 'var(--color-text-primary)',
                    }}
                  >
                    {opt.label}
                  </span>
                  {selected === opt.value && (
                    <Check size={16} style={{ color: 'var(--color-accent)' }} aria-hidden />
                  )}
                </button>
              ))}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

// ── Preference data ───────────────────────────────────────────────────────────

const TONE_OPTIONS = [
  { label: 'Concise',    value: 'concise' },
  { label: 'Balanced',   value: 'balanced' },
  { label: 'Detailed',   value: 'detailed' },
  { label: 'Friendly',   value: 'friendly' },
  { label: 'Formal',     value: 'formal' },
] as const
type Tone = typeof TONE_OPTIONS[number]['value']

const LANG_OPTIONS = [
  { label: 'English',    value: 'en' },
  { label: 'Arabic',     value: 'ar' },
  { label: 'Hindi',      value: 'hi' },
  { label: 'Spanish',    value: 'es' },
  { label: 'French',     value: 'fr' },
  { label: 'German',     value: 'de' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Japanese',   value: 'ja' },
  { label: 'Chinese',    value: 'zh' },
] as const
type Lang = typeof LANG_OPTIONS[number]['value']

// Common timezones — team can expand this list
const TZ_OPTIONS = [
  { label: 'UTC',                        value: 'UTC' },
  { label: 'Asia / Kolkata (IST)',        value: 'Asia/Kolkata' },
  { label: 'Asia / Dubai (GST)',          value: 'Asia/Dubai' },
  { label: 'Asia / Singapore (SGT)',      value: 'Asia/Singapore' },
  { label: 'Europe / London (GMT/BST)',   value: 'Europe/London' },
  { label: 'Europe / Berlin (CET)',       value: 'Europe/Berlin' },
  { label: 'America / New_York (EST)',    value: 'America/New_York' },
  { label: 'America / Los_Angeles (PST)', value: 'America/Los_Angeles' },
  { label: 'America / Chicago (CST)',     value: 'America/Chicago' },
  { label: 'Australia / Sydney (AEST)',   value: 'Australia/Sydney' },
] as const
type Tz = typeof TZ_OPTIONS[number]['value']

// ── Main component ────────────────────────────────────────────────────────────

export function Settings() {
  const navigate = useNavigate()
  const { tier, firstName, username } = useAuthStore()

  const [usageAlerts, setUsageAlerts] = useState(true)
  const [tone, setTone] = useState<Tone>('balanced')
  const [lang, setLang] = useState<Lang>('en')
  const [tz, setTz] = useState<Tz>(
    (Intl.DateTimeFormat().resolvedOptions().timeZone as Tz) ?? 'UTC'
  )

  const [toneOpen, setToneOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [tzOpen, setTzOpen]     = useState(false)

  const initials = firstName
    ? firstName.slice(0, 2).toUpperCase()
    : (username ?? 'RV').slice(0, 2).toUpperCase()

  const toneLabel = TONE_OPTIONS.find((o) => o.value === tone)?.label ?? 'Balanced'
  const langLabel = LANG_OPTIONS.find((o) => o.value === lang)?.label ?? 'English'
  const tzLabel   = TZ_OPTIONS.find((o) => o.value === tz)?.label
    ?? Intl.DateTimeFormat().resolvedOptions().timeZone

  const tierBadgeVariant = tier === 'free' ? 'gray' : tier === 'pro' ? 'blue' : 'amber'

  return (
    <PageShell>
      {/* Profile */}
      <GlassCard className="mb-3">
        <div className="flex items-center gap-3 px-4 py-3.5">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-semibold flex-shrink-0"
            style={{ background: 'var(--color-accent-dim)', color: 'var(--color-accent)' }}
            aria-hidden
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-medium text-[var(--color-text-primary)]">
              {firstName ?? 'Rivet user'}
            </p>
            {username && (
              <p className="text-[12px] text-[var(--color-text-muted)]">@{username}</p>
            )}
          </div>
          <Badge variant={tierBadgeVariant}>{tierLabel(tier)}</Badge>
        </div>
      </GlassCard>

      {/* Plan */}
      <SectionLabel>Plan</SectionLabel>
      <GlassCard className="mb-3">
        {tier === 'free' ? (
          <GlassCell
            icon={<Zap size={15} className="text-[var(--color-accent)]" aria-hidden />}
            title="Manage plan"
            subtitle="Free · upgrade to Pro or Team"
            chevron
            onClick={() => navigate('/upgrade')}
          />
        ) : (
          <GlassCell
            icon={<Zap size={15} className={tierColor(tier)} aria-hidden />}
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
          icon={<MessageSquare size={15} className="text-[var(--color-accent)]" aria-hidden />}
          title="Response tone"
          subtitle={toneLabel}
          chevron
          onClick={() => { haptic.tap(); setToneOpen(true) }}
        />
        <GlassCell
          icon={<Languages size={15} className="text-[var(--color-success)]" aria-hidden />}
          title="Language"
          subtitle={langLabel}
          chevron
          onClick={() => { haptic.tap(); setLangOpen(true) }}
        />
        <GlassCell
          icon={<Clock size={15} className="text-[var(--color-warning)]" aria-hidden />}
          title="Timezone"
          subtitle={tzLabel}
          chevron
          onClick={() => { haptic.tap(); setTzOpen(true) }}
        />
      </GlassCard>

      {/* Notifications */}
      <SectionLabel>Notifications</SectionLabel>
      <GlassCard className="mb-3">
        <GlassCell
          icon={<Bell size={15} className="text-[var(--color-text-secondary)]" aria-hidden />}
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
          icon={<Info size={15} className="text-[var(--color-text-muted)]" aria-hidden />}
          title="Rivet Console"
          subtitle="v0.2.0 · DSwebTEAM"
        />
      </GlassCard>

      {/* Selection sheets */}
      <SelectSheet
        open={toneOpen}
        onClose={() => setToneOpen(false)}
        title="Response tone"
        options={TONE_OPTIONS as unknown as { label: string; value: Tone }[]}
        selected={tone}
        onSelect={setTone}
      />
      <SelectSheet
        open={langOpen}
        onClose={() => setLangOpen(false)}
        title="Language"
        options={LANG_OPTIONS as unknown as { label: string; value: Lang }[]}
        selected={lang}
        onSelect={setLang}
      />
      <SelectSheet
        open={tzOpen}
        onClose={() => setTzOpen(false)}
        title="Timezone"
        options={TZ_OPTIONS as unknown as { label: string; value: Tz }[]}
        selected={tz}
        onSelect={setTz}
      />
    </PageShell>
  )
}
