import { cn } from '@/lib/utils'

interface Props {
  children: React.ReactNode
  className?: string
  /** Sub-pages (Upgrade, OAuth) sit under Telegram's native BackButton — no tab bar padding needed */
  subPage?: boolean
}

export function PageShell({ children, className, subPage }: Props) {
  return (
    <div
      className={cn(
        'flex flex-col h-full overflow-y-auto overflow-x-hidden',
        // Safe area at top — keeps content below Telegram's fullscreen header
        'pt-[var(--safe-area-top)]',
        // Tab pages need bottom room for the floating nav pill
        !subPage && 'pb-nav',
        className
      )}
      // Prevent scroll chaining into Telegram's native scroll — avoids swipe-to-close
      style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}
    >
      <div className="px-3 pt-2 flex-1">{children}</div>
    </div>
  )
}
