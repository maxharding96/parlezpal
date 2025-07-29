import { useShallow } from 'zustand/react/shallow'
import { useMutation } from './useMutation'
import { useChatStore } from './useChatStore'
import { GenerateMessageOutput } from '@/shared/schema'
import { useAudioStore } from './useAudioStore'

export function useMessage() {
  const { language, level, scenario, history, setHistory } = useChatStore(
    useShallow((state) => ({
      language: state.language,
      level: state.level,
      scenario: state.scenario,
      history: state.history,
      setHistory: state.setHistory,
    }))
  )

  const audioBlob = useAudioStore((state) => state.audioBlob)

  const { mutate, isLoading } = useMutation(
    '/api/message/generate',
    GenerateMessageOutput
  )

  const generate = async () => {
    if (isLoading) return

    if (!language || !level || !scenario || !audioBlob) return

    const formData = new FormData()
    formData.append('scenario', scenario)
    formData.append('language', language)
    formData.append('level', level)
    formData.append('audioBlob', audioBlob, 'audio.webm')
    formData.append('history', JSON.stringify(history))

    await mutate(formData, (data) => setHistory(data.history))
  }

  return generate
}
