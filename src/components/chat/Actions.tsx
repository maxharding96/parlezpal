import { MessageSquareOff, MessageSquare, RotateCw } from 'lucide-react'
import { Toggle } from '@/components/ui/toggle'
import { Button } from '@/components/ui/button'
import { useChatStore } from '@/hooks'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface ActionsProps {
  showActions: boolean
  showMessages: boolean
  toggleShowMessages: () => void
}

export function Actions(props: ActionsProps) {
  const { showActions, showMessages, toggleShowMessages } = props

  const resetHistory = useChatStore((state) => state.resetHistory)

  if (!showActions) return null

  return (
    <div className="absolute top-4 left-4 z-10 flex items-center justify-between gap-2 rounded-md bg-white shadow">
      <Tooltip>
        <TooltipTrigger>
          <Toggle className="h-10 w-10" onClick={toggleShowMessages}>
            {showMessages ? <MessageSquareOff /> : <MessageSquare />}
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {showMessages
              ? 'Hide "Roleplay" messages'
              : 'Show "Roleplay" messages'}
          </p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <Button size="icon" variant="ghost" onClick={resetHistory}>
            <RotateCw />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Reset chat</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
