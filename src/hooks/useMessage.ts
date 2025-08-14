import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useChatStore } from './useChatStore'
import { MessageOutput, STTOutput, TTSOutput } from '@/shared/schema'
import type { Message, UserMessage } from '@/shared/schema'
import { useAudioStore } from './useAudioStore'
import { v4 as uuidv4 } from 'uuid'
import { getBlob, uploadBlob } from '@/lib/storage'
import { z } from 'zod'
import { playBlob } from '@/lib/utils/audio'
import { toast } from 'sonner'

class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

class NetworkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NetworkError'
  }
}

export function useMessage() {
  const { chatId, language, level, history, pushMessage, getLastMessage } =
    useChatStore(
      useShallow((state) => ({
        chatId: state.chatId,
        language: state.language,
        level: state.level,
        history: state.history,
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

  // Early validation helper
  const validateRequirements = (): boolean => {
    if (!language) {
      toast.error('Please select a language.')
      return false
    }

    if (!level) {
      toast.error('Please select a level.')
      return false
    }

    const lastMessage = getLastMessage()
    if (!audioBlob && lastMessage?.type !== 'user') {
      toast.error('Please record a message first.')
      return false
    }

    return true
  }

  // Process speech-to-text
  const processSTT = async (userMessageId: string, localHistory: Message[]) => {
    if (!audioBlob) return

    await uploadBlob(audioBlob, {
      chatId,
      messageId: userMessageId,
    })

    const sttResponse = await fetch('/api/speech/stt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client: 'openai',
        chatId,
        messageId: userMessageId,
        language,
      }),
    })

    if (!sttResponse.ok) {
      throw new NetworkError(`STT request failed: ${sttResponse.statusText}`)
    }

    const sttData = await sttResponse.json()
    const sttOutput = STTOutput.parse(sttData)

    const userMessage: UserMessage = {
      type: 'user',
      id: userMessageId,
      content: sttOutput.message,
    }

    localHistory.push(userMessage)
    pushMessage(userMessage)
    setAudioBlob(null)
  }

  // Generate assistant message
  const generateAssistantMessage = async (localHistory: Message[]) => {
    const messageResponse = await fetch('/api/chat/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatId,
        level,
        language,
        history: localHistory,
      }),
    })

    if (!messageResponse.ok) {
      throw new NetworkError(
        `Message generation failed: ${messageResponse.statusText}`
      )
    }

    const messageData = await messageResponse.json()
    return MessageOutput.parse(messageData)
  }

  // Process text-to-speech
  const processTTS = async (messageContent: string) => {
    const ttsResponse = await fetch('/api/speech/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client: 'openai',
        chatId,
        message: messageContent,
        language,
      }),
    })

    if (!ttsResponse.ok) {
      throw new NetworkError(`TTS request failed: ${ttsResponse.statusText}`)
    }

    const ttsData = await ttsResponse.json()
    return TTSOutput.parse(ttsData)
  }

  // Play assistant audio
  const playAssistantAudio = async (messageId: string) => {
    try {
      const blob = await getBlob({
        chatId,
        messageId,
      })
      void playBlob(blob)
    } catch (error) {
      console.warn('Failed to play audio:', error)
      // Don't throw here - audio playback failure shouldn't break the flow
    }
  }

  // Error handling helper
  const handleError = (error: unknown) => {
    console.error('Message generation error:', error)

    if (error instanceof z.ZodError) {
      const message = `Validation error: ${error.errors.map((err) => err.message).join(', ')}`
      setError(message)
      toast.error(message)
    } else if (error instanceof ValidationError) {
      setError(error.message)
      toast.error(error.message)
    } else if (error instanceof NetworkError) {
      setError(error.message)
      toast.error('Network error occurred. Please try again.')
    } else if (error instanceof Error) {
      setError(error.message)
      toast.error('An unexpected error occurred.')
    } else {
      const message = 'An unknown error occurred'
      setError(message)
      toast.error(message)
    }
  }

  const generate = async () => {
    // Prevent concurrent requests
    if (isLoading) return

    // Early validation
    if (!validateRequirements()) return

    setIsLoading(true)
    setError(null)

    try {
      const userMessageId = uuidv4()
      const localHistory = [...history]

      // Process speech-to-text if audio is available
      await processSTT(userMessageId, localHistory)

      // Generate assistant message
      const output = await generateAssistantMessage(localHistory)

      // Process text-to-speech
      const { messageId: assistantMessageId } = await processTTS(output.content)

      // Add assistant message to chat
      pushMessage({
        id: assistantMessageId,
        ...output,
      })

      // Play the audio (non-blocking)
      await playAssistantAudio(assistantMessageId)
    } catch (error) {
      handleError(error)
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
