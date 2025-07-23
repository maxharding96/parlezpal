import type {
  GenerateScenarioOutput,
  GenerateScenarioInput,
  GenerateResponseInput,
  GenerateResponseOutput,
} from '@/shared/schema'

export interface Chat {
  generateResponse: (
    input: GenerateResponseInput
  ) => Promise<GenerateResponseOutput>

  generateScenario: (
    input: GenerateScenarioInput
  ) => Promise<GenerateScenarioOutput>
}
