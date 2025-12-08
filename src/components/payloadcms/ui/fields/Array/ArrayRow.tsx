// @ts-nocheck payloadcms original type safe issue will fix later
'use client'
import type {
  ArrayField,
  ClientComponentProps,
  ClientField,
  Row,
  SanitizedFieldPermissions,
} from 'payload'

import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import type { UseDraggableSortableReturn } from '../../elements/DraggableSortable/useDraggableSortable/types'

import { cn } from '@/lib/utils'
import { ArrayAction } from '../../elements/ArrayAction/index'
import { Collapsible } from '../../elements/Collapsible/index'
import { ErrorPill } from '../../elements/ErrorPill/index'
import { ShimmerEffect } from '../../elements/ShimmerEffect/index'
import { useFormSubmitted } from '@payloadcms/ui'
import { RenderFields } from '../../forms/RenderFields/index'
import { RowLabel } from '../../forms/RowLabel/index'
import { useThrottledValue } from '../../hooks/useThrottledValue'
import { useTranslation } from '@payloadcms/ui'

type ArrayRowProps = {
  readonly addRow: (rowIndex: number) => Promise<void> | void
  readonly copyRow: (rowIndex: number) => void
  readonly CustomRowLabel?: React.ReactNode
  readonly duplicateRow: (rowIndex: number) => void
  readonly errorCount: number
  readonly fields: ClientField[]
  readonly hasMaxRows?: boolean
  readonly isLoading?: boolean
  readonly isSortable?: boolean
  readonly labels: Partial<ArrayField['labels']>
  readonly moveRow: (fromIndex: number, toIndex: number) => void
  readonly parentPath: string
  readonly pasteRow: (rowIndex: number) => void
  readonly path: string
  readonly permissions: SanitizedFieldPermissions
  readonly readOnly?: boolean
  readonly removeRow: (rowIndex: number) => void
  readonly row: Row
  readonly rowCount: number
  readonly rowIndex: number
  readonly schemaPath: string
  readonly setCollapse: (rowID: string, collapsed: boolean) => void
} & Pick<ClientComponentProps, 'forceRender'> &
  UseDraggableSortableReturn

export const ArrayRow: React.FC<ArrayRowProps> = ({
  addRow,
  attributes,
  copyRow,
  CustomRowLabel,
  duplicateRow,
  errorCount,
  fields,
  forceRender = false,
  hasMaxRows,
  isDragging,
  isLoading: isLoadingFromProps,
  isSortable,
  labels,
  listeners,
  moveRow,
  parentPath,
  pasteRow,
  path,
  permissions,
  readOnly,
  removeRow,
  row,
  rowCount,
  rowIndex,
  schemaPath,
  setCollapse,
  setNodeRef,
  transform,
  transition,
}) => {
  const isLoading = useThrottledValue(isLoadingFromProps, 500)

  const { i18n } = useTranslation()
  const hasSubmitted = useFormSubmitted()

  const fallbackLabel = `${getTranslation(labels.singular, i18n)} ${String(rowIndex + 1).padStart(
    2,
    '0',
  )}`

  const fieldHasErrors = errorCount > 0 && hasSubmitted

  return (
    <div
      id={`${parentPath.split('.').join('-')}-row-${rowIndex}`}
      key={`${parentPath}-row-${row.id}`}
      ref={setNodeRef}
      style={{
        transform,
        transition,
        zIndex: isDragging ? 1 : undefined,
      }}
    >
      <Collapsible
        actions={
          !readOnly ? (
            <ArrayAction
              addRow={addRow}
              copyRow={copyRow}
              duplicateRow={duplicateRow}
              hasMaxRows={hasMaxRows ?? false}
              index={rowIndex}
              isSortable={isSortable}
              moveRow={moveRow}
              pasteRow={pasteRow}
              removeRow={removeRow}
              rowCount={rowCount}
            />
          ) : undefined
        }
        className={cn('array-row', fieldHasErrors && 'has-errors')}
        collapsibleStyle={fieldHasErrors ? 'error' : 'default'}
        dragHandleProps={
          isSortable
            ? {
                id: row.id,
                attributes,
                listeners,
              }
            : undefined
        }
        header={
          <div className="flex items-center gap-2">
            {isLoading ? (
              <ShimmerEffect height="1rem" width="8rem" />
            ) : (
              <RowLabel
                CustomComponent={CustomRowLabel}
                label={fallbackLabel}
                path={path}
                rowNumber={rowIndex}
              />
            )}
            {fieldHasErrors && <ErrorPill count={errorCount} i18n={i18n} withMessage />}
          </div>
        }
        isCollapsed={row.collapsed}
        onToggle={(collapsed) => setCollapse(row.id, collapsed)}
      >
        {isLoading ? (
          <ShimmerEffect />
        ) : (
          <RenderFields
            className="flex flex-col gap-4"
            fields={fields}
            forceRender={forceRender}
            margins="small"
            parentIndexPath=""
            parentPath={path}
            parentSchemaPath={schemaPath}
            permissions={permissions === true ? permissions : permissions?.fields}
            readOnly={readOnly}
          />
        )}
      </Collapsible>
    </div>
  )
}
