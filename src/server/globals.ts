import { env } from '@/env.js'
import { OpenAIClient, GeminiClient } from '@/server/clients'

export const openai = new OpenAIClient({
  apiKey: env.OPENAI_API_KEY,
})

export const gemini = new GeminiClient({
  apiKey: env.GEMINI_API_KEY,
})
