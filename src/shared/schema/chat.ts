import { z } from 'zod'
import { Language, Level } from './language'

export const UserMessage = z.object({
  type: z.literal('user'),
  id: z.string(),
  content: z.string(),
  sent: z.boolean(),
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

export type AssitantMessage = z.infer<typeof AssitantMessage>

export const Message = z.discriminatedUnion('type', [
  UserMessage,
  RoleplayMessage,
  FeedbackMessage,
  QAMessage,
  ScenarioMessage,
])

export type Message = z.infer<typeof Message>

export const SendInput = z.object({
  chatId: z.string(),
  messageId: z.string(),
  prevMessage: z.string().optional(),
  language: Language,
})

export type SendInput = z.infer<typeof SendInput>

export const SendOutput = z.object({
  message: UserMessage,
})

export type SendOutput = z.infer<typeof SendOutput>

export const ReplyInput = z.object({
  chatId: z.string(),
  messageId: z.string(),
  language: Language,
  level: Level,
  history: z.array(Message),
})

export type ReplyInput = z.infer<typeof ReplyInput>

export const MessageEvent = z.object({
  type: z.enum(['roleplay', 'feedback', 'qa', 'scenario']),
  content: z.string(),
})

export type MessageEvent = z.infer<typeof MessageEvent>

export const ReplyOutput = z.object({
  message: AssitantMessage,
})

export type ReplyOutput = z.infer<typeof ReplyOutput>

export const ChatClient = z.enum(['openai'])

export type ChatClient = z.infer<typeof ChatClient>
