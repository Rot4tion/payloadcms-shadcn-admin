'use client'
import type { ClientField, SanitizedDocumentPermissions } from 'payload'

import { fieldIsSidebar } from 'payload/shared'
import React, { useMemo } from 'react'

import { cn } from '@/lib/utils'
import { RenderFields } from '../../forms/RenderFields/index.js'
import { TrashBanner } from '../TrashBanner/index.js'

type Args = {
  readonly AfterFields?: React.ReactNode
  readonly BeforeFields?: React.ReactNode
  readonly Description?: React.ReactNode
  readonly docPermissions: SanitizedDocumentPermissions
  readonly fields: ClientField[]
  readonly forceSidebarWrap?: boolean
  readonly isTrashed?: boolean
  readonly readOnly?: boolean
  readonly schemaPathSegments: string[]
}

export const DocumentFields: React.FC<Args> = ({
  AfterFields,
  BeforeFields,
  docPermissions,
  fields,
  forceSidebarWrap,
  isTrashed = false,
  readOnly,
  schemaPathSegments,
}) => {
  const { hasSidebarFields, mainFields, sidebarFields } = useMemo(() => {
    return fields.reduce(
      (acc, field) => {
        if (fieldIsSidebar(field)) {
          acc.sidebarFields.push(field)
          acc.mainFields.push(null)
          acc.hasSidebarFields = true
        } else {
          acc.mainFields.push(field)
          acc.sidebarFields.push(null)
        }
        return acc
      },
      {
        hasSidebarFields: false,
        mainFields: [] as ClientField[],
        sidebarFields: [] as ClientField[],
      },
    )
  }, [fields])

  return (
    <div
      className={cn(
        'document-fields w-full flex',
        hasSidebarFields && 'document-fields--has-sidebar',
        forceSidebarWrap && 'block isolate',
      )}
    >
      {/* Main content area */}
      <div
        className={cn(
          'document-fields__main w-full flex flex-col min-h-full grow',
          hasSidebarFields && 'w-[66.66%]',
          forceSidebarWrap && 'w-full min-h-0',
        )}
      >
        <div
          className={cn(
            'document-fields__edit pt-6 pb-[var(--spacing-view-bottom)] grow pl-[var(--gutter-h)] pr-8',
            hasSidebarFields && 'border-r border-border',
            forceSidebarWrap && 'border-r-0 pr-[var(--gutter-h)]',
            'max-md:pr-[var(--gutter-h)] max-md:border-r-0',
          )}
        >
          {isTrashed && <TrashBanner />}
          {BeforeFields}
          <RenderFields
            className="document-fields__fields"
            fields={mainFields}
            forceRender
            parentIndexPath=""
            parentPath=""
            parentSchemaPath={schemaPathSegments.join('.')}
            permissions={docPermissions?.fields}
            readOnly={readOnly}
          />
          {AfterFields}
        </div>
      </div>

      {/* Sidebar */}
      {hasSidebarFields ? (
        <div
          className={cn(
            'document-fields__sidebar-wrap sticky top-[var(--doc-controls-height)] w-[33.33%] h-[calc(100vh-var(--doc-controls-height))] min-w-[325px] shrink-0',
            forceSidebarWrap && 'static w-full h-auto min-w-0',
            'max-md:static max-md:w-full max-md:h-auto max-md:min-w-0',
          )}
        >
          <div className="document-fields__sidebar w-full h-full overflow-y-auto flex flex-col min-h-full max-md:pb-14 max-md:overflow-visible">
            <div
              className={cn(
                'document-fields__sidebar-fields flex flex-col gap-4 pt-6 pl-8 pr-[var(--gutter-h)] pb-[var(--spacing-view-bottom)]',
                forceSidebarWrap && 'pt-0 pb-0 pl-[var(--gutter-h)]',
                'max-md:pt-0 max-md:pb-0 max-md:pl-[var(--gutter-h)] max-md:gap-2',
              )}
            >
              <RenderFields
                fields={sidebarFields}
                forceRender
                parentIndexPath=""
                parentPath=""
                parentSchemaPath={schemaPathSegments.join('.')}
                permissions={docPermissions?.fields}
                readOnly={readOnly}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
