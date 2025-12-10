import React from 'react'

import { cn } from '@/lib/utils'

type Props = {
  readonly children: React.ReactNode
  readonly className?: string
  readonly size?: 'medium' | 'small'
}
export function UploadCard({ children, className, size = 'medium' }: Props) {
  return (
    <div
      className={cn(
        'bg-(--theme-elevation-50) border border-border rounded-sm flex items-center w-full gap-[calc(var(--base)/2)]',
        size === 'medium' && 'p-[calc(var(--base)*0.5)] [&_.thumbnail]:size-10',
        size === 'small' &&
          'py-[calc(var(--base)/3)] px-[calc(var(--base)/2)] [&_.thumbnail]:size-[25px]',
        className,
      )}
    >
      {children}
    </div>
  )
}
