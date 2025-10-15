'use client'

import { Kbd } from '@/components/ui/kbd'
import { useKeyPress, useRecord, useChatStore, useSend } from '@/hooks'
import { getBlob } from '@/lib/storage'
import { playBlob } from '@/lib/utils/audio'
import { toast } from 'sonner'
import { useShallow } from 'zustand/react/shallow'

const Record = () => {
  const chatId = useChatStore((state) => state.chatId)
  const { generate } = useSend()

  useRecord({
    onRecordingComplete: async (blob) => {
      const message = await generate(blob)

      if (message) {
        const blob = await getBlob({ chatId, messageId: message.id })
        void playBlob(blob)
      }
    },
  })

  return (
    <Instruction action="Hold" keyStr=" " reaction="to record your message" />
  )
}

const Playback = () => {
  const { chatId, getLastMessage } = useChatStore(
    useShallow((state) => ({
      chatId: state.chatId,
      getLastMessage: state.getLastMessage,
    }))
  )

  const handlePress = async () => {
    const lastMessage = getLastMessage()
    let blob: Blob | null = null

    if (lastMessage) {
      blob = await getBlob({
        chatId,
        messageId: lastMessage.id,
      })
    }

    if (blob) {
      playBlob(blob)
    } else {
      toast.error('No messages to replay.')
    }
  }

  return (
    <Instruction
      action="Press"
      keyStr="p"
      reaction="to playback the last message"
      onPress={handlePress}
    />
  )
}

export const Instructions = {
  Record,
  Playback,
}

interface InstructionProps {
  action: 'Hold' | 'Press'
  keyStr: string
  reaction: string
  onPress?: () => void
}

function Instruction(props: InstructionProps) {
  const { action, keyStr, reaction, onPress } = props

  const keyPressed = useKeyPress(keyStr, onPress)

  return (
    <div className="flex items-center space-x-2">
      <span className="font-medium">{`${action} `}</span>
      <Kbd size="lg" variant={keyPressed ? 'outline' : 'default'}>
        {keyStr}
      </Kbd>
      <span> {` ${reaction}`}</span>
    </div>
  )
}
