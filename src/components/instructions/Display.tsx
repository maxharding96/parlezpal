'use client'

import { Instructions } from './Instructions'

function Container(props: React.PropsWithChildren) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col space-y-4">{props.children}</div>
    </div>
  )
}

export function InstructionsDisplay() {
  return (
    <Container>
      <h2 className="text-lg font-semibold">Instructions:</h2>
      <Instructions.Record />
      <Instructions.Submit />
      <Instructions.Listen />
      <Instructions.Replay />
    </Container>
  )
}
