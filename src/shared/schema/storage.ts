import { z } from 'zod'

export const GetUrlParams = z.object({
  chatId: z.string(),
  messageId: z.string(),
})

export type GetUrlParams = z.infer<typeof GetUrlParams>

export const getBufferParams = z.object({
  chatId: z.string(),
  messageId: z.string(),
})

export type GetBufferParams = z.infer<typeof getBufferParams>

export const PutBlobParams = z.object({
  chatId: z.string(),
  messageId: z.string(),
})

export type PutBlobParams = z.infer<typeof PutBlobParams>

export const UploadBlobParams = z.object({
  chatId: z.string(),
  messageId: z.string(),
})

export type UploadBlobParams = z.infer<typeof UploadBlobParams>

export const GetBlobParams = z.object({
  chatId: z.string(),
  messageId: z.string(),
})

export type GetBlobParams = z.infer<typeof GetBlobParams>
