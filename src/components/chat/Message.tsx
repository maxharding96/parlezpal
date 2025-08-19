import type { Message } from '@/shared/schema'
import { cn } from '@/lib/utils/styles'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  User,
  MessageCircle,
  Play,
  MessageCircleQuestionMark,
  MessageCircleWarning,
  Eye,
  MessageSquareOff,
  MessageSquare,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getUrl } from '@/lib/storage'
import { useRef, useState } from 'react'

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

function getMessageStyle(message: Message, hide: boolean, tmp?: boolean) {
  switch (message.type) {
    case 'user':
      return {
        container: 'ml-auto',
        card: tmp ? 'bg-yellow-50' : '',
        label: tmp ? 'bg-yellow-100' : '',
      }
    case 'roleplay':
      return {
        container: 'mr-auto',
        card: 'bg-stone-50',
        label: 'bg-stone-100',
        text: hide ? 'bg-stone-100 text-stone-100 select-none' : '',
      }
    case 'feedback':
      return {
        container: 'mr-auto',
        card: 'bg-lime-50',
        label: 'bg-lime-100',
      }
    case 'qa':
      return {
        container: 'mr-auto',
        card: 'bg-emerald-50',
        label: 'bg-emerald-100',
      }
    case 'scenario':
      return {
        container: 'mr-auto',
        card: 'bg-green-50',
        label: 'bg-green-100',
      }
  }
}

interface ChatMessageProps {
  chatId: string
  message: Message
  tmp?: boolean
}

export function ChatMessage(props: ChatMessageProps) {
  const { chatId, message, tmp } = props

  const [hide, setHide] = useState(message.type === 'roleplay')

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

  const styles = getMessageStyle(message, hide, tmp)

  return (
    <>
      <div
        className={cn(
          'z-0 flex max-w-[80%] pt-4 first:mt-4 last:mb-4',
          styles.container
        )}
      >
        <Card className={`w-full ${styles.card}`}>
          <CardContent>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getMessageIcon(message)}
                <Badge variant="secondary" className={styles.label}>
                  {getMessageLabel(message)}
                </Badge>
              </div>
              <div className="flex gap-2">
                {message.type === 'roleplay' && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setHide(!hide)}
                      >
                        {hide ? <MessageSquare /> : <MessageSquareOff />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{hide ? 'Show message' : 'Hide message'}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={handleClickPlay}
                >
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p
              className={cn(
                'inline-block rounded-sm text-sm leading-relaxed whitespace-pre-wrap',
                styles.text
              )}
            >
              {message.content}
            </p>
          </CardContent>
        </Card>
      </div>
      <audio ref={audioRef} src={url} />
    </>
  )
}
