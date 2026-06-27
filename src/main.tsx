import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppRoot } from '@telegram-apps/telegram-ui'
import { Toaster } from 'sonner'
// TG-UI styles must come before our own so our tokens override theirs
import '@telegram-apps/telegram-ui/dist/styles.css'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/*
      AppRoot handles:
      - iOS vs Android platform detection (adjusts component behaviour/style)
      - Telegram theme param injection via CSS custom properties
      - Safe area context for all child TG-UI components
    */}
    <AppRoot>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: 'rgba(30,30,38,0.95)',
              border: '0.5px solid rgba(255,255,255,0.1)',
              color: 'var(--color-text-primary)',
              fontSize: '13px',
              borderRadius: '12px',
            },
          }}
        />
      </BrowserRouter>
    </AppRoot>
  </StrictMode>
)
