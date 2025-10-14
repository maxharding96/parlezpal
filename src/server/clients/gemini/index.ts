import { GoogleGenAI } from '@google/genai'
import { getUrl } from '@/lib/storage'
import type { Level, Language } from '@/shared/schema'
import {
  buildReplySystemInstuctions,
  buildStudentAudioDescription,
  messageEvent,
} from './instructions'

type ReplyInput = {
  chatId: string
  messageId: string
  language: Language
  level: Level
}

export class GeminiClient {
  private client: GoogleGenAI

  constructor({ apiKey }: { apiKey: string }) {
    this.client = new GoogleGenAI({ apiKey })
  }

  async reply(input: ReplyInput) {
    const { chatId, messageId, language, level } = input

    const url = getUrl({
      chatId,
      messageId,
    })

    const blob = await fetch(url)
    const arrayBuffer = await blob.arrayBuffer()
    const base64Audio = Buffer.from(arrayBuffer).toString('base64')

    const response = await this.client.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: [
        {
          inlineData: {
            mimeType: 'audio/webm',
            data: base64Audio,
          },
        },
        buildStudentAudioDescription({ language }),
      ],
      config: {
        responseMimeType: 'application/json',
        systemInstruction: buildReplySystemInstuctions({ language, level }),
        temperature: 0.7,
      },
    })

    if (!response.text) {
      throw Error('No response text returned')
    }

    const unsafeMessage = JSON.parse(response.text)
    const message = messageEvent.parse(unsafeMessage)
  }
}
