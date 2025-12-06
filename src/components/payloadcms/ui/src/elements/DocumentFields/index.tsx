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
        // Base: w-full, flex (side by side)
        // On mid-break (< 1024px): display: block (stacked)
        'w-full flex max-lg:block',
        forceSidebarWrap && 'block isolate',
        // Prevent group-field negative margins from overflowing horizontally only
        'overflow-x-hidden',
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
            // With sidebar: border-right
            hasSidebarFields && 'border-r border-border',
            // Force wrap or mid-break: no border
            forceSidebarWrap && 'border-r-0',
            'max-lg:border-r-0',
            // Small break: less top padding
            'max-sm:pt-2',
          )}
          style={{
            paddingTop: 'calc(var(--base) * 1.5)',
            paddingBottom: 'var(--spacing-view-bottom)',
            paddingLeft: 'var(--gutter-h)',
            paddingRight:
              hasSidebarFields && !forceSidebarWrap ? 'calc(var(--base) * 2)' : 'var(--gutter-h)',
          }}
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
            // Base: sticky, 33.33% width, min-width 325px
            'sticky shrink-0',
            // Force wrap: static, full width
            forceSidebarWrap && 'static w-full h-auto min-w-0 border-l-0',
            // Mid-break (< 1024px): static, full width, stacked below main
            'max-lg:static max-lg:w-full max-lg:h-auto max-lg:border-l-0',
            // Small break: no min-width
            'max-sm:min-w-0',
          )}
          style={{
            top: forceSidebarWrap ? undefined : 'var(--doc-controls-height)',
            width: forceSidebarWrap ? '100%' : '33.33%',
            height: forceSidebarWrap ? 'auto' : 'calc(100vh - var(--doc-controls-height))',
            minWidth: forceSidebarWrap ? 0 : '325px',
          }}
        >
          <div
            className={cn(
              'w-full h-full overflow-y-auto flex flex-col min-h-full',
              // Mid-break: overflow visible, padding bottom
              'max-lg:overflow-visible',
            )}
            style={{
              paddingBottom: forceSidebarWrap ? 0 : undefined,
            }}
          >
            <div
              className={cn(
                'flex flex-col',
                // Force wrap or mid-break: no top/bottom padding, smaller gap
                forceSidebarWrap && 'pt-0 pb-0',
                'max-lg:pt-0 max-lg:pb-0',
              )}
              style={{
                gap: 'var(--base)',
                paddingTop: forceSidebarWrap ? 0 : 'calc(var(--base) * 1.5)',
                paddingBottom: forceSidebarWrap ? 0 : 'var(--spacing-view-bottom)',
                paddingLeft: forceSidebarWrap ? 'var(--gutter-h)' : 'calc(var(--base) * 2)',
                paddingRight: 'var(--gutter-h)',
              }}
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
