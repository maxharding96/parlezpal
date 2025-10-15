import { z } from 'zod'
import { Language, Level } from './language'

export const chatProviderEnum = z.enum(['openai', 'gemini'])

export type ChatProvider = z.infer<typeof chatProviderEnum>

export const UserMessage = z.object({
  type: z.literal('user'),
  id: z.string(),
  content: z.string(),
})

export type UserMessage = z.infer<typeof UserMessage>

const assistantMessageType = z.enum([
  'scenario_proposal',
  'roleplay_response',
  'question_answer',
  'conversation_control',
])

export const AssitantMessage = z.object({
  type: assistantMessageType,
  id: z.string(),
  content: z.string(),
})

export type AssitantMessage = z.infer<typeof AssitantMessage>

export const Message = z.discriminatedUnion('type', [
  UserMessage,
  AssitantMessage,
])

export type Message = z.infer<typeof Message>

export const SendInput = z.object({
  provider: chatProviderEnum,
  messageId: z.string(),
  chatId: z.string(),
  language: Language,
  level: Level,
  history: z.array(Message),
})

export type SendInput = z.infer<typeof SendInput>

export const apiErrorSchema = z.object({
  type: z.literal('error'),
  message: z.string(),
})

export type ApiError = z.infer<typeof apiErrorSchema>

const baseReplyInputSchema = z.object({
  language: Language,
  level: Level,
  history: z.array(Message),
})

export const geminiReplyInputSchema = baseReplyInputSchema.extend({
  type: z.literal(chatProviderEnum.Values.gemini),
  message: z.instanceof(Blob),
})

export type GeminiReplyInput = z.infer<typeof geminiReplyInputSchema>

export const openaiReplyInputSchema = baseReplyInputSchema.extend({
  type: z.literal(chatProviderEnum.Values.openai),
  message: z.string(),
})

export type OpenAIReplyInput = z.infer<typeof openaiReplyInputSchema>

export const replyInputSchema = z.discriminatedUnion('type', [
  geminiReplyInputSchema,
  openaiReplyInputSchema,
])

export type ReplyInput = z.infer<typeof replyInputSchema>

const scenarioProposal = z.object({
  type: z.literal('scenario_proposal'),
  payload: z.object({
    description: z.string(),
    student_role: z.string(),
    your_role: z.string(),
    message: z.string(),
  }),
})

const roleplayResponse = z.object({
  type: z.literal('roleplay_response'),
  payload: z.object({
    feedback: z.string(),
    message: z.string(),
  }),
})

const questionAnswer = z.object({
  type: z.literal('question_answer'),
  payload: z.object({
    question: z.string(),
    message: z.string(),
  }),
})

const conversationControl = z.object({
  type: z.literal('conversation_control'),
  payload: z.object({
    message: z.string(),
  }),
})

export const replyMessage = z.discriminatedUnion('type', [
  scenarioProposal,
  roleplayResponse,
  questionAnswer,
  conversationControl,
])

export const replyOutputSchema = z.object({
  message: replyMessage,
})

export type ReplyOutput = z.infer<typeof replyOutputSchema>
