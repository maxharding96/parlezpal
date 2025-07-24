import { useState } from 'react'
import type { z } from 'zod'

export function useMutation<X extends z.ZodTypeAny, Y>(
  url: string,
  schema: X
): {
  mutate: (body: Y, onSuccess: (data: z.infer<X>) => void) => Promise<void>
  isLoading: boolean
  error: string | null
} {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const mutate = async (body: Y, onSuccess: (data: z.infer<X>) => void) => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (res.ok === false) {
        throw new Error(`A network error occurred.`)
      }

      const jsonData: unknown = await res.json()

      const data = schema.parse(jsonData) as z.infer<X>

      onSuccess(data)
      setIsLoading(false)
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      }
      setIsLoading(false)
    }
  }

  return { mutate, isLoading, error }
}
