import type {
  GenerateScenarioOutput,
  GenerateScenarioInput,
  GenerateMessageInput,
  GenerateMessageOutput,
} from '@/shared/schema'

export interface Chat {
  generateMessage: (
    input: GenerateMessageInput
  ) => Promise<GenerateMessageOutput>

  generateScenario: (
    input: GenerateScenarioInput
  ) => Promise<GenerateScenarioOutput>
}
