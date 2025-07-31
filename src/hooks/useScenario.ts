import { useState } from 'react'
import { GenerateScenarioOutput } from '@/shared/schema'
import { useChatStore } from './useChatStore'
import { useShallow } from 'zustand/react/shallow'
import { z } from 'zod'

export function useScenario() {
  const { language, level, setScenario } = useChatStore(
    useShallow((state) => ({
      language: state.language,
      level: state.level,
      setScenario: state.setScenario,
    }))
  )

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const generate = async () => {
    if (isLoading) return

    if (!language || !level) {
      console.log('Missing required parameters: language or level')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const body = JSON.stringify({
        language,
        level,
      })

      const res = await fetch('/api/scenario/generate', {
        method: 'POST',
        body,
      })

      if (res.ok === false) {
        throw new Error(`A network error occurred.`)
      }

      const unsafeData = await res.json()

      const data = GenerateScenarioOutput.parse(unsafeData)

      setScenario(data.scenario)
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(
          `Validation error: ${e.errors.map((err) => err.message).join(', ')}`
        )
      } else if (e instanceof Error) {
        setError(e.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    generate,
    isLoading,
    error,
  }
}
