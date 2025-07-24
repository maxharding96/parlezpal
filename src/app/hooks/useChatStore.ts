import type { Language, Level, Message } from '@/shared/schema'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ChatStore {
  scenario: string | null
  setScenario: (scenario: string | null) => void
  language: Language | null
  setLanguage: (language: Language | null) => void
  level: Level | null
  setLevel: (level: Level | null) => void
  history: Message[]
  appendMessage: (message: Message) => void
  reset: () => void
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      scenario: null,
      setScenario: (scenario) => set({ scenario }),
      language: null,
      setLanguage: (language) => set({ language }),
      level: null,
      setLevel: (level) => set({ level }),
      history: [],
      appendMessage: (message) =>
        set((state) => ({
          history: [...state.history, message],
        })),
      reset: () =>
        set({
          scenario: null,
          language: null,
          level: null,
          history: [],
        }),
    }),
    {
      name: 'chat-history',
    }
  )
)
