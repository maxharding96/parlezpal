'use client'

import { useChatStore, useScenario, useMessage } from '@/hooks'

export default function HomePage() {
  const store = useChatStore()
  const scenario = useScenario()
  const message = useMessage()

  const handleGenerateScenario = async () => {
    if (scenario.isLoading) return

    const { language, level } = store
    if (!language || !level) {
      return
    }

    await scenario.mutate({ language, level }, (data) =>
      store.setScenario(data.scenario)
    )
  }

  const handleGenerateMessage = async () => {
    if (message.isLoading) return

    const { scenario, language, level } = store
    if (!scenario || !language || !level) {
      return
    }

    await message.mutate({ scenario, language, level }, (data) =>
      store.appendMessage(data.message)
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <button
        onClick={handleGenerateScenario}
        className="mb-4 cursor-auto rounded bg-blue-500 p-2"
      >
        Generate Scenario
      </button>
    </main>
  )
}
