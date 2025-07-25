import { OpenAIChat } from '@/server/chat/openai'
import { env } from '@/env.js'

export const openaiChat = new OpenAIChat({
  apiKey: env.OPENAI_API_KEY,
})
