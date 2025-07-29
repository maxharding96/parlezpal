import { useMutation } from './useMutation'
import { GenerateScenarioOutput } from '@/shared/schema'
import { useChatStore } from './useChatStore'
import { useShallow } from 'zustand/react/shallow'

export function useScenario() {
  const { language, level, setScenario } = useChatStore(
    useShallow((state) => ({
      language: state.language,
      level: state.level,
      setScenario: state.setScenario,
    }))
  )

  const { mutate, isLoading } = useMutation(
    '/api/scenario/generate',
    GenerateScenarioOutput
  )

  const generate = async () => {
    if (isLoading) return

    if (!language || !level) return

    const body = JSON.stringify({
      language,
      level,
    })

    await mutate(body, (data) => setScenario(data.scenario))
  }

  return generate
}
