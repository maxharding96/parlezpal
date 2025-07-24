import { useMutation } from './useMutation'
import { Scenario as ScenarioSchema } from '@/shared/schema'

export const useScenario = () =>
  useMutation('/api/scenario/generate', ScenarioSchema)
