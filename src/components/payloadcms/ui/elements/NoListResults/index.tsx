import React from 'react'

type NoResultsProps = {
  Actions?: React.ReactNode[]
  Message: React.ReactNode
}
export function NoListResults({ Actions, Message }: NoResultsProps) {
  return (
    <div className="px-(--base) py-[calc(var(--base)*2)] flex flex-col items-center justify-center border border-dashed border-border rounded-md text-center">
      {Message}
      {Actions && Actions.length > 0 && (
        <div className="flex gap-[calc(var(--base)/2)] mt-(--base) [&_.btn]:m-0">
          {Actions.map((action, index) => (
            <React.Fragment key={index}>{action}</React.Fragment>
          ))}
        </div>
      )}
    </div>
  )
}
