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
  GenerateMessageEvent,
  GenerateScenarioOutput as GenerateScenarioOutputEvent,
} from '@/shared/schema'
import type { ResponseInput } from 'openai/resources/responses/responses'
import {
  buildGenerateMessageInstructions,
  buildGenerateScenarioInstructions,
  buildGenerateScenarioInput,
} from './instructions'
import { v4 as uuidv4 } from 'uuid'
import { getUrl, putBlob } from '@/lib/storage'

export class OpenAIChat implements Chat {
  private client: OpenAI

  constructor({ apiKey }: { apiKey: string }) {
    this.client = new OpenAI({ apiKey })
  }

  async generateMessage(
    input: GenerateMessageInput
  ): Promise<GenerateMessageOutput> {
    const { chatId, messageId, history } = input

    const url = getUrl({
      chatId,
      messageId,
    })

    const audio = await fetch(url)

    const transcription = await this.client.audio.transcriptions.create({
      file: audio,
      model: 'gpt-4o-mini-transcribe',
      language: 'fr',
      prompt:
        'This is audio from a French roleplay excercise. The scenario is as follows: ' +
        input.scenario,
    })

    history.push({
      type: 'user',
      id: messageId,
      content: transcription.text,
    })

    const response = await this.client.responses.parse({
      model: 'gpt-4.1-nano',
      temperature: 0.7,
      instructions: buildGenerateMessageInstructions(input),
      input: this.formatHistory(history),
      text: {
        format: zodTextFormat(GenerateMessageEvent, 'event'),
      },
    })

    const event = response.output_parsed

    if (!event) {
      throw new Error('No message returned from OpenAI')
    }

    const responseId = uuidv4()

    history.push({
      ...event.message,
      id: responseId,
    })

    const blob = await this.client.audio.speech
      .create({
        model: 'gpt-4o-mini-tts',
        input: event.message.content,
        voice: 'alloy',
        instructions:
          'You are French language tutor acting out a roleplay scenario.',
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to generate audio')
        }
        return response.blob()
      })

    await putBlob(blob, {
      chatId,
      messageId: responseId,
    })

    return { history }
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
