import { useState } from 'react'
import { z } from 'zod'

export function useMutation<X extends z.ZodTypeAny>(
  url: string,
  schema: X
): {
  mutate: (
    body: BodyInit,
    onSuccess: (data: z.infer<X>) => void
  ) => Promise<void>
  isLoading: boolean
  error: string | null
} {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const mutate = async (
    body: BodyInit,
    onSuccess: (data: z.infer<X>) => void
  ) => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(url, {
        method: 'POST',
        body,
      })

      if (res.ok === false) {
        throw new Error(`A network error occurred.`)
      }

      const jsonData = await res.json()

      const data = schema.parse(jsonData) as z.infer<X>

      onSuccess(data)
      setIsLoading(false)
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(
          `Validation error: ${e.errors.map((err) => err.message).join(', ')}`
        )
      } else if (e instanceof Error) {
        setError(e.message)
      }
      setIsLoading(false)
    }
  }

  return { mutate, isLoading, error }
}
