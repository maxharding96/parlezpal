import type { Message } from '@/shared/schema'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, MessageCircle, MessageSquare, Play } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

function getMessageLabel(message: Message) {
  switch (message.type) {
    case 'user':
      return 'You'
    case 'roleplay':
      return 'Roleplay'
    case 'feedback':
      return 'Feedback'
  }
}

function getMessageIcon(message: Message) {
  switch (message.type) {
    case 'user':
      return <User className="h-4 w-4" />
    case 'roleplay':
      return <MessageCircle className="h-4 w-4" />
    case 'feedback':
      return <MessageSquare className="h-4 w-4" />
  }
}

function getMessageStyle(message: Message) {
  switch (message.type) {
    case 'user':
      return {
        container: 'ml-auto max-w-[80%]',
      }
    case 'roleplay':
      return {
        container: 'mr-auto max-w-[80%]',
      }
    case 'feedback':
      return {
        container: 'mr-auto max-w-[80%]',
      }
  }
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage(props: ChatMessageProps) {
  const { message } = props

  const handlePlayAudio = () => {
    return
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
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handlePlayAudio()}
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
