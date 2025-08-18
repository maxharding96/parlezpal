import type {
  SendInput,
  SendOutput,
  ReplyInput,
  ReplyOutput,
  STTInput,
  STTOutput,
  TTSInput,
  TTSOutput,
} from '@/shared/schema'

export interface IChat {
  send: (input: SendInput) => Promise<SendOutput>

  reply: (input: ReplyInput) => Promise<ReplyOutput>
}

export interface ISpeech {
  stt: (input: STTInput) => Promise<STTOutput>

  tts: (input: TTSInput) => Promise<TTSOutput>
}
