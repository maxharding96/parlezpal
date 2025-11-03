import { GoogleGenAI, type Content } from '@google/genai'
import type { ReplyOutput, Message, ReplyInput } from '@/shared/schema'
import { replyMessage } from '@/shared/schema'
import {
  buildReplySystemInstuctions,
  buildStudentAudioDescription,
} from './instructions'
import type { IChat } from '../schema'

export class GeminiClient implements IChat {
  private client: GoogleGenAI

  constructor({ apiKey }: { apiKey: string }) {
    this.client = new GoogleGenAI({ apiKey })
  }

  async reply(input: ReplyInput): Promise<ReplyOutput> {
    if (input.type !== 'gemini') {
      throw new Error(
        'Invalid input: GeminiClient can only accept "gemini" type'
      )
    }

    const { message, language, level, history } = input

    const arrayBuffer = await message.arrayBuffer()
    const base64Audio = Buffer.from(arrayBuffer).toString('base64')

    const chat = this.client.chats.create({
      model: 'gemini-2.5-flash',
      history: this.formatHistory(history),
    })

    const response = await chat.sendMessage({
      message: [
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

    const unsafeReply = JSON.parse(response.text)
    const reply = replyMessage.parse(unsafeReply)

    return {
      message: reply,
    }
  }

  private formatHistory(messages: Message[]): Content[] {
    const history: Content[] = []

    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i]!

      if (message.type === 'user') {
        history.push({
          role: 'user',
          parts: [
            {
              text: message.content,
            },
          ],
        })
      } else {
        history.push({
          role: 'model',
          parts: [
            {
              text: message.content,
            },
          ],
        })
      }

      if (message.type === 'scenario_proposal') {
        break
      }
    }

    return history.reverse()
  }
}
