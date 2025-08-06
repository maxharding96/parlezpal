import { openaiChat } from '@/server/globals'
import { TTSInput } from '@/shared/schema'

export async function POST(req: Request) {
  const res = await req.json()
  const input = TTSInput.parse(res)

  const response = await openaiChat.tts(input)

  return Response.json(response)
}
