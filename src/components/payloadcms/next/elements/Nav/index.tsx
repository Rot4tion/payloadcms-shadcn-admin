// @ts-nocheck payloadcms original type safe issue will fix later
import type { EntityToGroup } from '@/components/payloadcms/ui/exports/shared'
import type { PayloadRequest, ServerProps } from 'payload'

import { Logout } from '@/components/payloadcms/ui/exports/client'
import { RenderServerComponent } from '@/components/payloadcms/ui/elements/RenderServerComponent'
import { EntityType, groupNavItems } from '@/components/payloadcms/ui/exports/shared'
import React from 'react'

import { NavHamburger } from './NavHamburger'
import { NavWrapper } from './NavWrapper'
import { SettingsMenuButton } from './SettingsMenuButton'
import { getNavPrefs } from './getNavPrefs'
import { DefaultNavClient } from './index.client'

export type NavProps = {
  req?: PayloadRequest
} & ServerProps

export const DefaultNav: React.FC<NavProps> = async (props) => {
  const {
    documentSubViewType,
    i18n,
    locale,
    params,
    payload,
    permissions,
    req,
    searchParams,
    user,
    viewType,
    visibleEntities,
  } = props

  if (!payload?.config) {
    return null
  }

  const {
    admin: {
      components: { afterNavLinks, beforeNavLinks, logout, settingsMenu },
    },
    collections,
    globals,
  } = payload.config

  const groups = groupNavItems(
    [
      ...collections
        .filter(({ slug }) => visibleEntities.collections.includes(slug))
        .map(
          (collection) =>
            ({
              type: EntityType.collection,
              entity: collection,
            }) satisfies EntityToGroup,
        ),
      ...globals
        .filter(({ slug }) => visibleEntities.globals.includes(slug))
        .map(
          (global) =>
            ({
              type: EntityType.global,
              entity: global,
            }) satisfies EntityToGroup,
        ),
    ],
    permissions,
    i18n,
  )

  const navPreferences = await getNavPrefs(req)

  const LogoutComponent = RenderServerComponent({
    clientProps: {
      documentSubViewType,
      viewType,
    },
    Component: logout?.Button,
    Fallback: Logout,
    importMap: payload.importMap,
    serverProps: {
      i18n,
      locale,
      params,
      payload,
      permissions,
      searchParams,
      user,
    },
  })

  const renderedSettingsMenu =
    settingsMenu && Array.isArray(settingsMenu)
      ? settingsMenu.map((item, index) =>
          RenderServerComponent({
            clientProps: {
              documentSubViewType,
              viewType,
            },
            Component: item,
            importMap: payload.importMap,
            key: `settings-menu-item-${index}`,
            serverProps: {
              i18n,
              locale,
              params,
              payload,
              permissions,
              searchParams,
              user,
            },
          }),
        )
      : []

  return (
    <NavWrapper>
      {/* nav__wrap - Original: width:100%, flex-col, items-start, flex-grow:1 */}
      <nav className="w-full flex flex-col items-start grow">
        {RenderServerComponent({
          clientProps: {
            documentSubViewType,
            viewType,
          },
          Component: beforeNavLinks,
          importMap: payload.importMap,
          serverProps: {
            i18n,
            locale,
            params,
            payload,
            permissions,
            searchParams,
            user,
          },
        })}
        <DefaultNavClient groups={groups} navPreferences={navPreferences} />
        {RenderServerComponent({
          clientProps: {
            documentSubViewType,
            viewType,
          },
          Component: afterNavLinks,
          importMap: payload.importMap,
          serverProps: {
            i18n,
            locale,
            params,
            payload,
            permissions,
            searchParams,
            user,
          },
        })}
        {/* nav__controls - Original: flex-col, gap:base(0.75)=15px, mt-auto, mb-0, first-child mt:base(1)=20px */}
        <div
          className="flex flex-col mt-auto mb-0 [&>*:first-child]:mt-5"
          style={{ gap: 'calc(var(--base) * 0.75)' }}
        >
          <SettingsMenuButton settingsMenu={renderedSettingsMenu} />
          {LogoutComponent}
        </div>
      </nav>
      {/* nav__header - Original: absolute, top:0, width:100vw, height:var(--app-header-height) */}
      <div className="absolute top-0 w-screen" style={{ height: 'var(--app-header-height)' }}>
        {/* nav__header-content - Original: z-index:1, relative, h-full, w-full */}
        <div className="z-[1] relative h-full w-full">
          <NavHamburger />
        </div>
      </div>
    </NavWrapper>
  )
}
