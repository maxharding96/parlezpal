import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatMessage } from './Message'
import { useChatStore } from '@/hooks'
import { useShallow } from 'zustand/react/shallow'
import { useEffect, useRef } from 'react'

export function ChatDisplay() {
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const { chatId, history } = useChatStore(
    useShallow((state) => ({
      chatId: state.chatId,
      history: state.history,
    }))
  )

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      )
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [history])

  const empty = history.length === 0

  return (
    <div className="relative flex h-full flex-col">
      <ScrollArea ref={scrollAreaRef} className="flex-1 overflow-hidden px-4">
        <div className="space-y-4">
          {empty ? (
            <div className="text-muted-foreground flex items-center justify-center p-16">
              <p>
                Get started by suggesting a scenario to practice or ask your
                tutor to come up with one for you.
              </p>
            </div>
          ) : (
            <>
              {history.map((message, index) => (
                <ChatMessage key={index} chatId={chatId} message={message} />
              ))}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
