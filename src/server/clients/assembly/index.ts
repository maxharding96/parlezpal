import { getUrl } from '@/lib/storage'
import type { ISpeech } from '@/server/clients/schema'
import { type STTInput, type STTOutput } from '@/shared/schema'
import { AssemblyAI } from 'assemblyai'

export class AssemblyClient implements ISpeech {
  private client: AssemblyAI

  constructor({ apiKey }: { apiKey: string }) {
    this.client = new AssemblyAI({ apiKey })
  }

  async stt(input: STTInput): Promise<STTOutput> {
    const { chatId, messageId } = input

    const url = getUrl({ chatId, messageId })

    const audio = await fetch(url)

    if (!audio.ok) {
      throw new Error(`Failed to fetch audio: ${audio.statusText}`)
    }

    const file = await audio.blob()

    const transcript = await this.client.transcripts.transcribe({
      audio: file,
      speech_model: 'best',
    })

    if (!transcript?.text) {
      throw new Error('Transcription failed')
    }

    return {
      message: transcript.text,
    }
  }

  async tts(): Promise<void> {
    throw new Error('Not implemented')
  }
}
