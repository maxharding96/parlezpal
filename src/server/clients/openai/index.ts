import type { IChat, ISpeech } from '@/server/clients/schema'
import OpenAI from 'openai'
import { zodTextFormat } from 'openai/helpers/zod'
import type {
  MessageInput,
  MessageOutput,
  Message,
  TTSInput,
  TTSOutput,
  STTInput,
  STTOutput,
} from '@/shared/schema'
import { MessageOutput as MessageEvent } from '@/shared/schema'
import type { ResponseInput } from 'openai/resources/responses/responses'
import {
  buildGenerateMessageInstructions,
  buildStudentPrompt,
  buildTutorPrompt,
} from './instructions'
import { v4 as uuidv4 } from 'uuid'
import { getUrl, putBlob } from '@/lib/storage'

export class OpenAIClient implements IChat, ISpeech {
  private client: OpenAI

  constructor({ apiKey }: { apiKey: string }) {
    this.client = new OpenAI({ apiKey })
  }

  async message(input: MessageInput): Promise<MessageOutput> {
    const { history } = input

    const response = await this.client.responses.parse({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      instructions: buildGenerateMessageInstructions(input),
      input: this.formatHistory(history),
      text: {
        format: zodTextFormat(MessageEvent, 'event'),
      },
    })

    const event = response.output_parsed

    if (!event) {
      throw new Error('No message returned from OpenAI')
    }

    return event
  }

  async stt(input: STTInput): Promise<STTOutput> {
    const { chatId, messageId, language } = input

    const url = getUrl({
      chatId,
      messageId,
    })

    const audio = await fetch(url)

    const transcript = await this.client.audio.transcriptions.create({
      file: audio,
      model: 'gpt-4o-mini-transcribe',
      // language: languageToCode[language],
      prompt: buildStudentPrompt({
        language,
        prevMessage:
          "Très bien ! Donc, un croissant et une tasse de thé. Cela fait 5 euros, s'il vous plaît. Comment allez-vous payer ?",
      }),
    })

    return { message: transcript.text }
  }

  async tts(input: TTSInput): Promise<TTSOutput> {
    const { chatId, message, language, prevMessage } = input

    const messageId = uuidv4()

    const blob = await this.client.audio.speech
      .create({
        model: 'gpt-4o-mini-tts',
        input: message,
        voice: 'alloy',
        instructions: buildTutorPrompt({ language, prevMessage }),
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to generate audio')
        }
        return response.blob()
      })

    await putBlob(blob, {
      chatId,
      messageId,
    })

    return { messageId }
  }

  private formatHistory(messages: Message[]): ResponseInput {
    const history: ResponseInput = []

    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i]!

      const content = JSON.stringify({
        type: message.type,
        content: message.content,
      })

      if (message.type === 'user') {
        history.push({
          role: 'user',
          content,
        })
      } else {
        history.push({
          role: 'assistant',
          content,
        })
      }

      if (message.type === 'scenario') {
        break
      }
    }

    return history.reverse()
  }
}
