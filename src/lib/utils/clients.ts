import type { IChat } from '@/server/clients/schema'
import { openai } from '@/server/globals'
import type { ChatClient } from '@/shared/schema'

export function getChatClient(client: ChatClient): IChat {
  switch (client) {
    case 'openai':
      return openai
  }
}
