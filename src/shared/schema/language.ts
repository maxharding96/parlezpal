import { z } from 'zod'

export const Language = z.enum([
  'French',
  'Spanish',
  'German',
  'Italian',
  'Portuguese',
  'Dutch',
])

export type Language = z.infer<typeof Language>

export const Level = z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])

export type Level = z.infer<typeof Level>
