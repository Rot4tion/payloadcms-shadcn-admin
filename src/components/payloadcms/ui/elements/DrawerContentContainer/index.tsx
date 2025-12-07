import React from 'react'

import { cn } from '@/lib/utils'

type Props = {
  readonly children: React.ReactNode
  readonly className?: string
}
export function DrawerContentContainer({ children, className }: Props) {
  return (
    <div
      className={cn(
        'p-[calc(var(--base)*2)] px-(--gutter-h) flex flex-col overflow-auto',
        className,
      )}
    >
      {children}
    </div>
  )
}
