import { useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { FloatingTabBar } from '@/components/layout/FloatingTabBar'
import { Home } from '@/pages/Home'
import { Space } from '@/pages/Space'
import { Settings } from '@/pages/Settings'
import { Upgrade } from '@/pages/Upgrade'
import { ConnectorOAuth } from '@/pages/ConnectorOAuth'
import { useUiStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'
import { useTelegramInit } from '@/hooks/useTelegram'
import { useUser } from '@/hooks/useUser'

// Sub-pages that suppress the floating tab bar
const SUB_PAGES = ['/upgrade', '/oauth/callback']

function TabRouter() {
  const navigate = useNavigate()
  const location = useLocation()
  const { activeTab } = useUiStore()

  useEffect(() => {
    const tabRoutes: Record<string, string> = {
      home: '/',
      space: '/space',
      settings: '/settings',
    }
    const target = tabRoutes[activeTab]
    if (
      target &&
      location.pathname !== target &&
      !SUB_PAGES.some((p) => location.pathname.startsWith(p))
    ) {
      navigate(target, { replace: true })
    }
  }, [activeTab, navigate, location.pathname])

  return null
}

export default function App() {
  const { isReady } = useAuthStore()
  const location = useLocation()
  const isSubPage = SUB_PAGES.some((p) => location.pathname.startsWith(p))

  useTelegramInit()
  useUser()

  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-full">
        <div
          className="w-6 h-6 rounded-full border-2 animate-spin"
          style={{
            borderColor: 'var(--color-accent)',
            borderTopColor: 'transparent',
          }}
          role="status"
          aria-label="Loading"
        />
      </div>
    )
  }

  return (
    <div className="relative h-full overflow-hidden bg-[var(--color-bg)]">
      <TabRouter />

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="h-full"
        >
          <Routes location={location}>
            <Route path="/"                  element={<Home />} />
            <Route path="/space"             element={<Space />} />
            <Route path="/settings"          element={<Settings />} />
            <Route path="/upgrade"           element={<Upgrade />} />
            <Route path="/oauth/callback"    element={<ConnectorOAuth />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      {!isSubPage && <FloatingTabBar />}
    </div>
  )
}
