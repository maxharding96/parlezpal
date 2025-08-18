import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useChatStore } from './useChatStore'
import { ReplyOutput } from '@/shared/schema'
import type { ReplyInput } from '@/shared/schema'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'sonner'

export function useReply() {
  const {
    chatId,
    language,
    level,
    history,
    pushMessage,
    getLastMessage,
    sendMessage,
  } = useChatStore(
    useShallow((state) => ({
      chatId: state.chatId,
      language: state.language,
      level: state.level,
      history: state.history,
      pushMessage: state.pushMessage,
      getLastMessage: state.getLastMessage,
      sendMessage: state.sendMessage,
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
    if (!lastMessage) {
      toast.error('No previous message found.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Mark last message as sent
      sendMessage(lastMessage.id)

      const messageId = uuidv4()

      const input: ReplyInput = {
        chatId,
        messageId,
        language,
        level,
        history,
      }

      const response = await fetch('/api/chat/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        throw new Error(`Message generation failed: ${response.statusText}`)
      }

      const data = await response.json()
      const { message } = ReplyOutput.parse(data)

      // Add assistant message to chat history
      pushMessage(message)

      return message
    } catch (error) {
      console.error('Message generation error:', error)

      if (error instanceof Error) {
        setError(error.message)
      }

      toast.error('An error occurred while generating reply.')
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
