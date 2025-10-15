import { useShallow } from 'zustand/react/shallow'
import { useChatStore } from './useChatStore'
import { apiErrorSchema, Message, type SendInput } from '@/shared/schema'
import { useAudioStore } from './useAudioStore'
import { v4 as uuidv4 } from 'uuid'
import { uploadBlob } from '@/lib/storage'
import { toast } from 'sonner'

export function useSend() {
  const {
    chatId,
    language,
    level,
    provider,
    history,
    pushMessage,
    isInProgress,
    setState,
    setError,
  } = useChatStore(
    useShallow((state) => ({
      chatId: state.chatId,
      language: state.language,
      level: state.level,
      provider: state.provider,
      history: state.history,
      pushMessage: state.pushMessage,
      isInProgress: state.isInProgress,
      setState: state.setState,
      setError: state.setError,
    }))
  )

  const setAudioBlob = useAudioStore((state) => state.setAudioBlob)

  const generate = async (blob: Blob) => {
    // Prevent concurrent requests
    if (isInProgress()) return

    // State validation
    if (!language) {
      toast.error('Please select a language.')
      return
    }

    if (!level) {
      toast.error('Please select a level.')
      return
    }

    setState('transcribing')
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

              if (message.data.type === 'user') {
                setState('responding')
              } else {
                setState('idle')
                return message.data
              }
            } else {
              const error = apiErrorSchema.parse(data)
              throw new Error(error.message)
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
      setState('idle')
      setAudioBlob(null)
    }
  }

  return {
    generate,
  }
}
