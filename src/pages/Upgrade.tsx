import { useNavigate } from 'react-router-dom'
import { PageShell } from '@/components/layout/PageShell'
import { TierCard } from '@/components/upgrade/TierCard'
import { useTelegramBackButton } from '@/hooks/useTelegram'
import { useAuthStore } from '@/store/authStore'

export function Upgrade() {
  const navigate = useNavigate()
  const tier = useAuthStore((s) => s.tier)

  // Telegram native back button — top-left in Telegram's own chrome
  useTelegramBackButton(() => navigate(-1), true)

  const handleUpgrade = (plan: 'pro' | 'team') => {
    // Payment team wires the actual invoice link here
    // e.g.: window.Telegram?.WebApp.openTelegramLink(invoiceUrl)
    console.log('[rivet] trigger upgrade to', plan)
  }

  return (
    <PageShell subPage>
      <h1 className="text-[16px] font-medium text-[var(--color-text-primary)] mb-1 pt-1">
        Choose a plan
      </h1>
      <p className="text-[12px] text-[var(--color-text-muted)] mb-4">
        Payments via Telegram Stars — auto-renews monthly
      </p>

      <TierCard
        tier="free"
        features={[]}
        isCurrent={tier === 'free'}
      />

      <TierCard
        tier="pro"
        starsPerMonth={500}
        features={[
          { label: '60 messages per hour' },
          { label: '500 messages per day' },
          { label: '90-day memory retention' },
          { label: '4,000 character messages' },
          { label: '2 GB file storage' },
        ]}
        isCurrent={tier === 'pro'}
        onUpgrade={() => handleUpgrade('pro')}
      />

      <TierCard
        tier="team"
        starsPerMonth={1500}
        features={[
          { label: '200 messages per hour' },
          { label: '2,000 messages per day' },
          { label: 'Unlimited memory' },
          { label: '5,000 character messages' },
          { label: '20 GB file storage' },
        ]}
        isCurrent={tier === 'team'}
        onUpgrade={() => handleUpgrade('team')}
      />

      <p className="text-[10px] text-[var(--color-text-muted)] leading-relaxed mb-6 px-1">
        Billed monthly via Telegram Stars. Cancel anytime in Telegram → Settings → Payments.
        Star value fluctuates with TON price — dollar estimates only.
      </p>
    </PageShell>
  )
}
