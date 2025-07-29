import { useChatStore } from '@/hooks'

export function Scenario() {
  const scenario = useChatStore((state) => state.scenario)

  return (
    <header className="z-10 p-4 shadow">
      <h2 className="text-lg font-semibold">Scenario:</h2>
      <p className="text-muted-foreground mt-2">{scenario}</p>
    </header>
  )
}
