import { openai, gemini } from '@/server/globals'
import type {
  ChatProvider,
  Language,
  Level,
  Message,
  ReplyOutput,
} from '@/shared/schema'

export async function reply({
  provider,
  url,
  text,
  language,
  level,
  history,
}: {
  provider: ChatProvider
  url: string
  text: string
  language: Language
  level: Level
  history: Message[]
}): Promise<ReplyOutput> {
  switch (provider) {
    case 'openai':
      return openai.reply({
        type: 'openai',
        message: text,
        language,
        level,
        history,
      })
    case 'gemini': {
      const blob = await fetch(url).then((res) => res.blob())

      return gemini.reply({
        type: 'gemini',
        message: blob,
        language,
        level,
        history,
      })
    }
  }
}
