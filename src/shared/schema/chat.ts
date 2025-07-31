import { z } from 'zod'
import { Language, Level } from './language'

export const UserMessage = z.object({
  type: z.literal('user'),
  id: z.string(),
  content: z.string(),
})

export const RoleplayMessage = z.object({
  type: z.literal('roleplay'),
  id: z.string(),
  content: z.string(),
})

export const FeedbackMessage = z.object({
  type: z.literal('feedback'),
  id: z.string(),
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
  scenario: z.string(),
})

export type GenerateScenarioOutput = z.infer<typeof GenerateScenarioOutput>

export const GenerateMessageInput = z.object({
  chatId: z.string(),
  messageId: z.string(),
  scenario: z.string(),
  language: Language,
  level: Level,
  history: z.array(Message),
})

export type GenerateMessageInput = z.infer<typeof GenerateMessageInput>

export const GenerateMessageOutput = z.object({
  history: z.array(Message),
})

export type GenerateMessageOutput = z.infer<typeof GenerateMessageOutput>

export const GenerateMessageEvent = z.object({
  message: AssitantMessage,
})
