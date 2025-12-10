// @ts-nocheck payloadcms original type safe issue will fix later
import type {
  PayloadRequest,
  SanitizedCollectionConfig,
  SanitizedGlobalConfig,
  SanitizedPermissions,
} from 'payload'

import { Gutter, RenderTitle } from '@/components/payloadcms/ui/exports/client'
import React from 'react'

import { DocumentTabs } from './Tabs'

/**
 * DocumentHeader - Converted to TailwindCSS
 *
 * Original SCSS doc-header:
 * - margin-top: base(0.4) = 8px
 * - padding-bottom: base(1.2) = 24px
 * - position: relative
 * - ::after border line at bottom
 *
 * @internal
 */
export const DocumentHeader: React.FC<{
  AfterHeader?: React.ReactNode
  collectionConfig?: SanitizedCollectionConfig
  globalConfig?: SanitizedGlobalConfig
  hideTabs?: boolean
  permissions: SanitizedPermissions
  req: PayloadRequest
}> = (props) => {
  const { AfterHeader, collectionConfig, globalConfig, hideTabs, permissions, req } = props

  return (
    <div
      className="w-full relative max-lg:mt-1 max-sm:mt-0"
      style={{
        marginTop: 'calc(var(--base) * 0.4)',
        paddingBottom: 'calc(var(--base) * 1.2)',
      }}
    >
      {/* Bottom border line */}
      <div className="absolute h-px bg-border w-full left-0" style={{ top: 'calc(100% - 1px)' }} />
      <Gutter>
        {/* doc-header__header - flex, items-center, gap */}
        <div className="flex items-center max-lg:flex-col" style={{ gap: 'calc(var(--base) / 2)' }}>
          {/* doc-header__title - grow, truncate, m-0 */}
          <RenderTitle className="grow whitespace-nowrap overflow-hidden text-ellipsis m-0 align-top max-lg:w-full" />
          {!hideTabs && (
            <DocumentTabs
              collectionConfig={collectionConfig}
              globalConfig={globalConfig}
              permissions={permissions}
              req={req}
            />
          )}
        </div>
        {AfterHeader ? (
          <div className="max-lg:pt-1" style={{ paddingTop: 'calc(var(--base) * 0.8)' }}>
            {AfterHeader}
          </div>
        ) : null}
      </Gutter>
    </div>
  )
}
