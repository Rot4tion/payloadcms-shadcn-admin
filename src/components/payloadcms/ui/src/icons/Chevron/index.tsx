import React from 'react'

import { cn } from '@/lib/utils'

export const ChevronIcon: React.FC<{
  readonly ariaLabel?: string
  readonly className?: string
  readonly direction?: 'down' | 'left' | 'right' | 'up'
  readonly size?: 'large' | 'small'
}> = ({ ariaLabel, className, direction, size }) => (
  <svg
    aria-label={ariaLabel}
    className={cn(
      'size-(--base)',
      size === 'small' && 'size-3',
      direction === 'left' && 'rotate-90',
      direction === 'right' && '-rotate-90',
      direction === 'up' && 'rotate-180',
      className,
    )}
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className="fill-none stroke-current [stroke-width:var(--style-stroke-width-s)] [vector-effect:non-scaling-stroke]"
      d="M14 8L10 12L6 8"
      strokeLinecap="square"
    />
  </svg>
)
