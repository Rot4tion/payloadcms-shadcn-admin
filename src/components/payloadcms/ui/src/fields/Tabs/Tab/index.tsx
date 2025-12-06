'use client'

import type { ClientTab } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { tabHasName } from 'payload/shared'
import React, { useState } from 'react'

import { cn } from '@/lib/utils'
import { ErrorPill } from '../../../elements/ErrorPill/index.js'
import { WatchChildErrors } from '../../../forms/WatchChildErrors/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'

type TabProps = {
  readonly hidden?: boolean
  readonly isActive?: boolean
  readonly parentPath: string
  readonly setIsActive: () => void
  readonly tab: ClientTab
}

export const TabComponent: React.FC<TabProps> = ({
  hidden,
  isActive,
  parentPath,
  setIsActive,
  tab,
}) => {
  const { i18n } = useTranslation()
  const [errorCount, setErrorCount] = useState(undefined)

  const path = [
    // removes parent 'tabs' path segment, i.e. `_index-0`
    ...(parentPath ? parentPath.split('.').slice(0, -1) : []),
    ...(tabHasName(tab) ? [tab.name] : []),
  ]

  const fieldHasErrors = errorCount > 0

  return (
    <React.Fragment>
      <WatchChildErrors fields={tab.fields} path={path} setErrorCount={setErrorCount} />
      <button
        className={cn(
          // Base styles
          'relative flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap border-0 bg-transparent pb-3 text-sm font-medium transition-all',
          'me-4 last:me-0',
          // Underline indicator
          'after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-foreground after:opacity-0 after:transition-opacity',
          // States
          'opacity-50 hover:opacity-75 hover:after:opacity-20',
          isActive && 'opacity-100 after:opacity-100 after:h-0.5',
          fieldHasErrors && 'text-destructive after:bg-destructive',
          hidden && 'hidden',
        )}
        onClick={setIsActive}
        type="button"
      >
        {tab.label ? getTranslation(tab.label, i18n) : tabHasName(tab) ? tab.name : ''}
        {fieldHasErrors && <ErrorPill count={errorCount} i18n={i18n} />}
      </button>
    </React.Fragment>
  )
}
