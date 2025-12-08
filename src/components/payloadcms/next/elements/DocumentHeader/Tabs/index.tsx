import type {
  DocumentTabClientProps,
  DocumentTabServerPropsOnly,
  PayloadRequest,
  SanitizedCollectionConfig,
  SanitizedGlobalConfig,
  SanitizedPermissions,
} from 'payload'

import { RenderServerComponent } from '@/components/payloadcms/ui/elements/RenderServerComponent'
import React from 'react'

import { ShouldRenderTabs } from './ShouldRenderTabs'
import { DefaultDocumentTab } from './Tab'
import { getTabs } from './tabs'
import { cn } from '@/lib/utils'

export const DocumentTabs: React.FC<{
  collectionConfig: SanitizedCollectionConfig
  globalConfig: SanitizedGlobalConfig
  permissions: SanitizedPermissions
  req: PayloadRequest
}> = ({ collectionConfig, globalConfig, permissions, req }) => {
  const { config } = req.payload

  const tabs = getTabs({
    collectionConfig,
    globalConfig,
  })

  /**
   * DocumentTabs - Converted to TailwindCSS
   *
   * Original SCSS doc-tabs:
   * - display: flex
   * - __tabs: flex, gap: base/2, list-style: none, items-center, m-0, pl-0
   * - @mid-break: w-full, p-0, overflow-auto, scrollbar-hidden
   * - ::after gradient overlay on mid-break
   */
  return (
    <ShouldRenderTabs>
      {/* doc-tabs */}
      <div
        className={cn(
          'flex',
          // mid-break: w-full, p-0, overflow-auto, hide scrollbar
          'max-lg:w-full max-lg:p-0 max-lg:overflow-auto max-lg:scrollbar-none max-lg:[&::-webkit-scrollbar]:hidden',
        )}
      >
        {/* doc-tabs__tabs-container */}
        <div className="max-md:mr-(--gutter-h)">
          {/* doc-tabs__tabs */}
          <ul
            className={cn(
              'flex items-center list-none m-0 pl-0',
              'max-lg:p-0 max-md:gap-(--gutter-h)',
            )}
            style={{ gap: 'calc(var(--base) / 2)' }}
          >
            {tabs?.map(({ tab: tabConfig, viewPath }, index) => {
              const { condition } = tabConfig || {}

              const meetsCondition =
                !condition ||
                condition({ collectionConfig, config, globalConfig, permissions, req })

              if (!meetsCondition) {
                return null
              }

              if (tabConfig?.Component) {
                return RenderServerComponent({
                  clientProps: {
                    path: viewPath,
                  } satisfies DocumentTabClientProps,
                  Component: tabConfig.Component,
                  importMap: req.payload.importMap,
                  key: `tab-${index}`,
                  serverProps: {
                    collectionConfig,
                    globalConfig,
                    i18n: req.i18n,
                    payload: req.payload,
                    permissions,
                    req,
                    user: req.user ?? undefined,
                  } satisfies DocumentTabServerPropsOnly,
                })
              }

              return (
                <DefaultDocumentTab
                  collectionConfig={collectionConfig}
                  globalConfig={globalConfig}
                  key={`tab-${index}`}
                  path={viewPath}
                  permissions={permissions}
                  req={req}
                  tabConfig={tabConfig}
                />
              )
            })}
          </ul>
        </div>
      </div>
    </ShouldRenderTabs>
  )
}
