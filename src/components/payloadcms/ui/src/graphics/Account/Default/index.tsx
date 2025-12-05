import React from 'react'
import { cn } from '@/lib/utils'

export const DefaultAccountIcon: React.FC<{
  active?: boolean
  className?: string
}> = ({ active, className }) => (
  <svg className={cn('size-6', className)} viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
    <circle
      className={cn(
        'fill-muted stroke-border transition-colors',
        active && 'fill-muted-foreground stroke-foreground',
        !active && 'group-hover:fill-muted-foreground/20 group-hover:stroke-muted-foreground',
      )}
      cx="12.5"
      cy="12.5"
      r="11.5"
      strokeWidth="1"
    />
    <circle
      className={cn(
        'fill-muted-foreground/50 transition-colors',
        active && 'fill-foreground',
        !active && 'group-hover:fill-muted-foreground',
      )}
      cx="12.5"
      cy="10.73"
      r="3.98"
    />
    <path
      className={cn(
        'fill-muted-foreground/50 transition-colors',
        active && 'fill-foreground',
        !active && 'group-hover:fill-muted-foreground',
      )}
      d="M12.5,24a11.44,11.44,0,0,0,7.66-2.94c-.5-2.71-3.73-4.8-7.66-4.8s-7.16,2.09-7.66,4.8A11.44,11.44,0,0,0,12.5,24Z"
    />
  </svg>
)
