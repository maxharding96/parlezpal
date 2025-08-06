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

export const LanguageCode = z.enum(['fr', 'es', 'de', 'it', 'pt', 'nl'])

export type LanguageCode = z.infer<typeof LanguageCode>

export const languageToCode: Record<Language, LanguageCode> = {
  French: 'fr',
  Spanish: 'es',
  German: 'de',
  Italian: 'it',
  Portuguese: 'pt',
  Dutch: 'nl',
}

export const Level = z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])

export type Level = z.infer<typeof Level>
