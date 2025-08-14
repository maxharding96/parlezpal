import { getUrl, putBlob } from '@/lib/storage'
import type { ISpeech } from '@/server/clients/schema'
import {
  languageToCode,
  type STTInput,
  type STTOutput,
  type TTSInput,
  type TTSOutput,
} from '@/shared/schema'
import { ElevenLabsClient as ElevenLabs } from '@elevenlabs/elevenlabs-js'
import { v4 as uuidv4 } from 'uuid'

const VOICE_ID = 'JBFqnCBsd6RMkjVDRZzb'

export class ElevenLabsClient implements ISpeech {
  private client: ElevenLabs

  constructor({ apiKey }: { apiKey: string }) {
    this.client = new ElevenLabs({ apiKey })
  }

  async stt(input: STTInput): Promise<STTOutput> {
    const { chatId, messageId, language } = input

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
      // languageCode: languageToCode[language],
    })

    if ('text' in transcript) {
      return { message: transcript.text }
    }

    throw new Error(`Failed to transcribe audio.`)
  }

  async tts(input: TTSInput): Promise<TTSOutput> {
    const { chatId, message, prevMessage, language } = input

    const messageId = uuidv4()

    const response = await this.client.textToSpeech.convert(VOICE_ID, {
      text: message,
      previousText: prevMessage,
      // languageCode: languageToCode[language],
    })

    await putBlob(response, {
      chatId,
      messageId,
    })

    return { messageId }
  }
}
