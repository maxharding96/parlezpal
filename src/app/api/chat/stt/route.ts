import { openaiChat } from '@/server/globals'
import { STTInput } from '@/shared/schema'

export async function POST(req: Request) {
  const res = await req.json()
  const input = STTInput.parse(res)

  const response = await openaiChat.stt(input)

  return Response.json(response)
}
