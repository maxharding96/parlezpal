import { TTSInput } from '@/shared/schema'
import { getTTSClient } from '@/lib/utils/clients'

export async function POST(req: Request) {
  const res = await req.json()
  const input = TTSInput.parse(res)

  const client = getTTSClient(input.client)
  const response = await client.tts(input)

  return Response.json(response)
}
