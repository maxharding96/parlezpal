import { openai } from '@/server/globals'
import { ReplyInput } from '@/shared/schema'

export async function POST(req: Request) {
  const res = await req.json()
  const input = ReplyInput.parse(res)

  const response = await openai.reply(input)

  return Response.json(response)
}
