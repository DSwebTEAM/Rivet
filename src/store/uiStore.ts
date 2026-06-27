import { create } from 'zustand'

export type Tab = 'home' | 'space' | 'settings'

interface UiState {
  activeTab: Tab
  setTab: (tab: Tab) => void
  // Whether Telegram's BackButton is currently visible
  backButtonVisible: boolean
  setBackButton: (v: boolean) => void
}

export const useUiStore = create<UiState>()((set) => ({
  activeTab: 'home',
  setTab: (tab) => set({ activeTab: tab }),
  backButtonVisible: false,
  setBackButton: (v) => set({ backButtonVisible: v }),
}))
