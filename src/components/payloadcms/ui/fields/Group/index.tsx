// @ts-nocheck payloadcms original type safe issue will fix later
'use client'

import type { GroupFieldClientComponent } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { groupHasName } from 'payload/shared'
import React, { useMemo } from 'react'

import { cn } from '@/lib/utils'
import { useCollapsible } from '../../elements/Collapsible/provider'
import { ErrorPill } from '../../elements/ErrorPill'
import { RenderCustomComponent } from '../../elements/RenderCustomComponent'
import { FieldDescription } from '../../fields/FieldDescription'
import { FieldLabel } from '../../fields/FieldLabel'
import { useFormSubmitted } from '@payloadcms/ui'
import { RenderFields } from '../../forms/RenderFields'
import { useField } from '../../forms/useField'
import { withCondition } from '../../forms/withCondition'
import { useTranslation } from '@payloadcms/ui'
import { mergeFieldStyles } from '../mergeFieldStyles'
import { useRow } from '../Row/provider'
import { fieldBaseClass } from '../shared'
import { useTabs } from '../Tabs/provider'
import { GroupProvider, useGroup } from './provider'

export const GroupFieldComponent: GroupFieldClientComponent = (props) => {
  const {
    field,
    field: { admin: { className, description, hideGutter } = {}, fields, label },
    indexPath,
    parentPath,
    parentSchemaPath,
    path,
    permissions,
    readOnly,
    schemaPath: schemaPathFromProps,
  } = props

  const schemaPath =
    schemaPathFromProps ?? (field.type === 'group' && groupHasName(field) ? field.name : path)

  const { i18n } = useTranslation()
  const { isWithinCollapsible } = useCollapsible()
  const isWithinGroup = useGroup()
  const isWithinRow = useRow()
  const isWithinTab = useTabs()

  const { customComponents: { AfterInput, BeforeInput, Description, Label } = {}, errorPaths } =
    useField({ path })

  const submitted = useFormSubmitted()
  const errorCount = errorPaths.length
  const fieldHasErrors = submitted && errorCount > 0

  const isTopLevel = !(isWithinCollapsible || isWithinGroup || isWithinRow)

  const styles = useMemo(() => mergeFieldStyles(field), [field])

  return (
    <div
      className={cn(
        fieldBaseClass,
        '-mx-[var(--gutter-h)] border-y border-border',
        isTopLevel && 'px-[var(--gutter-h)] py-8 first:border-t-0 first:pt-0',
        isWithinCollapsible && '-mx-4 p-4 first:border-t-0 first:pt-0 last:border-b-0 last:pb-0',
        isWithinGroup && 'm-0 border-0 p-0',
        isWithinRow && 'm-0 border-0',
        isWithinTab && 'first:mt-0 first:border-t-0 first:pt-0 last:mb-0 last:border-b-0 last:pb-0',
        !hideGutter && isWithinGroup && 'border-l border-border pl-6',
        fieldHasErrors && 'text-destructive',
        className,
      )}
      id={`field-${path?.replace(/\./g, '__')}`}
      style={styles}
    >
      <GroupProvider>
        <div>
          {Boolean(Label || Description || label || fieldHasErrors) && (
            <div className="mb-2 flex items-center gap-2">
              {Boolean(Label || Description || label) && (
                <header className="flex flex-col gap-1">
                  <RenderCustomComponent
                    CustomComponent={Label}
                    Fallback={
                      <h3 className="mb-0 text-lg font-semibold">
                        <FieldLabel
                          as="span"
                          label={getTranslation(label, i18n)}
                          localized={false}
                          path={path}
                          required={false}
                        />
                      </h3>
                    }
                  />
                  <RenderCustomComponent
                    CustomComponent={Description}
                    Fallback={<FieldDescription description={description} path={path} />}
                  />
                </header>
              )}
              {fieldHasErrors && <ErrorPill count={errorCount} i18n={i18n} withMessage />}
            </div>
          )}
          {BeforeInput}
          {/* Render an unnamed group differently */}
          {groupHasName(field) ? (
            <RenderFields
              fields={fields}
              margins="small"
              parentIndexPath=""
              parentPath={path}
              parentSchemaPath={schemaPath}
              permissions={permissions === true ? permissions : permissions?.fields}
              readOnly={readOnly}
            />
          ) : (
            <RenderFields
              fields={fields}
              margins="small"
              parentIndexPath={indexPath}
              parentPath={parentPath}
              parentSchemaPath={parentSchemaPath}
              permissions={permissions}
              readOnly={readOnly}
            />
          )}
        </div>
      </GroupProvider>
      {AfterInput}
    </div>
  )
}

export { GroupProvider, useGroup }

export const GroupField = withCondition(GroupFieldComponent)
