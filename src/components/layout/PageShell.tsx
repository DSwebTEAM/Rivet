import { cn } from '@/lib/utils'

interface Props {
  children: React.ReactNode
  className?: string
  subPage?: boolean
}

export function PageShell({ children, className, subPage }: Props) {
  return (
    /*
      h-full + overflow-y-auto: makes this the scroll container.
      The parent (motion.div) has flex-1 min-h-0 which gives this
      a definite height so overflow-y-auto actually kicks in.
      overscrollBehavior contain prevents scroll chaining into Telegram's
      native sheet which would trigger the close gesture.
    */
    <div
      className={cn('h-full overflow-y-auto overflow-x-hidden', className)}
      style={{
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch' as never,
      }}
    >
      {/* Safe area spacer — height set by JS from Telegram SDK */}
      <div style={{ height: 'var(--safe-area-top)', flexShrink: 0 }} aria-hidden />

      <div className={cn('px-3 pt-2', !subPage && 'pb-nav')}>
        {children}
      </div>
    </div>
  )
}
