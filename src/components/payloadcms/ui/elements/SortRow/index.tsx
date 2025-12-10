'use client'

import React from 'react'

import { DragHandleIcon } from '../../icons/DragHandle'
import { useListQuery } from '@payloadcms/ui'
import { cn } from '@/lib/utils'

export const SortRow = () => {
  const { orderableFieldName, query } = useListQuery()
  const isActive = query.sort === orderableFieldName || query.sort === `-${orderableFieldName}`

  return (
    <div
      className={cn('opacity-30 cursor-not-allowed', isActive && 'cursor-grab opacity-100')}
      role="button"
      tabIndex={0}
    >
      <DragHandleIcon className="h-[22px] w-[22px] -ml-0.5 -mt-0.5 block w-min" />
    </div>
  )
}
