import { env } from '@/env.js'
import {
  ElevenLabsClient,
  OpenAIClient,
  AssemblyClient,
} from '@/server/clients'

export const openai = new OpenAIClient({
  apiKey: env.OPENAI_API_KEY,
})

export const elevenlabs = new ElevenLabsClient({
  apiKey: env.ELEVENLABS_API_KEY,
})

export const assembly = new AssemblyClient({
  apiKey: env.ASSEMBLY_API_KEY,
})
