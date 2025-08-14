import { STTInput } from '@/shared/schema'
import { getSTTClient } from '@/lib/utils/clients'

export async function POST(req: Request) {
  const res = await req.json()
  const input = STTInput.parse(res)

  const client = getSTTClient(input.client)
  const response = await client.stt(input)

  return Response.json(response)
}
