import { Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { haptic } from '@/hooks/useTelegram'

export function UpgradeBanner() {
  const tier = useAuthStore((s) => s.tier)
  const navigate = useNavigate()

  // Only show on free tier
  if (tier !== 'free') return null

  return (
    <button
      onClick={() => { haptic.tap(); navigate('/upgrade') }}
      className="w-full flex items-center gap-3 p-3 rounded-2xl mb-2 text-left active:opacity-80 transition-opacity"
      style={{
        background: 'var(--color-accent-dim)',
        border: '0.5px solid var(--color-accent-border)',
      }}
    >
      <Sparkles size={18} className="text-[var(--color-accent)] flex-shrink-0" aria-hidden />
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium text-[var(--color-accent)]">Unlock Pro · 500 ★/mo</p>
        <p className="text-[11px] mt-0.5" style={{ color: 'rgba(160,195,240,0.75)' }}>
          60 msg/hr · 90-day memory · 2 GB storage
        </p>
      </div>
      <span
        className="text-[11px] font-medium px-2.5 py-1 rounded-lg flex-shrink-0"
        style={{ background: 'var(--color-accent)', color: '#fff' }}
      >
        See plans
      </span>
    </button>
  )
}
