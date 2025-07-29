import { openaiChat } from '@/server/globals'
import { GenerateMessageInput } from '@/shared/schema'

export async function POST(req: Request) {
  const formData = await req.formData()

  const entries = Array.from(formData.entries())
  const unsafeInput = Object.fromEntries(entries)

  const rawData = {
    scenario: formData.get('scenario') as string,
    language: formData.get('language') as string,
    level: formData.get('level') as string,
    audioBlob: formData.get('audioBlob') as File,
    history: JSON.parse((formData.get('history') as string) || '[]'),
  }

  console.log('Received input:', unsafeInput)

  const input = GenerateMessageInput.parse(rawData)

  const response = await openaiChat.generateMessage(input)

  return Response.json(response)
}
