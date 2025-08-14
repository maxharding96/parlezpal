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
  language: Language,
  level: Level,
  history: z.array(Message),
})

export type MessageInput = z.infer<typeof MessageInput>

export const MessageOutput = z.object({
  type: z.enum(['roleplay', 'feedback', 'qa', 'scenario']),
  content: z.string(),
})

export type MessageOutput = z.infer<typeof MessageOutput>

export const ChatClient = z.enum(['openai'])

export type ChatClient = z.infer<typeof ChatClient>
