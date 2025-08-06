import type { Message } from '@/shared/schema'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  User,
  MessageCircle,
  Play,
  MessageCircleQuestionMark,
  MessageCircleWarning,
  Eye,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getUrl } from '@/lib/storage'
import { useRef } from 'react'

function getMessageLabel(message: Message) {
  switch (message.type) {
    case 'user':
      return 'You'
    case 'roleplay':
      return 'Roleplay'
    case 'feedback':
      return 'Feedback'
    case 'qa':
      return 'QA'
    case 'scenario':
      return 'Scenario'
  }
}

function getMessageIcon(message: Message) {
  switch (message.type) {
    case 'user':
      return <User className="h-4 w-4" />
    case 'roleplay':
      return <MessageCircle className="h-4 w-4" />
    case 'feedback':
      return <MessageCircleWarning className="h-4 w-4" />
    case 'qa':
      return <MessageCircleQuestionMark className="h-4 w-4" />
    case 'scenario':
      return <Eye className="h-4 w-4" />
  }
}

function getMessageStyle(message: Message) {
  switch (message.type) {
    case 'user':
      return {
        container: 'ml-auto max-w-[80%]',
      }
    default:
      return {
        container: 'mr-auto max-w-[80%]',
      }
  }
}

interface ChatMessageProps {
  chatId: string
  message: Message
}

export function ChatMessage(props: ChatMessageProps) {
  const { chatId, message } = props

  const url = getUrl({
    chatId,
    messageId: message.id,
  })

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const handleClickPlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      void audio.play()
    }
  }

  const styles = getMessageStyle(message)

  return (
    <div
      className={`flex max-w-[80%] ${styles.container} first:mt-4 last:mb-4`}
    >
      <Card className="w-full">
        <CardContent>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getMessageIcon(message)}
              <Badge variant="secondary">{getMessageLabel(message)}</Badge>
            </div>
            <audio ref={audioRef} src={url} />
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleClickPlay}
            >
              <Play className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
