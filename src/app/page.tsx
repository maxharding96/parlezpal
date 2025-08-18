'use client'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { LevelSelect, LanguageSelect } from '@/components/form'
import { ChatDisplay } from '@/components/chat'
import { InstructionsDisplay } from '@/components/instructions'

export default function HomePage() {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <div className="z-10 w-full px-8 py-4 shadow">
        <h1 className="text-left text-4xl font-bold">ParlezPal</h1>
      </div>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel
              className="flex justify-center"
              defaultSize={50}
              maxSize={50}
              minSize={25}
            >
              <div className="flex h-full w-xs items-center justify-center p-6">
                <div className="flex flex-col space-y-8">
                  <LanguageSelect />
                  <LevelSelect />
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
              <InstructionsDisplay />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50} minSize={33} maxSize={66}>
          <ChatDisplay />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  )
}
