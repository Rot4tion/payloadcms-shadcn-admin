import React from 'react'

import { cn } from '@/lib/utils'

type ListHeaderProps = {
  readonly Actions?: React.ReactNode[]
  readonly AfterListHeaderContent?: React.ReactNode
  readonly className?: string
  readonly title: string
  readonly TitleActions?: React.ReactNode[]
}
export const ListHeader: React.FC<ListHeaderProps> = (props) => {
  return (
    <header className={cn('flex items-end flex-wrap [&_.btn]:m-0', props.className)}>
      <div className="grid grid-cols-[1fr_auto] w-full">
        <div className="flex flex-wrap items-end gap-[calc(var(--base)*0.5)]">
          <h1 className="m-0">{props.title}</h1>
          {props.TitleActions.length ? (
            <div className="mb-1 flex gap-[calc(var(--base)*0.5)]">{props.TitleActions}</div>
          ) : null}
        </div>
        {props.Actions.length ? (
          <div className="mb-1 flex flex-wrap items-center gap-[calc(var(--base)*0.5)]">
            {props.Actions}
          </div>
        ) : null}
      </div>
      {props.AfterListHeaderContent ? (
        <div className="w-full">{props.AfterListHeaderContent}</div>
      ) : null}
    </header>
  )
}
