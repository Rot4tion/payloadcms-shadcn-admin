// @ts-nocheck payloadcms original type safe issue will fix later
'use client'
import type { MultiValueProps } from 'react-select'

import React, { Fragment, useState } from 'react'
import { components } from 'react-select'
import { Pencil } from 'lucide-react'

import type { ReactSelectAdapterProps } from '../../../../elements/ReactSelect/types'
import type { Option } from '../../types'

import { Tooltip } from '../../../../elements/Tooltip'
import { useAuth } from '../../../../providers/Auth'
import { useTranslation } from '../../../../providers/Translation'

export const MultiValueLabel: React.FC<
  {
    selectProps: {
      // TODO Fix this - moduleResolution 16 breaks our declare module
      customProps: ReactSelectAdapterProps['customProps']
    }
  } & MultiValueProps<Option>
> = (props) => {
  const {
    data: { allowEdit, label, relationTo, value },
    selectProps: { customProps: { draggableProps, onDocumentOpen } = {} } = {},
  } = props

  const { permissions } = useAuth()
  const [showTooltip, setShowTooltip] = useState(false)
  const { t } = useTranslation()
  const hasReadPermission = Boolean(permissions?.collections?.[relationTo]?.read)

  return (
    <div className="flex items-center gap-1" title={label || ''}>
      <div className="flex-1 truncate">
        <components.MultiValueLabel
          {...props}
          innerProps={{
            className: 'truncate text-sm',
            ...(draggableProps || {}),
          }}
        />
      </div>
      {relationTo && hasReadPermission && allowEdit !== false && (
        <Fragment>
          <button
            aria-label={`Edit ${label}`}
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
            <Tooltip show={showTooltip}>{t('general:editLabel', { label: '' })}</Tooltip>
            <Pencil className="size-3 text-muted-foreground" />
          </button>
        </Fragment>
      )}
    </div>
  )
}
