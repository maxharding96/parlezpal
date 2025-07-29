import { Kbd } from '@/components/ui/kbd'
import { useKeyPress, useScenario, useRecord, useMessage } from '@/hooks'
import { useAudioStore } from '@/hooks/useAudioStore'
import { useMemo } from 'react'

const Record = () => {
  useRecord()

  return (
    <Instruction action="Hold" keyStr=" " reaction="to record your response" />
  )
}

const GenerateScenario = () => {
  const generate = useScenario()

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
  const generate = useMessage()

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

  const audio = useMemo(() => {
    if (!audioBlob) return null

    const url = URL.createObjectURL(audioBlob)
    return new Audio(url)
  }, [audioBlob])

  if (!audio) return null

  const handlePress = () => {
    void audio.play()
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

const Replay = () => (
  <Instruction
    action="Press"
    keyStr="r"
    reaction="to replay the last message"
    onPress={() => {
      // Implement replay functionality here
    }}
  />
)

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
