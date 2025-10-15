import type {
  PutBlobParams,
  GetUrlParams,
  UploadBlobParams,
  GetBufferParams,
  GetBlobParams,
} from '@/shared/schema/storage'
import { put } from '@vercel/blob'
import { upload } from '@vercel/blob/client'
import type { P } from 'node_modules/@vercel/blob/dist/create-folder-C02EFEPE'

const BASE_URL = 'https://u7rkby4ryvnn0orc.public.blob.vercel-storage.com'
const CONTENT_TYPE = 'audio/webm'

export function getUrl(params: GetUrlParams) {
  return BASE_URL + formatMessagePrefix(params) + '/audio.webm'
}

export async function getBuffer(params: GetBufferParams) {
  const url = getUrl(params)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch blob: ${response.statusText}`)
  }

  return response.arrayBuffer()
}

export function putBlob(blob: P, params: PutBlobParams) {
  const path = formatMessagePrefix(params) + '/audio.webm'

  return put(path, blob, {
    allowOverwrite: true,
    access: 'public',
    contentType: CONTENT_TYPE,
  })
}

export function uploadBlob(blob: Blob, params: UploadBlobParams) {
  const filename = formatMessagePrefix(params) + '/audio.webm'

  return upload(filename, blob, {
    access: 'public',
    handleUploadUrl: '/api/blob/upload',
    contentType: CONTENT_TYPE,
  })
}

function formatMessagePrefix({
  chatId,
  messageId,
}: {
  chatId: string
  messageId: string
}) {
  return `/chat/${chatId}/message/${messageId}`
}

export async function getBlob(params: GetBlobParams): Promise<Blob> {
  const response = await fetch('/api/blob/get', {
    method: 'POST',
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    throw new Error('Failed to fetch blob.')
  }

  return response.blob()
}
