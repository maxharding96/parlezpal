import { openaiChat } from '@/server/globals'
import { GenerateScenarioInput } from '@/shared/schema'

export async function POST(req: Request) {
  const res = await req.json()
  const input = GenerateScenarioInput.parse(res)

  const response = await openaiChat.generateScenario(input)

  return Response.json(response)
}
