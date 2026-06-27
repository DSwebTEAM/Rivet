import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max) + '…' : str
}

export function formatRelativeTime(date: string | Date) {
  const d = new Date(date)
  const diff = Date.now() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export type Tier = 'free' | 'pro' | 'team'

export function tierLabel(tier: Tier) {
  return { free: 'Free', pro: 'Pro', team: 'Team' }[tier]
}

export function tierColor(tier: Tier) {
  return {
    free: 'text-[var(--color-text-muted)]',
    pro: 'text-[var(--color-accent)]',
    team: 'text-[var(--color-warning)]',
  }[tier]
}
