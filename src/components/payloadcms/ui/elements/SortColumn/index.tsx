'use client'
import type { StaticLabel } from 'payload'

import React from 'react'

import { cn } from '@/lib/utils'
import { FieldLabel } from '../../fields/FieldLabel/index.js'
import { ChevronIcon } from '../../icons/Chevron/index.js'
import { useListQuery } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'

export type SortColumnProps = {
  readonly appearance?: 'condensed' | 'default'
  readonly disable?: boolean
  readonly Label: React.ReactNode
  readonly label?: StaticLabel
  readonly name: string
}

export const SortColumn: React.FC<SortColumnProps> = (props) => {
  const { name, appearance, disable = false, Label, label } = props
  const { handleSortChange, query } = useListQuery()
  const { t } = useTranslation()

  const { sort } = query

  const desc = `-${name}`
  const asc = name

  const isAscActive = sort === asc
  const isDescActive = sort === desc
  const isCondensed = appearance === 'condensed'

  return (
    <div className={cn('sort-column flex items-center gap-2 group', isCondensed && 'gap-1')}>
      <span className="overflow-hidden text-ellipsis whitespace-nowrap cursor-default">
        {Label ?? <FieldLabel hideLocale label={label} unstyled />}
      </span>
      {!disable && (
        <div className="flex items-center gap-0">
          <button
            aria-label={t('general:sortByLabelDirection', {
              direction: t('general:ascending'),
              label,
            })}
            className={cn(
              'inline-flex items-center justify-center p-1 bg-transparent border-none cursor-pointer',
              'opacity-30 hover:opacity-70 transition-opacity',
              isAscActive && 'opacity-100',
            )}
            onClick={() => void handleSortChange(asc)}
            type="button"
          >
            <ChevronIcon direction="up" />
          </button>
          <button
            aria-label={t('general:sortByLabelDirection', {
              direction: t('general:descending'),
              label,
            })}
            className={cn(
              'inline-flex items-center justify-center p-1 bg-transparent border-none cursor-pointer',
              'opacity-30 hover:opacity-70 transition-opacity',
              isDescActive && 'opacity-100',
            )}
            onClick={() => void handleSortChange(desc)}
            type="button"
          >
            <ChevronIcon />
          </button>
        </div>
      )}
    </div>
  )
}
