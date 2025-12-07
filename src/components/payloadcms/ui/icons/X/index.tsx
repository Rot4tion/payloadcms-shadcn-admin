import React from 'react'

import { cn } from '@/lib/utils'

export const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={cn('size-(--base)', className)}
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className="stroke-current [stroke-width:var(--style-stroke-width-s)]"
      d="M14 6L6 14M6 6L14 14"
      strokeLinecap="square"
    />
  </svg>
)
