'use client'
import type { RowFieldClientComponent } from 'payload'

import React from 'react'

import { cn } from '@/lib/utils'
import { RenderFields } from '../../forms/RenderFields/index.js'
import { withCondition } from '../../forms/withCondition/index.js'
import { RowProvider } from './provider.js'

const RowFieldComponent: RowFieldClientComponent = (props) => {
  const {
    field: { admin: { className, style } = {}, fields },
    forceRender = false,
    indexPath = '',
    parentPath = '',
    parentSchemaPath = '',
    permissions,
    readOnly,
  } = props

  return (
    <RowProvider>
      <div className={cn('field-type row mb-0', className)} style={style || undefined}>
        <RenderFields
          className="flex-row! flex-wrap! gap-x-4 gap-y-3 *:min-w-0 *:flex-[1_1_calc(var(--field-width,50%)-1rem)]"
          fields={fields}
          forceRender={forceRender}
          margins={false}
          parentIndexPath={indexPath}
          parentPath={parentPath}
          parentSchemaPath={parentSchemaPath}
          permissions={permissions}
          readOnly={readOnly}
        />
      </div>
    </RowProvider>
  )
}

export const RowField = withCondition(RowFieldComponent)
