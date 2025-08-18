import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatMessage } from './Message'
import { useChatStore } from '@/hooks'
import { Actions } from './Actions'
import { useState } from 'react'

export function ChatDisplay() {
  const chatId = useChatStore((state) => state.chatId)
  const history = useChatStore((state) => state.history)

  const [showMessages, toggleShowMessages] = useState(false)
  const [showActions, setShowActions] = useState(false)
  return (
    <div
      className="relative flex h-full flex-col"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <ScrollArea className="flex-1 overflow-hidden px-4">
        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="text-muted-foreground flex items-center justify-center p-16">
              <p>
                Get started by suggesting a scenario to practice or ask your
                tutor to come up with one for you.
              </p>
            </div>
          ) : (
            history.map((message, index) => (
              <ChatMessage
                key={index}
                chatId={chatId}
                message={message}
                showMessages={showMessages}
              />
            ))
          )}
        </div>
      </ScrollArea>
      <Actions
        showActions={showActions}
        showMessages={showMessages}
        toggleShowMessages={() => toggleShowMessages((prev) => !prev)}
      />
    </div>
  )
}
