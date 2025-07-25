import { useMutation } from './useMutation'
import { GenerateMessageOutput } from '@/shared/schema'

export const useMessage = () =>
  useMutation('/api/message/generate', GenerateMessageOutput)
