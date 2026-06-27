import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: '/',
  build: {
    chunkSizeWarningLimit: 700,
    // Vite 8 / rolldown bundler chunk splitting
    // (advancedChunks works today; codeSplitting is the newer API — revisit on next Vite minor)
    rolldownOptions: {
      output: {
        advancedChunks: {
          groups: [
            { name: 'vendor-react', test: /node_modules\/(react|react-dom|react-router)/ },
            { name: 'vendor-motion', test: /node_modules\/motion/ },
            { name: 'vendor-supabase', test: /node_modules\/@supabase/ },
            { name: 'vendor-tg', test: /node_modules\/@telegram-apps/ },
          ],
        },
      },
    },
  },
})
