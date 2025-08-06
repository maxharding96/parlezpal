import { z } from 'zod'
import { Language, Level } from './language'

export const UserMessage = z.object({
  type: z.literal('user'),
  id: z.string(),
  content: z.string(),
})

export type UserMessage = z.infer<typeof UserMessage>

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

export const QAMessage = z.object({
  type: z.literal('qa'),
  id: z.string(),
  content: z.string(),
})

export const ScenarioMessage = z.object({
  type: z.literal('scenario'),
  id: z.string(),
  content: z.string(),
})

export const AssitantMessage = z.discriminatedUnion('type', [
  RoleplayMessage,
  FeedbackMessage,
  QAMessage,
  ScenarioMessage,
])

export const Message = z.discriminatedUnion('type', [
  UserMessage,
  RoleplayMessage,
  FeedbackMessage,
  QAMessage,
  ScenarioMessage,
])

export type Message = z.infer<typeof Message>

export const MessageInput = z.object({
  chatId: z.string(),
  language: Language,
  level: Level,
  history: z.array(Message),
})

export type MessageInput = z.infer<typeof MessageInput>

export const MessageOutput = z.object({
  message: AssitantMessage,
})

export type MessageOutput = z.infer<typeof MessageOutput>

export const MessageEvent = z.object({
  type: z.enum(['roleplay', 'feedback', 'qa', 'scenario']),
  content: z.string(),
})

export const STTInput = z.object({
  chatId: z.string(),
  messageId: z.string(),
  language: Language,
})

export type STTInput = z.infer<typeof STTInput>

export const STTOutput = z.object({
  message: z.string(),
})

export type STTOutput = z.infer<typeof STTOutput>

export const TTSInput = z.object({
  chatId: z.string(),
  message: z.string(),
  language: Language,
})

export type TTSInput = z.infer<typeof TTSInput>

export const TTSOutput = z.object({
  messageId: z.string(),
})

export type TTSOutput = z.infer<typeof TTSOutput>
