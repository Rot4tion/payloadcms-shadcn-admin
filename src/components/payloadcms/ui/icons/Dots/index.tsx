import React from 'react'

import { cn } from '@/lib/utils'

export const Dots: React.FC<{
  ariaLabel?: string
  className?: string
  noBackground?: boolean
  orientation?: 'horizontal' | 'vertical'
}> = ({ ariaLabel, className, noBackground, orientation = 'vertical' }) => (
  <div
    aria-label={ariaLabel}
    className={cn(
      'm-0 flex items-center justify-center gap-0.5 rounded-md',
      'size-[calc(var(--base)*1.2)]',
      !noBackground && 'bg-(--theme-elevation-150) hover:bg-(--theme-elevation-250)',
      noBackground && 'bg-transparent size-auto hover:bg-transparent',
      orientation === 'horizontal' ? 'flex-row' : 'flex-col',
      className,
    )}
  >
    <div className="size-0.5 rounded-full bg-current" />
    <div className="size-0.5 rounded-full bg-current" />
    <div className="size-0.5 rounded-full bg-current" />
  </div>
)
