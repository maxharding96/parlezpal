import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useChatStore } from './useChatStore'
import { apiErrorSchema, Message, type SendInput } from '@/shared/schema'
import { useAudioStore } from './useAudioStore'
import { v4 as uuidv4 } from 'uuid'
import { uploadBlob } from '@/lib/storage'
import { toast } from 'sonner'

export function useSend() {
  const { chatId, language, level, provider, history, pushMessage } =
    useChatStore(
      useShallow((state) => ({
        chatId: state.chatId,
        language: state.language,
        level: state.level,
        provider: state.provider,
        history: state.history,
        pushMessage: state.pushMessage,
      }))
    )

  const setAudioBlob = useAudioStore((state) => state.setAudioBlob)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const generate = async (blob: Blob) => {
    // Prevent concurrent requests
    if (isLoading) return

    // State validation
    if (!language) {
      toast.error('Please select a language.')
      return
    }

    if (!level) {
      toast.error('Please select a level.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const messageId = uuidv4()

      // Upload audio blob
      await uploadBlob(blob, {
        chatId,
        messageId,
      })

      const input: SendInput = {
        chatId,
        messageId,
        language,
        level,
        provider,
        history,
      }

      console.log(input)

      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { method: 'application/json' },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        throw new Error(`Message generation failed: ${response.statusText}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('Failed to get reader')
      }

      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value)
        const lines = text.split('\n\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6))
            const message = Message.safeParse(data)
            if (message.success) {
              pushMessage(message.data)

              if (message.data.type !== 'user') {
                return message.data
              }
            } else {
              const error = apiErrorSchema.parse(data)

              toast.error(error.message)
              setError(error.message)
            }
          }
        }
      }
    } catch (error) {
      console.error('Message generation error:', error)

      if (error instanceof Error) {
        setError(error.message)
      }

      toast.error('An error occurred while sending message.')
    } finally {
      setIsLoading(false)
      setAudioBlob(null)
    }
  }

  return {
    generate,
    isLoading,
    error,
  }
}
