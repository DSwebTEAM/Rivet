import { cn } from '@/lib/utils'

interface Props {
  children: React.ReactNode
  className?: string
  subPage?: boolean
}

export function PageShell({ children, className, subPage }: Props) {
  return (
    <div
      className={cn(
        'flex flex-col h-full overflow-y-auto overflow-x-hidden',
        !subPage && 'pb-nav',
        className
      )}
      style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' as never }}
    >
      {/*
        Top safe area spacer — fills the space behind Telegram's
        fullscreen status bar / notch. Height comes from JS via
        --safe-area-top CSS var set in useTelegramInit().
      */}
      <div style={{ height: 'var(--safe-area-top)', flexShrink: 0 }} aria-hidden />

      <div className="px-3 pt-2 flex-1">
        {children}
      </div>
    </div>
  )
}
