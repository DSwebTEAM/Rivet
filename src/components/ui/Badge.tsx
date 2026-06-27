import { cn } from '@/lib/utils'

type Variant = 'blue' | 'green' | 'amber' | 'gray'

const variants: Record<Variant, string> = {
  blue: 'bg-[var(--color-accent-dim)] text-[var(--color-accent)] border-[var(--color-accent-border)]',
  green: 'bg-[var(--color-success-dim)] text-[var(--color-success)] border-[rgba(52,199,89,0.22)]',
  amber: 'bg-[var(--color-warning-dim)] text-[var(--color-warning)] border-[rgba(255,159,10,0.22)]',
  gray: 'bg-white/5 text-[var(--color-text-secondary)] border-white/10',
}

interface Props {
  children: React.ReactNode
  variant?: Variant
  className?: string
}

export function Badge({ children, variant = 'gray', className }: Props) {
  return (
    <span
      className={cn(
        'inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
