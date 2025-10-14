import { env } from '@/env.js'
import {
  ElevenLabsClient,
  OpenAIClient,
  AssemblyClient,
} from '@/server/clients'
import { GeminiClient } from './clients/gemini'

export const openai = new OpenAIClient({
  apiKey: env.OPENAI_API_KEY,
})

export const elevenlabs = new ElevenLabsClient({
  apiKey: env.ELEVENLABS_API_KEY,
})

export const assembly = new AssemblyClient({
  apiKey: env.ASSEMBLY_API_KEY,
})

export const gemini = new GeminiClient({
  apiKey: env.GEMINI_API_KEY,
})
