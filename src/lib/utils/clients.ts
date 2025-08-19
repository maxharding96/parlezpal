import type { IChat, ISpeech } from '@/server/clients/schema'
import { openai, elevenlabs, assembly } from '@/server/globals'
import type { ChatClient, STTClient, TTSClient } from '@/shared/schema'

export function getTTSClient(client: TTSClient): ISpeech {
  switch (client) {
    case 'openai':
      return openai
    case 'elevenlabs':
      return elevenlabs
  }
}

export function getSTTClient(client: STTClient): ISpeech {
  switch (client) {
    case 'assemblyai':
      return assembly
    case 'openai':
      return openai
    case 'elevenlabs':
      return elevenlabs
  }
}

export function getChatClient(client: ChatClient): IChat {
  switch (client) {
    case 'openai':
      return openai
  }
}
