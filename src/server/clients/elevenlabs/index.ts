import { getUrl, putBlob } from '@/lib/storage'
import type { ISpeech } from '@/server/clients/schema'
import { type STTInput, type STTOutput, type TTSInput } from '@/shared/schema'
import { ElevenLabsClient as ElevenLabs } from '@elevenlabs/elevenlabs-js'
import { v4 as uuidv4 } from 'uuid'

const VOICE_ID = 'JBFqnCBsd6RMkjVDRZzb'

export class ElevenLabsClient implements ISpeech {
  private client: ElevenLabs

  constructor({ apiKey }: { apiKey: string }) {
    this.client = new ElevenLabs({ apiKey })
  }

  async stt(input: STTInput): Promise<STTOutput> {
    const { chatId, messageId } = input

    const url = getUrl({ chatId, messageId })

    const audio = await fetch(url)

    if (!audio.ok) {
      throw new Error(`Failed to fetch audio: ${audio.statusText}`)
    }

    const file = await audio.blob()

    const transcript = await this.client.speechToText.convert({
      modelId: 'scribe_v1',
      file,
      numSpeakers: 1,
    })

    if ('text' in transcript) {
      return { message: transcript.text }
    }

    throw new Error(`Failed to transcribe audio.`)
  }

  async tts(input: TTSInput): Promise<void> {
    const { chatId, message, prevMessage } = input

    const messageId = uuidv4()

    const response = await this.client.textToSpeech.convert(VOICE_ID, {
      text: message,
      previousText: prevMessage,
    })

    await putBlob(response, {
      chatId,
      messageId,
    })
  }
}
