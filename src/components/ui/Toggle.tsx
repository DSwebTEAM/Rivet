/**
 * Toggle — thin wrapper around TG-UI's Switch.
 *
 * Keeps the existing { checked, onChange, label } API so all call-sites
 * (SkillCard, Settings) need zero changes. TG-UI Switch renders the
 * native iOS/Android-style pill toggle automatically.
 */
import { Switch } from '@telegram-apps/telegram-ui'

interface Props {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
}

export function Toggle({ checked, onChange, label }: Props) {
  return (
    <Switch
      checked={checked}
      aria-label={label}
      onChange={(e) => onChange(e.target.checked)}
    />
  )
}
