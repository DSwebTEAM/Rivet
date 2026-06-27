import { cn } from '@/lib/utils'

interface Props {
  children: React.ReactNode
  className?: string
  /** Accent border — e.g. Pro tier card on Upgrade page */
  accent?: boolean
  /** Amber border — e.g. Team tier card */
  accentAmber?: boolean
}

export function GlassCard({ children, className, accent, accentAmber }: Props) {
  return (
    <div
      className={cn(
        'glass overflow-hidden',
        // Fixed: was using deprecated border-opacity-40 utility
        accent && 'border-[rgba(59,140,232,0.45)]',
        accentAmber && 'border-[rgba(255,159,10,0.45)]',
        className
      )}
    >
      {children}
    </div>
  )
}
