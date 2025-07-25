import { useMutation } from './useMutation'
import { GenerateScenarioOutput } from '@/shared/schema'

export const useScenario = () =>
  useMutation('/api/scenario/generate', GenerateScenarioOutput)
