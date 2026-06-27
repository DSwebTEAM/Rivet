import { cn } from '@/lib/utils'
import { haptic } from '@/hooks/useTelegram'
import { PlatformIcon } from '@/components/ui/PlatformIcon'

export interface Connector {
  id: string
  name: string
  description: string
  connected: boolean
}

interface Props {
  connector: Connector
  onConnect: (id: string) => void
  onDisconnect: (id: string) => void
}

export function ConnectorCard({ connector, onConnect, onDisconnect }: Props) {
  const handleAction = () => {
    haptic.tap()
    if (connector.connected) {
      onDisconnect(connector.id)
    } else {
      onConnect(connector.id)
    }
  }

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 border-b border-[var(--color-border-subtle)] last:border-b-0">
      {/* Platform icon — branded SVG in a glass pill container */}
      <div className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0 glass">
        <PlatformIcon id={connector.id} size={17} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[var(--color-text-primary)]">
          {connector.name}
        </p>
        <p className="text-[11px] text-[var(--color-text-muted)]">
          {connector.connected ? 'Connected' : connector.description}
        </p>
      </div>

      <button
        onClick={handleAction}
        className={cn(
          'text-[11px] font-medium px-3 py-1.5 rounded-full border transition-opacity active:opacity-70 flex-shrink-0',
          connector.connected
            ? 'text-[var(--color-success)] border-[rgba(52,199,89,0.28)] bg-[var(--color-success-dim)]'
            : 'text-[var(--color-accent)] border-[var(--color-accent-border)] bg-[var(--color-accent-dim)]'
        )}
      >
        {connector.connected ? 'Connected' : 'Connect'}
      </button>
    </div>
  )
}
