import { useMutation } from './useMutation'
import { Message } from '@/shared/schema'

export const useMessage = () => useMutation('/api/response/generate', Message)
