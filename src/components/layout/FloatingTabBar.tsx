import { Home, LayoutGrid, Settings } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
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
      className="fixed bottom-0 left-0 right-0 flex items-center justify-center pointer-events-none z-50"
      style={{ paddingBottom: 'calc(var(--safe-area-bottom) + 8px)' }}
    >
      <div
        className="mx-4 flex-1 flex items-center rounded-full pointer-events-auto overflow-hidden"
        style={{
          // Liquid Glass — both prefixed and unprefixed for Telegram WebKit webview
          background: 'rgba(18, 18, 24, 0.78)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          backdropFilter: 'blur(24px) saturate(180%)',
          border: '0.5px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 4px 32px rgba(0,0,0,0.4), inset 0 0.5px 0 rgba(255,255,255,0.08)',
        }}
      >
        {TABS.map(({ id, label, Icon }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              onClick={() => {
                haptic.tap()
                setTab(id)
              }}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative flex flex-col items-center gap-[3px] flex-1 py-2.5 px-2',
                'transition-all duration-150',
                active ? 'opacity-100' : 'opacity-45 active:opacity-70'
              )}
            >
              {/* Animated pip above icon */}
              {active && (
                <motion.span
                  layoutId="tab-pip"
                  className="absolute top-[5px] w-5 h-[3px] rounded-full"
                  style={{ background: 'var(--color-accent)' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                  aria-hidden
                />
              )}

              <Icon
                size={22}
                aria-hidden
                strokeWidth={active ? 2.2 : 1.8}
                className="mt-[10px] transition-colors duration-150"
                style={{ color: active ? 'var(--color-accent)' : 'var(--color-text-primary)' }}
              />
              <span
                className="text-[10px] font-medium leading-none transition-colors duration-150"
                style={{ color: active ? 'var(--color-accent)' : 'var(--color-text-primary)' }}
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
