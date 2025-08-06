import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useChatStore } from './useChatStore'
import { MessageOutput, STTOutput } from '@/shared/schema'
import type { UserMessage } from '@/shared/schema'
import { useAudioStore } from './useAudioStore'
import { v4 as uuidv4 } from 'uuid'
import { getBlob, uploadBlob } from '@/lib/storage'
import { z } from 'zod'
import { playBlob } from '@/lib/utils/audio'

export function useMessage() {
  const { chatId, language, level, history, pushMessage } = useChatStore(
    useShallow((state) => ({
      chatId: state.chatId,
      language: state.language,
      level: state.level,
      history: state.history,
      pushMessage: state.pushMessage,
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
    if (isLoading) return

    if (!language || !level || !audioBlob) {
      console.log(
        'Missing required parameters: language, level, scenario, or audioBlob'
      )
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const userMessageId = uuidv4()

      await uploadBlob(audioBlob, {
        chatId,
        messageId: userMessageId,
      })

      const sttResponse = await fetch('/api/chat/stt', {
        method: 'POST',
        body: JSON.stringify({
          chatId,
          messageId: userMessageId,
          language,
        }),
      })

      if (!sttResponse.ok) {
        throw new Error(`STT request failed: ${sttResponse.statusText}`)
      }

      const sttData = await sttResponse.json()

      const sttOutput = STTOutput.parse(sttData)

      const userMessage: UserMessage = {
        type: 'user',
        id: userMessageId,
        content: sttOutput.message,
      }

      pushMessage(userMessage)
      setAudioBlob(null)

      const assistantMessageId = uuidv4()

      const messageResponse = await fetch('/api/chat/message', {
        method: 'POST',
        body: JSON.stringify({
          chatId,
          messageId: assistantMessageId,
          level,
          language,
          history: [...history, userMessage],
        }),
      })

      if (messageResponse.ok === false) {
        throw new Error(`A network error occurred.`)
      }

      const messageData = await messageResponse.json()

      const { message: assistantMessage } = MessageOutput.parse(messageData)

      pushMessage(assistantMessage)

      // Play the audio of the message
      await getBlob({
        chatId,
        messageId: assistantMessage.id,
      }).then((blob) => playBlob(blob))
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
