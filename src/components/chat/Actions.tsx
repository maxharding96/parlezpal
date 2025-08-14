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
  showMessages: boolean
  toggleShowMessages: () => void
}

export function Actions(props: ActionsProps) {
  const { showMessages, toggleShowMessages } = props

  const resetHistory = useChatStore((state) => state.resetHistory)

  return (
    <div className="absolute z-10 flex items-center justify-between gap-2 p-4">
      <Tooltip>
        <TooltipTrigger>
          <Toggle className="h-10 w-10" onClick={toggleShowMessages}>
            {showMessages ? <MessageSquareOff /> : <MessageSquare />}
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>
          <p>{showMessages ? 'Hide messages' : 'Show messages'}</p>
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
