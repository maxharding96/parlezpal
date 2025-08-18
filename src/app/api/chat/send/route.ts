import { openai } from '@/server/globals'
import { SendInput } from '@/shared/schema'

export async function POST(req: Request) {
  const res = await req.json()
  const input = SendInput.parse(res)

  const response = await openai.send(input)

  return Response.json(response)
}
