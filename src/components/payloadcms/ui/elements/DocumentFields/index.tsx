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
        // Base: w-full, flex (side by side) - default stretch alignment
        // On mid-break (< 1024px): display: block (stacked)
        'w-full flex max-lg:block',
        forceSidebarWrap && 'block isolate',
      )}
    >
      {/* Main content area */}
      <div
        className={cn(
          // Base: w-full, flex-col, min-h-full, grow
          'w-full flex flex-col min-h-full grow',
          // With sidebar: 66.66% width
          hasSidebarFields && 'w-[66.66%]',
          // Force wrap or mid-break: full width
          forceSidebarWrap && 'w-full min-h-0',
          'max-lg:w-full max-lg:min-h-0',
        )}
      >
        <div
          className={cn(
            // Base padding and grow
            'grow overflow-x-hidden',
            'pt-[calc(var(--base)*1.5)] pb-[var(--spacing-view-bottom)]',
            'pl-[var(--gutter-h)]',
            // With sidebar: border-right and right padding
            hasSidebarFields && 'border-r border-border pr-[calc(var(--base)*2)]',
            // No sidebar: use gutter-h for right padding
            !hasSidebarFields && 'pr-[var(--gutter-h)]',
            // Force wrap or mid-break: no border, use gutter-h for both sides
            forceSidebarWrap && 'border-r-0 pr-[var(--gutter-h)]',
            'max-lg:border-r-0 max-lg:pr-[var(--gutter-h)]',
            // Small break: less top padding
            'max-md:pt-[calc(var(--base)*0.5)]',
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

      {/* Sidebar - only render if has sidebar fields */}
      {hasSidebarFields ? (
        <div
          className={cn(
            // Desktop: sticky, 33.33% width, min-width 325px, fixed viewport height
            'sticky shrink-0 w-[33.33%] min-w-[325px]',
            'top-[var(--doc-controls-height)] h-[calc(100vh-var(--doc-controls-height))]',
            // Force wrap: static, full width
            forceSidebarWrap && 'static w-full h-auto min-w-0',
            // Mid-break (< 1024px): static, full width, auto height
            'max-lg:static max-lg:w-full max-lg:h-auto max-lg:min-w-0',
          )}
        >
          <div
            className={cn(
              'w-full h-full overflow-y-auto flex flex-col',
              // Mid-break: overflow visible
              'max-lg:overflow-visible max-lg:pb-[calc(var(--base)*3.5)]',
              forceSidebarWrap && 'pb-0 overflow-visible',
            )}
          >
            <div
              className={cn(
                'flex flex-col gap-[var(--base)]',
                'pt-[calc(var(--base)*1.5)] pb-[var(--spacing-view-bottom)]',
                'pl-[calc(var(--base)*2)] pr-[var(--gutter-h)]',
                // Force wrap: use gutter-h for left padding, no top/bottom padding
                forceSidebarWrap && 'pl-[var(--gutter-h)] pt-0 pb-0',
                // Mid-break: full width padding, no top/bottom padding, smaller gap
                'max-lg:pl-[var(--gutter-h)] max-lg:pt-0 max-lg:pb-0 max-lg:gap-[calc(var(--base)*0.5)]',
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
