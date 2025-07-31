import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useChatStore } from './useChatStore'
import { GenerateMessageOutput } from '@/shared/schema'
import { useAudioStore } from './useAudioStore'
import { v4 as uuidv4 } from 'uuid'
import { getBlob, uploadBlob } from '@/lib/storage'
import { z } from 'zod'

export function useMessage() {
  const {
    chatId,
    language,
    level,
    scenario,
    history,
    setHistory,
    getLastMessage,
  } = useChatStore(
    useShallow((state) => ({
      chatId: state.chatId,
      language: state.language,
      level: state.level,
      scenario: state.scenario,
      history: state.history,
      setHistory: state.setHistory,
      getLastMessage: state.getLastMessage,
    }))
  )

  const audioBlob = useAudioStore((state) => state.audioBlob)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const generate = async () => {
    if (isLoading) return

    if (!language || !level || !scenario || !audioBlob) {
      console.log(
        'Missing required parameters: language, level, scenario, or audioBlob'
      )
      return
    }

    setIsLoading(true)
    setError(null)

    const messageId = uuidv4()

    try {
      await uploadBlob(audioBlob, {
        chatId,
        messageId,
      })

      const body = JSON.stringify({
        chatId,
        messageId,
        scenario,
        level,
        language,
        history,
      })

      const res = await fetch('/api/message/generate', {
        method: 'POST',
        body,
      })

      if (res.ok === false) {
        throw new Error(`A network error occurred.`)
      }

      const unsafeData = await res.json()

      const data = GenerateMessageOutput.parse(unsafeData)

      setHistory(data.history)

      const lastMessage = getLastMessage()

      console.log('Generated message:', lastMessage)

      if (lastMessage) {
        const blob = await getBlob({
          chatId,
          messageId: lastMessage.id,
        })
        const audioURL = URL.createObjectURL(blob)
        const audio = new Audio(audioURL)
        void audio.play()
      }
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(
          `Validation error: ${e.errors.map((err) => err.message).join(', ')}`
        )
      } else if (e instanceof Error) {
        setError(e.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    generate,
    isLoading,
    error,
  }
}
