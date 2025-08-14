import { openai } from '@/server/globals'
import { MessageInput } from '@/shared/schema'

export async function POST(req: Request) {
  const res = await req.json()
  const input = MessageInput.parse(res)

  const response = await openai.message(input)

  return Response.json(response)
}
