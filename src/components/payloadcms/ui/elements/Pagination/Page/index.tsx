// @ts-nocheck payloadcms original type safe issue will fix later
'use client'
import React from 'react'

import { cn } from '@/lib/utils'

export type PageProps = {
  isCurrent?: boolean
  isFirstPage?: boolean
  isLastPage?: boolean
  page?: number
  updatePage?: (page) => void
}

export const Page: React.FC<PageProps> = ({
  isCurrent,
  isFirstPage = false,
  isLastPage = false,
  page = 1,
  updatePage,
}) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center',
        'size-6 p-1 rounded-sm mr-1',
        'text-sm leading-none text-foreground/80',
        'transition-colors duration-100',
        'outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'cursor-pointer hover:bg-muted',
        isCurrent && 'bg-muted text-muted-foreground cursor-default hover:bg-muted',
        isLastPage && 'mr-0',
      )}
      onClick={() => updatePage(page)}
      type="button"
    >
      {page}
    </button>
  )
}
