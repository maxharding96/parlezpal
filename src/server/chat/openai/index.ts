import type { Chat } from '@/server/chat'
import OpenAI from 'openai'
import { zodTextFormat } from 'openai/helpers/zod'
import type {
  GenerateMessageInput,
  GenerateMessageOutput,
  GenerateScenarioOutput,
  GenerateScenarioInput,
  Message,
} from '@/shared/schema'
import {
  AssitantMessage,
  GenerateScenarioOutput as GenerateScenarioOutputEvent,
} from '@/shared/schema'
import type { ResponseInput } from 'openai/resources/responses/responses'
import {
  buildGenerateMessageInstructions,
  buildGenerateScenarioInstructions,
  buildGenerateScenarioInput,
} from './instructions'

export class OpenAIChat implements Chat {
  private client: OpenAI

  constructor({ apiKey }: { apiKey: string }) {
    this.client = new OpenAI({ apiKey })
  }

  async generateMessage(
    input: GenerateMessageInput
  ): Promise<GenerateMessageOutput> {
    const { messages, ...rest } = input

    const response = await this.client.responses.parse({
      model: 'gpt-4.1-nano',
      temperature: 0.7,
      instructions: buildGenerateMessageInstructions(rest),
      input: this.formatHistory(messages),
      text: {
        format: zodTextFormat(AssitantMessage, 'message'),
      },
    })

    const message = response.output_parsed

    if (!message) {
      throw new Error('No message returned from OpenAI')
    }

    return { message }
  }

  async generateScenario(
    input: GenerateScenarioInput
  ): Promise<GenerateScenarioOutput> {
    const response = await this.client.responses.parse({
      model: 'gpt-4.1-nano',
      temperature: 0.7,
      instructions: buildGenerateScenarioInstructions(input),
      input: buildGenerateScenarioInput(input),
      text: {
        format: zodTextFormat(GenerateScenarioOutputEvent, 'event'),
      },
    })

    const message = response.output_parsed

    if (!message) {
      throw new Error('No message returned from OpenAI')
    }

    return message
  }

  private formatHistory(messages: Message[]): ResponseInput {
    return messages.map((message) => {
      switch (message.type) {
        case 'user':
          return { role: 'user', content: message.content }
        case 'roleplay':
        case 'feedback':
          return { role: 'assistant', content: message.content }
      }
    })
  }
}
