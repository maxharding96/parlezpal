import type { ChatProvider, Language, Level, Message } from '@/shared/schema'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

type ProgressState = 'idle' | 'transcribing' | 'responding'

interface ChatStore {
  chatId: string
  language: Language | null
  setLanguage: (language: Language | null) => void
  level: Level | null
  setLevel: (level: Level | null) => void
  provider: ChatProvider
  setProvider: (provider: ChatProvider) => void
  history: Message[]
  pushMessage: (message: Message) => void
  getLastMessage: () => Message | null
  resetHistory: () => void
  state: ProgressState
  setState: (state: ProgressState) => void
  error: string | null
  setError: (error: string | null) => void
  isInProgress: () => boolean
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chatId: uuidv4(),
      language: null,
      setLanguage: (language) => set({ language }),
      level: null,
      setLevel: (level) => set({ level }),
      provider: 'gemini',
      setProvider: (provider) => set({ provider }),
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
      state: 'idle',
      setState: (state) => set({ state }),
      error: null,
      setError: (error) => set({ error }),
      isInProgress: () => {
        const { state } = get()
        return state !== 'idle'
      },
    }),
    {
      name: 'chat-history',
    }
  )
)
