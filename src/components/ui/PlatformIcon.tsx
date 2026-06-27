/**
 * PlatformIcon — renders a branded SVG icon for each connector platform.
 *
 * Uses simple-icons path data so icons exactly match official brand guidelines.
 * Icons that are inherently dark (GitHub, Notion, Linear) render white so they
 * read on our dark glass surfaces.
 */
import type { SimpleIcon } from 'simple-icons'
import {
  siGithub,
  siNotion,
  siGoogledrive,
  siGmail,
  siSlack,
  siDiscord,
  siLinear,
  siGitlab,
} from 'simple-icons'

// Map connector IDs (from Space.tsx) to simple-icons entries
const ICON_MAP: Record<string, SimpleIcon> = {
  github:  siGithub,
  notion:  siNotion,
  gdrive:  siGoogledrive,
  gmail:   siGmail,
  slack:   siSlack,
  discord: siDiscord,
  linear:  siLinear,
  gitlab:  siGitlab,
}

// Platforms whose brand colour is too dark for a dark background — render white
const FORCE_WHITE = new Set(['github', 'notion', 'linear'])

interface Props {
  /** Connector ID matching keys in DEFAULT_CONNECTORS in Space.tsx */
  id: string
  /** Icon render size in px (default 16) */
  size?: number
}

export function PlatformIcon({ id, size = 16 }: Props) {
  const icon = ICON_MAP[id]

  if (!icon) {
    // Fallback: first two letters of the ID in uppercase
    return (
      <span
        className="text-[10px] font-semibold text-[var(--color-text-muted)] leading-none"
        aria-hidden
      >
        {id.slice(0, 2).toUpperCase()}
      </span>
    )
  }

  const fill = FORCE_WHITE.has(id) ? '#ffffff' : `#${icon.hex}`

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={fill}
      aria-label={icon.title}
      style={{ flexShrink: 0 }}
    >
      <path d={icon.path} />
    </svg>
  )
}
