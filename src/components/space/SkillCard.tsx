import { Toggle } from '@/components/ui/Toggle'
import { Badge } from '@/components/ui/Badge'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import { haptic } from '@/hooks/useTelegram'

export interface Skill {
  id: string
  name: string
  description: string
  enabled: boolean
  source: 'builtin' | 'custom'
}

interface Props {
  skill: Skill
  onToggle: (id: string, enabled: boolean) => void
}

export function SkillCard({ skill, onToggle }: Props) {
  const userId = useAuthStore((s) => s.userId)

  const handleToggle = async (v: boolean) => {
    haptic.tap()
    onToggle(skill.id, v)
    if (!userId) return
    await supabase
      .from('user_skills')
      .upsert({ user_id: userId, skill_id: skill.id, enabled: v })
  }

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 border-b border-[var(--color-border-subtle)] last:border-b-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-[12px] font-medium text-[var(--color-text-primary)]">{skill.name}</p>
          {skill.source === 'custom' && <Badge variant="blue">custom</Badge>}
        </div>
        <p className="text-[11px] text-[var(--color-text-muted)]">{skill.description}</p>
      </div>
      <Toggle checked={skill.enabled} onChange={handleToggle} label={`Toggle ${skill.name}`} />
    </div>
  )
}
