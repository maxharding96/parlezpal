import type {
  MessageInput,
  MessageOutput,
  STTInput,
  STTOutput,
  TTSInput,
  TTSOutput,
} from '@/shared/schema'

export interface IChat {
  message: (input: MessageInput) => Promise<MessageOutput>
}

export interface ISpeech {
  stt: (input: STTInput) => Promise<STTOutput>

  tts: (input: TTSInput) => Promise<TTSOutput>
}
