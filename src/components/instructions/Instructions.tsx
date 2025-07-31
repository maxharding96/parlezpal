'use client'

import { Kbd } from '@/components/ui/kbd'
import {
  useKeyPress,
  useScenario,
  useRecord,
  useMessage,
  useChatStore,
} from '@/hooks'
import { useAudioStore } from '@/hooks/useAudioStore'
import { getBlob } from '@/lib/storage'
import { playBlob } from '@/lib/utils/audio'

const Record = () => {
  useRecord()

  return (
    <Instruction action="Hold" keyStr=" " reaction="to record your response" />
  )
}

const GenerateScenario = () => {
  const { generate } = useScenario()

  return (
    <Instruction
      action="Press"
      keyStr="g"
      reaction="to generate a scenario"
      onPress={generate}
    />
  )
}

const Submit = () => {
  const audioBlob = useAudioStore((state) => state.audioBlob)
  const { generate } = useMessage()

  if (!audioBlob) return null

  return (
    <Instruction
      action="Press"
      keyStr="Enter"
      reaction="to submit your response"
      onPress={generate}
    />
  )
}

const Listen = () => {
  const audioBlob = useAudioStore((state) => state.audioBlob)

  if (!audioBlob) return null

  const handlePress = () => {
    playBlob(audioBlob)
  }

  return (
    <Instruction
      action="Press"
      keyStr="p"
      reaction="to play back to your recording"
      onPress={handlePress}
    />
  )
}

const Replay = () => {
  const chatId = useChatStore((state) => state.chatId)
  const lastMessage = useChatStore((state) => state.getLastMessage())

  const handlePress = async () => {
    if (!lastMessage) return

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
  GenerateScenario,
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
