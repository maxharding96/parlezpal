import type { Language, Level, Message } from '@/shared/schema'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

interface ChatStore {
  chatId: string
  language: Language | null
  setLanguage: (language: Language | null) => void
  level: Level | null
  setLevel: (level: Level | null) => void
  history: Message[]
  pushMessage: (message: Message) => void
  getLastMessage: () => Message | null
  resetHistory: () => void
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chatId: uuidv4(),
      language: null,
      setLanguage: (language) => set({ language }),
      level: null,
      setLevel: (level) => set({ level }),
      history: [],
      pushMessage: (message) => {
        set((state) => ({
          history: [...state.history, message],
        }))
      },
      getLastMessage: () => {
        const { history } = get()
        return history.length > 0 ? history[history.length - 1]! : null
      },
      resetHistory: () => set({ history: [] }),
    }),
    {
      name: 'chat-history',
    }
  )
)
