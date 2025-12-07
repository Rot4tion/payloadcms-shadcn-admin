'use client'

import React from 'react'

import { SortDownIcon } from '../../icons/Sort/index.js'
import { useListQuery } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { cn } from '@/lib/utils'

export type SortHeaderProps = {
  readonly appearance?: 'condensed' | 'default'
  readonly disable?: boolean
}

function useSort() {
  const { handleSortChange, orderableFieldName, query } = useListQuery()
  const querySort = Array.isArray(query.sort) ? query.sort[0] : query.sort
  const isActive = querySort === orderableFieldName

  const handleSortPress = () => {
    // If it's already sorted by the "_order" field, do nothing
    if (isActive) {
      return
    }
    // If NOT sorted by the "_order" field, sort by that field.
    void handleSortChange(orderableFieldName)
  }

  return { handleSortPress, isActive }
}

export const SortHeader: React.FC<SortHeaderProps> = (props) => {
  const { appearance } = props
  const { handleSortPress, isActive } = useSort()
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'flex gap-[calc(var(--base)/2)] items-center',
        appearance === 'condensed' && 'gap-[calc(var(--base)/4)]',
      )}
    >
      <div
        className={cn(
          'flex items-center gap-[calc(var(--base)/4)]',
          appearance === 'condensed' && 'gap-0',
        )}
      >
        <button
          aria-label={t('general:sortByLabelDirection', {
            direction: t('general:ascending'),
            label: 'Order',
          })}
          className={cn(
            'm-0 p-[calc(var(--base)/4)] inline-flex items-center justify-center bg-transparent border-none cursor-pointer opacity-30 hover:opacity-70',
            isActive && 'opacity-100',
          )}
          onClick={handleSortPress}
          type="button"
        >
          <SortDownIcon />
        </button>
      </div>
    </div>
  )
}
