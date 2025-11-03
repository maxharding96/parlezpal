import type { IChat, ISpeech } from '@/server/clients/schema'
import OpenAI from 'openai'
import { zodTextFormat } from 'openai/helpers/zod'
import type {
  ReplyOutput,
  Message,
  TTSInput,
  STTInput,
  STTOutput,
  ReplyInput,
} from '@/shared/schema'
import { replyOutputSchema } from '@/shared/schema'
import type {
  ResponseInput,
  ResponseInputItem,
} from 'openai/resources/responses/responses'
import { buildGenerateMessageInstructions } from './instructions'

export class OpenAIClient implements IChat, ISpeech {
  private client: OpenAI

  constructor({ apiKey }: { apiKey: string }) {
    this.client = new OpenAI({ apiKey })
  }

  async reply(input: ReplyInput): Promise<ReplyOutput> {
    if (input.type !== 'openai') {
      throw new Error(
        'Invalid input: OpenAIClient can only accept "openai" type'
      )
    }

    const { language, level, history } = input

    const message: ResponseInputItem = {
      role: 'user',
      content: input.message,
    }

    const responsesInput = [...this.formatHistory(history), message]

    console.log(responsesInput)

    const response = await this.client.responses.parse({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      instructions: buildGenerateMessageInstructions({
        language,
        level,
      }),
      input: responsesInput,
      text: {
        format: zodTextFormat(replyOutputSchema, 'event'),
      },
    })

    const reply = response.output_parsed

    if (!reply) {
      throw new Error('No message returned from OpenAI')
    }

    return reply
  }

  async stt(input: STTInput): Promise<STTOutput> {
    const { instructions, file } = input

    const transcript = await this.client.audio.transcriptions.create({
      file,
      model: 'gpt-4o-mini-transcribe',
      prompt: instructions,
    })

    return { content: transcript.text }
  }

  async tts(input: TTSInput) {
    const { instructions, message } = input

    const blob = await this.client.audio.speech
      .create({
        model: 'gpt-4o-mini-tts',
        input: message,
        voice: 'alloy',
        instructions,
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to generate audio')
        }
        return response.blob()
      })

    return { blob }
  }

  private formatHistory(messages: Message[]): ResponseInput {
    const history: ResponseInput = []

    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i]!

      if (message.type === 'user') {
        history.push({
          role: 'user',
          content: message.content,
        })
      } else {
        history.push({
          role: 'assistant',
          content: message.content,
        })
      }

      if (message.type === 'scenario_proposal') {
        break
      }
    }

    return history.reverse()
  }
}
