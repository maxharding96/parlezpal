import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatMessage } from './Message'
import { useChatStore } from '@/hooks'
import { Scenario } from './Scenario'

export function ChatDisplay() {
  const history = useChatStore((state) => state.history)

  return (
    <div className="flex h-full flex-col">
      <Scenario />
      <ScrollArea className="flex-1 overflow-hidden px-4">
        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="text-muted-foreground flex h-32 items-center justify-center">
              <p>No messages yet</p>
            </div>
          ) : (
            history.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
