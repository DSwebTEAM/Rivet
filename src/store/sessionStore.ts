import { create } from 'zustand'

interface SessionState {
  lastMessage: string | null
  lastMessageAt: string | null
  contextChars: number
  contextLimit: number
  summaryCount: number
  messagesUsedToday: number
  messagesDailyLimit: number
  activeSkills: string[]
  setSession: (data: Partial<Omit<SessionState, 'setSession'>>) => void
}

export const useSessionStore = create<SessionState>()((set) => ({
  lastMessage: null,
  lastMessageAt: null,
  contextChars: 0,
  contextLimit: 1000,
  summaryCount: 0,
  messagesUsedToday: 0,
  messagesDailyLimit: 100, // updated from user tier on load
  activeSkills: [],
  setSession: (data) => set((s) => ({ ...s, ...data })),
}))
