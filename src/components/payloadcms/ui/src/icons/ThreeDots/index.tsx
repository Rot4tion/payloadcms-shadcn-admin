import React from 'react'

import { cn } from '@/lib/utils'

export function ThreeDotsIcon({ className = '' }) {
  return (
    <div className={cn('m-0 flex flex-col items-center justify-center gap-0.5 size-8', className)}>
      <div className="size-[3px] rounded-full bg-current" />
      <div className="size-[3px] rounded-full bg-current" />
      <div className="size-[3px] rounded-full bg-current" />
    </div>
  )
}
