import { z } from 'zod'

export const STTInput = z.object({
  instructions: z.string(),
  file: z.instanceof(Response),
})

export type STTInput = z.infer<typeof STTInput>

export const STTOutput = z.object({
  content: z.string(),
})

export type STTOutput = z.infer<typeof STTOutput>

export const TTSInput = z.object({
  instructions: z.string(),
  message: z.string(),
})

export type TTSInput = z.infer<typeof TTSInput>

export const TTSOutput = z.object({
  blob: z.instanceof(Blob),
})

export type TTSOutput = z.infer<typeof TTSOutput>
