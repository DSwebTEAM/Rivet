import { Home, LayoutGrid, Settings } from 'lucide-react'
import { motion } from 'motion/react'
// cn removed — using inline styles for glass
import { useUiStore, type Tab } from '@/store/uiStore'
import { haptic } from '@/hooks/useTelegram'

const TABS: { id: Tab; label: string; Icon: typeof Home }[] = [
  { id: 'home',     label: 'Home',     Icon: Home },
  { id: 'space',    label: 'Space',    Icon: LayoutGrid },
  { id: 'settings', label: 'Settings', Icon: Settings },
]

export function FloatingTabBar() {
  const { activeTab, setTab } = useUiStore()

  return (
    <nav
      aria-label="Main navigation"
      className="flex-shrink-0 flex items-center justify-center z-50 px-4"
      style={{
        paddingBottom: 'calc(var(--safe-area-bottom) + 8px)',
        paddingTop: '8px',
      }}
    >
      {/*
        Liquid Glass pill — position is now flow (not fixed) since
        App.tsx uses flex-col. This avoids the position:fixed scroll
        conflict in Telegram's webview.
      */}
      <div
        className="flex-1 flex items-center rounded-full overflow-hidden"
        style={{
          background: 'rgba(18, 18, 24, 0.82)',
          WebkitBackdropFilter: 'blur(28px) saturate(200%)',
          backdropFilter: 'blur(28px) saturate(200%)',
          border: '0.5px solid rgba(255, 255, 255, 0.13)',
          boxShadow: '0 4px 32px rgba(0,0,0,0.45), inset 0 0.5px 0 rgba(255,255,255,0.1)',
        }}
      >
        {TABS.map(({ id, label, Icon }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              onClick={() => { haptic.tap(); setTab(id) }}
              aria-current={active ? 'page' : undefined}
              className="relative flex flex-col items-center justify-center gap-1 flex-1 py-3 px-2"
            >
              {/*
                Active background bubble — replaces the floating pip dot.
                Uses layoutId for smooth animated transition between tabs.
              */}
              {active && (
                <motion.div
                  layoutId="tab-bubble"
                  className="absolute inset-x-2 inset-y-1.5 rounded-2xl"
                  style={{ background: 'rgba(59, 140, 232, 0.18)' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                  aria-hidden
                />
              )}

              <Icon
                size={22}
                aria-hidden
                strokeWidth={active ? 2.2 : 1.7}
                className="relative z-10 transition-colors duration-150"
                style={{
                  color: active ? 'var(--color-accent)' : 'rgba(200,200,215,0.5)',
                }}
              />
              <span
                className="relative z-10 text-[10px] font-medium leading-none transition-colors duration-150"
                style={{
                  color: active ? 'var(--color-accent)' : 'rgba(200,200,215,0.45)',
                }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
