'use client'
import type { SingleValueProps } from 'react-select'

import React, { Fragment, useState } from 'react'
import { components as SelectComponents } from 'react-select'
import { Pencil } from 'lucide-react'

import type { ReactSelectAdapterProps } from '../../../../elements/ReactSelect/types'
import type { Option } from '../../types'

import { Tooltip } from '../../../../elements/Tooltip/index'
import { useAuth } from '../../../../providers/Auth/index'
import { useTranslation } from '../../../../providers/Translation/index'

export const SingleValue: React.FC<
  {
    selectProps: {
      // TODO Fix this - moduleResolution 16 breaks our declare module
      customProps: ReactSelectAdapterProps['customProps']
    }
  } & SingleValueProps<Option>
> = (props) => {
  const {
    children,
    data: { allowEdit, label, relationTo, value },
    selectProps: { customProps: { onDocumentOpen } = {} } = {},
  } = props

  const [showTooltip, setShowTooltip] = useState(false)
  const { t } = useTranslation()
  const { permissions } = useAuth()
  const hasReadPermission = Boolean(permissions?.collections?.[relationTo]?.read)

  return (
    <SelectComponents.SingleValue {...props} className="flex items-center">
      <div className="flex flex-1 items-center gap-2 truncate" title={label || ''}>
        <div className="flex items-center gap-1">
          <span className="truncate text-sm">{children}</span>
          {relationTo && hasReadPermission && allowEdit !== false && (
            <Fragment>
              <button
                aria-label={t('general:editLabel', { label })}
                className="flex size-4 shrink-0 items-center justify-center rounded hover:bg-muted"
                onClick={(event) => {
                  setShowTooltip(false)
                  onDocumentOpen({
                    id: value,
                    collectionSlug: relationTo,
                    hasReadPermission,
                    openInNewTab: event.metaKey || event.ctrlKey,
                  })
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.stopPropagation()
                  }
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onTouchEnd={(e) => e.stopPropagation()}
                type="button"
              >
                <Tooltip show={showTooltip}>{t('general:edit')}</Tooltip>
                <Pencil className="size-3 text-muted-foreground" />
              </button>
            </Fragment>
          )}
        </div>
      </div>
    </SelectComponents.SingleValue>
  )
}
