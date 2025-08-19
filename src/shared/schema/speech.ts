import { z } from 'zod'
import { Language } from './language'

export const STTInput = z.object({
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
  chatId: z.string(),
  messageId: z.string(),
  message: z.string(),
  prevMessage: z.string().optional(),
  language: Language,
})

export type TTSInput = z.infer<typeof TTSInput>
