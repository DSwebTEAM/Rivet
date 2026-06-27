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
      className="fixed bottom-0 left-0 right-0 flex items-center justify-center pointer-events-none"
      style={{ paddingBottom: 'var(--safe-area-bottom)' }}
    >
      {/*
        Floating pill — matches Telegram 2026 bottom nav:
        - rounded-full for true pill shape (was incorrectly rounded-[22px])
        - backdrop-blur + saturate for Liquid Glass frosted effect
        - thin border for depth
        - pointer-events-auto only on the pill, not the transparent safe-area wrapper
      */}
      <div
        className={cn(
          'mx-4 mb-2 flex-1 flex items-center',
          'bg-[rgba(20,20,26,0.82)] backdrop-blur-2xl backdrop-saturate-[180%]',
          'border border-white/[0.09] rounded-full',
          'shadow-[0_4px_24px_rgba(0,0,0,0.35)]',
          'pointer-events-auto overflow-hidden'
        )}
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
                'transition-opacity duration-150',
                active ? 'opacity-100' : 'opacity-50 active:opacity-70'
              )}
            >
              {/* Active pip — sits above icon, layoutId animates between tabs */}
              {active && (
                <motion.span
                  layoutId="tab-pip"
                  className="absolute top-[6px] w-[18px] h-[3px] rounded-full bg-[var(--color-accent)]"
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                  aria-hidden
                />
              )}

              <Icon
                size={22}
                aria-hidden
                strokeWidth={active ? 2.2 : 1.8}
                className={cn(
                  'transition-colors duration-150 mt-[8px]',
                  active
                    ? 'text-[var(--color-accent)]'
                    : 'text-[var(--color-text-primary)]'
                )}
              />

              <span
                className={cn(
                  'text-[10px] font-medium leading-none transition-colors duration-150',
                  active
                    ? 'text-[var(--color-accent)]'
                    : 'text-[var(--color-text-primary)]'
                )}
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
