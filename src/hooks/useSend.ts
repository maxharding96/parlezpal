import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useChatStore } from './useChatStore'
import { SendOutput } from '@/shared/schema'
import type { SendInput } from '@/shared/schema'
import { useAudioStore } from './useAudioStore'
import { v4 as uuidv4 } from 'uuid'
import { uploadBlob } from '@/lib/storage'
import { toast } from 'sonner'

export function useSend() {
  const { chatId, language, level, pushMessage, getLastMessage } = useChatStore(
    useShallow((state) => ({
      chatId: state.chatId,
      language: state.language,
      level: state.level,
      pushMessage: state.pushMessage,
      getLastMessage: state.getLastMessage,
    }))
  )

  const { audioBlob, setAudioBlob } = useAudioStore(
    useShallow((state) => ({
      audioBlob: state.audioBlob,
      setAudioBlob: state.setAudioBlob,
    }))
  )

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const generate = async () => {
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

    const lastMessage = getLastMessage()

    if (!audioBlob) {
      toast.error('Please record a message first.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const messageId = uuidv4()

      // Upload audio blob
      await uploadBlob(audioBlob, {
        chatId,
        messageId,
      })

      const input: SendInput = {
        chatId,
        messageId,
        language,
        prevMessage: lastMessage?.content,
      }

      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        throw new Error(`Message generation failed: ${response.statusText}`)
      }

      const data = await response.json()
      const { message } = SendOutput.parse(data)

      // Add user message to chat history
      pushMessage(message)
      // Reset audio state
      setAudioBlob(null)

      return message
    } catch (error) {
      console.error('Message generation error:', error)

      if (error instanceof Error) {
        setError(error.message)
      }

      toast.error('An error occurred while sending message.')
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
