import { useState } from 'react'
import { Drawer } from 'vaul'
import { X } from 'lucide-react'
import { haptic } from '@/hooks/useTelegram'
import type { Skill } from './SkillCard'

interface Props {
  open: boolean
  onClose: () => void
  onAdd: (skill: Skill) => void
}

export function AddSkillSheet({ open, onClose, onAdd }: Props) {
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleAdd = () => {
    setError(null)
    if (!input.trim()) {
      setError('Paste a skill definition first')
      return
    }
    try {
      const parsed = JSON.parse(input.trim())
      if (!parsed.name) throw new Error('Missing "name" field')

      const skill: Skill = {
        id: parsed.id ?? `custom-${Date.now()}`,
        name: parsed.name,
        description: parsed.description ?? '',
        enabled: true,
        source: 'custom',
      }
      haptic.success()
      onAdd(skill)
      setInput('')
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON — check the skill definition')
      haptic.error()
    }
  }

  const handleClose = () => {
    setInput('')
    setError(null)
    onClose()
  }

  return (
    <Drawer.Root open={open} onOpenChange={(v) => !v && handleClose()}>
      <Drawer.Portal>
        {/* Overlay */}
        <Drawer.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

        {/* Sheet */}
        <Drawer.Content
          className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[20px] overflow-hidden"
          style={{ background: '#161820', border: '0.5px solid rgba(255,255,255,0.09)' }}
          aria-label="Add custom skill"
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-9 h-1 rounded-full bg-white/20" />
          </div>

          <div className="px-4 pt-2 pb-2 flex items-center justify-between">
            <h2 className="text-[15px] font-medium text-[var(--color-text-primary)]">
              Add skill
            </h2>
            <button
              onClick={handleClose}
              className="w-7 h-7 rounded-full bg-white/8 flex items-center justify-center active:opacity-70"
              aria-label="Close"
            >
              <X size={14} className="text-[var(--color-text-muted)]" aria-hidden />
            </button>
          </div>

          <div className="px-4 pb-6">
            <p className="text-[12px] text-[var(--color-text-muted)] mb-3 leading-relaxed">
              Paste a skill definition in JSON format from{' '}
              <span className="text-[var(--color-accent)]">agentskills.io</span> or any
              compatible source.
            </p>

            <textarea
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(null) }}
              placeholder={'{\n  "id": "my-skill",\n  "name": "My Skill",\n  "description": "What this skill does"\n}'}
              className="w-full rounded-xl px-3 py-2.5 text-[12px] font-mono text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none min-h-[110px] resize-none mb-2"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: `0.5px solid ${error ? 'var(--color-destructive)' : 'rgba(255,255,255,0.09)'}`,
              }}
              aria-label="Skill definition JSON"
              spellCheck={false}
              autoCapitalize="none"
              autoCorrect="off"
            />

            {error && (
              <p className="text-[11px] text-[var(--color-destructive)] mb-3">{error}</p>
            )}

            <div className="flex gap-2.5">
              <button
                onClick={handleClose}
                className="flex-1 py-2.5 rounded-xl text-[13px] text-[var(--color-text-muted)] active:opacity-70"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-medium text-white active:opacity-80"
                style={{ background: 'var(--color-accent)' }}
              >
                Add skill
              </button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
