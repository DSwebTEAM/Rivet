import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { GlassCard } from '@/components/ui/GlassCard'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { MemoryCard } from '@/components/space/MemoryCard'
import { SkillCard, type Skill } from '@/components/space/SkillCard'
import { ConnectorCard, type Connector } from '@/components/space/ConnectorCard'
import { AddSkillSheet } from '@/components/space/AddSkillSheet'
import { useMemory } from '@/hooks/useMemory'

const DEFAULT_SKILLS: Skill[] = [
  {
    id: 'web-search',
    name: 'Web search',
    description: 'DuckDuckGo + RSS live results',
    enabled: true,
    source: 'builtin',
  },
  {
    id: 'code-exec',
    name: 'Code executor',
    description: 'Sandboxed Python / JS environment',
    enabled: true,
    source: 'builtin',
  },
  {
    id: 'file-ops',
    name: 'File ops',
    description: 'Read, write, convert files',
    enabled: false,
    source: 'builtin',
  },
]

// icon field removed — ConnectorCard now renders its own PlatformIcon by id
const DEFAULT_CONNECTORS: Connector[] = [
  { id: 'github',  name: 'GitHub',       description: 'Repos, issues, PRs',    connected: false },
  { id: 'notion',  name: 'Notion',       description: 'Pages, databases',       connected: false },
  { id: 'gdrive',  name: 'Google Drive', description: 'Docs and files',         connected: false },
  { id: 'gmail',   name: 'Gmail',        description: 'Read and send email',    connected: false },
  { id: 'slack',   name: 'Slack',        description: 'Messages, channels',     connected: false },
  { id: 'discord', name: 'Discord',      description: 'Servers, channels',      connected: false },
  { id: 'linear',  name: 'Linear',       description: 'Issues, projects',       connected: false },
  { id: 'gitlab',  name: 'GitLab',       description: 'Repos, MRs, pipelines', connected: false },
]

export function Space() {
  const { summaries, loading, query, setQuery } = useMemory()
  const [skills, setSkills] = useState<Skill[]>(DEFAULT_SKILLS)
  const [connectors, setConnectors] = useState<Connector[]>(DEFAULT_CONNECTORS)
  const [sheetOpen, setSheetOpen] = useState(false)

  const toggleSkill = (id: string, enabled: boolean) => {
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, enabled } : s)))
  }

  const addSkill = (skill: Skill) => {
    setSkills((prev) => [...prev, skill])
  }

  const connectPlatform = (id: string) => {
    // OAuth team: replace stub with real flow:
    // const url = `${VITE_RIVET_API_URL}/oauth/${id}/start?user=${userId}`
    // window.Telegram?.WebApp.openLink(url)
    setConnectors((prev) => prev.map((c) => (c.id === id ? { ...c, connected: true } : c)))
  }

  const disconnectPlatform = (id: string) => {
    setConnectors((prev) => prev.map((c) => (c.id === id ? { ...c, connected: false } : c)))
  }

  const connected = connectors.filter((c) => c.connected)
  const available = connectors.filter((c) => !c.connected)

  return (
    <PageShell>
      {/* ── Memory ── */}
      <SectionLabel>
        Memory · {loading ? '…' : `${summaries.length} summaries`}
      </SectionLabel>

      <GlassCard className="mb-2">
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[var(--color-border-subtle)]">
          <Search size={13} className="text-[var(--color-text-muted)]" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search memories…"
            className="flex-1 bg-transparent text-[12px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none"
            aria-label="Search memories"
          />
        </div>
      </GlassCard>

      {loading ? (
        <p className="text-[12px] text-[var(--color-text-muted)] px-1 mb-3">Loading…</p>
      ) : summaries.length === 0 ? (
        <p className="text-[12px] text-[var(--color-text-muted)] px-1 mb-3">
          {query ? 'No results for that query' : 'No memories yet — start chatting in the bot'}
        </p>
      ) : (
        <div className="mb-1">
          {summaries.map((s) => (
            <MemoryCard key={s.id} summary={s} />
          ))}
        </div>
      )}

      {/* ── Skills ── */}
      <SectionLabel className="mt-4">Skills</SectionLabel>
      <GlassCard className="mb-3">
        {skills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} onToggle={toggleSkill} />
        ))}
        <button
          onClick={() => setSheetOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-3 text-[var(--color-accent)] active:opacity-70 transition-opacity"
          aria-label="Add custom skill"
        >
          <Plus size={13} aria-hidden />
          <span className="text-[12px]">Add skill</span>
        </button>
      </GlassCard>

      {/* ── Connectors ── */}
      <SectionLabel className="mt-1">Connectors</SectionLabel>

      {connected.length > 0 && (
        <>
          <SectionLabel className="mt-1 !text-[9px] !normal-case !tracking-normal text-[var(--color-success)]">
            Connected
          </SectionLabel>
          <GlassCard className="mb-2">
            {connected.map((c) => (
              <ConnectorCard
                key={c.id}
                connector={c}
                onConnect={connectPlatform}
                onDisconnect={disconnectPlatform}
              />
            ))}
          </GlassCard>
        </>
      )}

      <SectionLabel className="mt-1 !text-[9px] !normal-case !tracking-normal">
        Available
      </SectionLabel>
      <GlassCard className="mb-6">
        {available.map((c) => (
          <ConnectorCard
            key={c.id}
            connector={c}
            onConnect={connectPlatform}
            onDisconnect={disconnectPlatform}
          />
        ))}
      </GlassCard>

      <AddSkillSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onAdd={addSkill}
      />
    </PageShell>
  )
}
