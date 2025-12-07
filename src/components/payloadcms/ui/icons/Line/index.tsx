import React from 'react'

import { cn } from '@/lib/utils'

export const LineIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={cn('icon icon--line', className)}
    fill="none"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path className="stroke" stroke="currentColor" d="M5.33333 10H14.6667" strokeLinecap="square" />
  </svg>
)
