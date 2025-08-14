'use client'

import { Kbd } from '@/components/ui/kbd'
import { useKeyPress, useRecord, useMessage, useChatStore } from '@/hooks'
import { useAudioStore } from '@/hooks/useAudioStore'
import { getBlob } from '@/lib/storage'
import { playBlob } from '@/lib/utils/audio'
import { toast } from 'sonner'

const Record = () => {
  useRecord({
    onRecordingComplete: () => toast.success('Recording saved.'),
  })

  return (
    <Instruction action="Hold" keyStr=" " reaction="to record your message" />
  )
}

const Submit = () => {
  const { generate } = useMessage()

  return (
    <Instruction
      action="Press"
      keyStr="Enter"
      reaction="to submit your message"
      onPress={generate}
    />
  )
}

const Listen = () => {
  const audioBlob = useAudioStore((state) => state.audioBlob)

  const handlePress = () => {
    if (!audioBlob) {
      toast.error('No audio recorded yet.')
      return
    }

    playBlob(audioBlob)
  }

  return (
    <Instruction
      action="Press"
      keyStr="p"
      reaction="to play back your message"
      onPress={handlePress}
    />
  )
}

const Replay = () => {
  const chatId = useChatStore((state) => state.chatId)
  const lastMessage = useChatStore((state) => state.getLastMessage())

  const handlePress = async () => {
    if (!lastMessage) {
      toast.error('No messages to replay.')
      return
    }

    const blob = await getBlob({ chatId, messageId: lastMessage.id })
    playBlob(blob)
  }

  return (
    <Instruction
      action="Press"
      keyStr="r"
      reaction="to replay the last message"
      onPress={handlePress}
    />
  )
}

export const Instructions = {
  Record,
  Submit,
  Listen,
  Replay,
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
