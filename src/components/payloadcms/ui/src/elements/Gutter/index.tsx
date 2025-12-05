'use client'
import React from 'react'
import { cn } from '@/lib/utils'

export type GutterProps = {
  children: React.ReactNode
  className?: string
  left?: boolean
  negativeLeft?: boolean
  negativeRight?: boolean
  ref?: React.RefObject<HTMLDivElement>
  right?: boolean
}

export const Gutter: React.FC<GutterProps> = (props) => {
  const {
    children,
    className,
    left = true,
    negativeLeft = false,
    negativeRight = false,
    ref,
    right = true,
  } = props

  const shouldPadLeft = left && !negativeLeft
  const shouldPadRight = right && !negativeRight

  return (
    <div
      className={cn(
        shouldPadLeft && 'pl-6',
        shouldPadRight && 'pr-6',
        negativeLeft && '-ml-6',
        negativeRight && '-mr-6',
        className,
      )}
      ref={ref}
    >
      {children}
    </div>
  )
}
