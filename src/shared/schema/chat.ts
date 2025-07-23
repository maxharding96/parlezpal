import { z } from 'zod'
import { Language, Level } from './language'

export const UserMessage = z.object({
  type: z.literal('user'),
  content: z.string(),
})

export const RoleplayMessage = z.object({
  type: z.literal('roleplay'),
  content: z.string(),
})

export const FeedbackMessage = z.object({
  type: z.literal('feedback'),
  content: z.string(),
})

export const AssitantMessage = z.discriminatedUnion('type', [
  RoleplayMessage,
  FeedbackMessage,
])

export const Message = z.discriminatedUnion('type', [
  UserMessage,
  RoleplayMessage,
  FeedbackMessage,
])

export type Message = z.infer<typeof Message>

export const GenerateScenarioInput = z.object({
  language: Language,
  level: Level,
})

export type GenerateScenarioInput = z.infer<typeof GenerateScenarioInput>

export const GenerateScenarioOutput = z.object({
  content: z.string(),
})

export type GenerateScenarioOutput = z.infer<typeof GenerateScenarioOutput>

export const GenerateResponseInput = z.object({
  scenario: z.string(),
  language: Language,
  level: Level,
  messages: z.array(Message),
})

export type GenerateResponseInput = z.infer<typeof GenerateResponseInput>

export const GenerateResponseOutput = z.object({
  message: AssitantMessage,
})

export type GenerateResponseOutput = z.infer<typeof GenerateResponseOutput>
