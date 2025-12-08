'use client'
import React from 'react'

import { cn } from '@/lib/utils'
import { ChevronIcon } from '../../../icons/Chevron'

export type ClickableArrowProps = {
  direction?: 'left' | 'right'
  isDisabled?: boolean
  updatePage?: () => void
}

export const ClickableArrow: React.FC<ClickableArrowProps> = (props) => {
  const { direction = 'right', isDisabled = false, updatePage } = props

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center',
        'size-6 p-1 rounded-sm',
        'transition-colors duration-100',
        'outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'cursor-pointer hover:bg-muted',
        direction === 'right' && 'mr-1 rotate-[-90deg]',
        direction === 'left' && 'rotate-90',
        isDisabled && 'opacity-30 cursor-not-allowed hover:bg-transparent',
      )}
      disabled={isDisabled}
      onClick={!isDisabled ? updatePage : undefined}
      type="button"
    >
      <ChevronIcon />
    </button>
  )
}
