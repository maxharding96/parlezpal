import type {
  MessageInput,
  MessageOutput,
  STTInput,
  STTOutput,
  TTSInput,
  TTSOutput,
} from '@/shared/schema'

export interface Chat {
  message: (input: MessageInput) => Promise<MessageOutput>

  stt: (input: STTInput) => Promise<STTOutput>

  tts: (input: TTSInput) => Promise<TTSOutput>
}
