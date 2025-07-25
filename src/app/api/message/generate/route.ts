import { openaiChat } from '@/server/globals'
import { GenerateMessageInput } from '@/shared/schema'

export async function POST(req: Request) {
  const res = await req.json()
  const input = GenerateMessageInput.parse(res)

  const response = await openaiChat.generateMessage(input)

  return Response.json(response)
}
