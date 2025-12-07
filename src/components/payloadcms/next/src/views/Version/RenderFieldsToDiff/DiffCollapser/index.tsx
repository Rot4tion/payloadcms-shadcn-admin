'use client'
import type { ClientField } from 'payload'

import { ChevronIcon, FieldDiffLabel, useConfig, useTranslation } from '@payloadcms-local/ui'
import { fieldIsArrayType, fieldIsBlockType } from 'payload/shared'
import React, { useState } from 'react'

import { countChangedFields, countChangedFieldsInRows } from '../utilities/countChangedFields.js'
import { cn } from '@/lib/utils'

type Props = {
  hideGutter?: boolean
  initCollapsed?: boolean
  Label: React.ReactNode
  locales: string[] | undefined
  parentIsLocalized: boolean
  valueTo: unknown
} & (
  | {
      // fields collapser
      children: React.ReactNode
      field?: never
      fields: ClientField[]
      isIterable?: false
      valueFrom: unknown
    }
  | {
      // iterable collapser
      children: React.ReactNode
      field: ClientField
      fields?: never
      isIterable: true
      valueFrom?: unknown
    }
)

export const DiffCollapser: React.FC<Props> = ({
  children,
  field,
  fields,
  hideGutter = false,
  initCollapsed = false,
  isIterable = false,
  Label,
  locales,
  parentIsLocalized,
  valueFrom,
  valueTo,
}) => {
  const { t } = useTranslation()
  const [isCollapsed, setIsCollapsed] = useState(initCollapsed)
  const { config } = useConfig()

  let changeCount = 0

  if (isIterable) {
    if (!fieldIsArrayType(field) && !fieldIsBlockType(field)) {
      throw new Error(
        'DiffCollapser: field must be an array or blocks field when isIterable is true',
      )
    }
    const valueFromRows = valueFrom ?? []
    const valueToRows = valueTo ?? []

    if (!Array.isArray(valueFromRows) || !Array.isArray(valueToRows)) {
      throw new Error(
        'DiffCollapser: valueFrom and valueTro must be arrays when isIterable is true',
      )
    }

    changeCount = countChangedFieldsInRows({
      config,
      field,
      locales,
      parentIsLocalized,
      valueFromRows,
      valueToRows,
    })
  } else {
    changeCount = countChangedFields({
      config,
      fields,
      locales,
      parentIsLocalized,
      valueFrom,
      valueTo,
    })
  }

  return (
    <div>
      <FieldDiffLabel>
        <button
          aria-label={isCollapsed ? 'Expand' : 'Collapse'}
          className={cn(
            'cursor-pointer relative z-1 flex items-center',
            '[&_.icon]:text-muted-foreground',
            'hover:before:content-[""] hover:before:absolute hover:before:-inset-0.5 hover:before:bg-muted hover:before:rounded-sm hover:before:-z-1',
          )}
          onClick={() => setIsCollapsed(!isCollapsed)}
          type="button"
        >
          <div className="mr-[calc(var(--base)*0.3)] inline-flex h-full">{Label}</div>
          <ChevronIcon direction={isCollapsed ? 'right' : 'down'} size={'small'} />
        </button>
        {changeCount > 0 && isCollapsed && (
          <span className="font-normal ml-[calc(var(--base)*0.3)] py-0.5 px-1 bg-muted rounded-sm text-xs">
            {t('version:changedFieldsCount', { count: changeCount })}
          </span>
        )}
      </FieldDiffLabel>
      <div
        className={cn(
          !hideGutter &&
            'ltr:border-l-2 ltr:ml-[3px] ltr:pl-[calc(var(--base)*0.5)] rtl:border-r-2 rtl:mr-[3px] rtl:pr-[calc(var(--base)*0.5)] border-border',
          isCollapsed && 'hidden',
        )}
      >
        {children}
      </div>
    </div>
  )
}
