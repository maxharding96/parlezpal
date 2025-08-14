import { z } from 'zod'
import { Language } from './language'

export const STTClient = z.enum(['assemblyai', 'openai', 'elevenlabs'])

export type STTClient = z.infer<typeof STTClient>

export const TTSClient = z.enum(['openai', 'elevenlabs'])

export type TTSClient = z.infer<typeof TTSClient>

export const STTInput = z.object({
  client: STTClient,
  chatId: z.string(),
  messageId: z.string(),
  prevMessage: z.string().optional(),
  language: Language,
})

export type STTInput = z.infer<typeof STTInput>

export const STTOutput = z.object({
  message: z.string(),
})

export type STTOutput = z.infer<typeof STTOutput>

export const TTSInput = z.object({
  client: TTSClient,
  chatId: z.string(),
  message: z.string(),
  prevMessage: z.string().optional(),
  language: Language,
})

export type TTSInput = z.infer<typeof TTSInput>

export const TTSOutput = z.object({
  messageId: z.string(),
})

export type TTSOutput = z.infer<typeof TTSOutput>
