import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  icon?: React.ReactNode
  title: string
  subtitle?: string
  right?: React.ReactNode
  chevron?: boolean
  onClick?: () => void
  className?: string
  center?: boolean
}

export function GlassCell({
  icon,
  title,
  subtitle,
  right,
  chevron,
  onClick,
  className,
  center,
}: Props) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-3 py-[10px] border-b border-[var(--color-border-subtle)] last:border-b-0 w-full text-left',
        onClick && 'active:bg-white/5 transition-colors duration-100',
        center && 'justify-center',
        className
      )}
    >
      {icon && (
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-[var(--color-surface-raised)]">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[var(--color-text-primary)] truncate">{title}</p>
        {subtitle && (
          <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{subtitle}</p>
        )}
      </div>
      {right}
      {chevron && (
        <ChevronRight
          size={14}
          className="text-[var(--color-text-muted)] opacity-40 flex-shrink-0"
          aria-hidden
        />
      )}
    </Tag>
  )
}
