import { getUrl } from '@/lib/storage'
import { GetBlobParams } from '@/shared/schema/storage'

export async function POST(request: Request) {
  const res = await request.json()

  console.log(res)

  const params = GetBlobParams.parse(res)
  const url = getUrl(params)

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch blob.')
  }

  const blob = await response.blob()

  return new Response(blob)
}
