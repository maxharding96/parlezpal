import { getUrl, putBlob } from '@/lib/storage'
import { reply } from '@/lib/utils/clients'
import {
  buildStudentPrompt,
  buildTutorPrompt,
} from '@/server/clients/openai/instructions'
import { openai } from '@/server/globals'
import { SendInput } from '@/shared/schema'
import type { AssitantMessage, UserMessage, ApiError } from '@/shared/schema'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
  const res = await req.json()

  const { provider, messageId, chatId, history, language, level } =
    SendInput.parse(res)

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Get audio and transcribe
        const url = getUrl({
          messageId,
          chatId,
        })
        const file = await fetch(url)

        const prevMessage = history[history.length - 1]?.content

        const studentPrompt = buildStudentPrompt({ language, prevMessage })

        const text = await openai.stt({
          instructions: studentPrompt,
          file,
        })

        const userMessage: UserMessage = {
          type: 'user',
          id: messageId,
          content: text.content,
        }

        // Send user message
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(userMessage)}\n\n`)
        )

        // Get assistant reply
        const { message } = await reply({
          provider,
          url,
          text: text.content,
          language,
          level,
          history,
        })

        const assistantMessage: AssitantMessage = {
          id: uuidv4(),
          type: message.type,
          content: message.payload.message,
        }

        const tutorPrompt = buildTutorPrompt({
          language,
          prevMessage: userMessage.content,
        })

        const speech = await openai.tts({
          instructions: tutorPrompt,
          message: assistantMessage.content,
        })

        await putBlob(speech.blob, { chatId, messageId: assistantMessage.id })

        // Send assistant message
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(assistantMessage)}\n\n`)
        )

        // Close the stream
        controller.close()
      } catch (error) {
        const apiError: ApiError = {
          type: 'error',
          message: String(error),
        }

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(apiError)}\n\n`)
        )
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
