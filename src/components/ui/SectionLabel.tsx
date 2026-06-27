import { cn } from '@/lib/utils'

interface Props {
  children: React.ReactNode
  className?: string
}

export function SectionLabel({ children, className }: Props) {
  return (
    <p
      className={cn(
        'text-[10px] font-medium uppercase tracking-[0.07em] text-[var(--color-text-muted)] mb-[5px] mt-3 first:mt-0 px-1',
        className
      )}
    >
      {children}
    </p>
  )
}
