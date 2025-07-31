import type { Language, Level, Message } from '@/shared/schema'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

interface ChatStore {
  chatId: string
  scenario: string | null
  setScenario: (scenario: string | null) => void
  language: Language | null
  setLanguage: (language: Language | null) => void
  level: Level | null
  setLevel: (level: Level | null) => void
  history: Message[]
  setHistory: (history: Message[]) => void
  getLastMessage: () => Message | null
  reset: () => void
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chatId: uuidv4(),
      scenario: null,
      setScenario: (scenario) =>
        set({ chatId: uuidv4(), scenario, history: [] }),
      language: null,
      setLanguage: (language) => set({ language }),
      level: null,
      setLevel: (level) => set({ level }),
      history: [],
      setHistory: (history) => set({ history }),
      getLastMessage: () => {
        const { history } = get()
        return history.length > 0 ? history[history.length - 1]! : null
      },
      reset: () =>
        set({
          chatId: uuidv4(),
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
