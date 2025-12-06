import type {
  CustomComponent,
  DocumentSubViewTypes,
  PayloadRequest,
  ServerProps,
  ViewTypes,
  VisibleEntities,
} from 'payload'

import {
  ActionsProvider,
  AppHeader,
  BulkUploadProvider,
  EntityVisibilityProvider,
  NavToggler,
} from '@payloadcms-local/ui'
import { RenderServerComponent } from '@payloadcms-local/ui/elements/RenderServerComponent'
import React from 'react'

import { DefaultNav } from '../../elements/Nav/index.js'
import { NavHamburger } from './NavHamburger/index.js'
import { Wrapper } from './Wrapper/index.js'

const baseClass = 'template-default'

export type DefaultTemplateProps = {
  children?: React.ReactNode
  className?: string
  collectionSlug?: string
  docID?: number | string
  documentSubViewType?: DocumentSubViewTypes
  globalSlug?: string
  req?: PayloadRequest
  viewActions?: CustomComponent[]
  viewType?: ViewTypes
  visibleEntities: VisibleEntities
} & ServerProps

export const DefaultTemplate: React.FC<DefaultTemplateProps> = ({
  children,
  className,
  collectionSlug,
  docID,
  documentSubViewType,
  globalSlug,
  i18n,
  locale,
  params,
  payload,
  permissions,
  req,
  searchParams,
  user,
  viewActions,
  viewType,
  visibleEntities,
}) => {
  const {
    admin: {
      avatar,
      components,
      components: { header: CustomHeader, Nav: CustomNav } = {
        header: undefined,
        Nav: undefined,
      },
    } = {},
  } = payload.config || {}

  const clientProps = React.useMemo(() => {
    return {
      documentSubViewType,
      viewType,
      visibleEntities,
    }
  }, [documentSubViewType, viewType, visibleEntities])

  const serverProps = React.useMemo<ServerProps>(
    () => ({
      collectionSlug,
      docID,
      globalSlug,
      i18n,
      locale,
      params,
      payload,
      permissions,
      req,
      searchParams,
      user,
    }),
    [
      i18n,
      locale,
      params,
      payload,
      permissions,
      searchParams,
      user,
      globalSlug,
      collectionSlug,
      docID,
      req,
    ],
  )

  const { Actions } = React.useMemo<{
    Actions: Record<string, React.ReactNode>
  }>(() => {
    return {
      Actions: viewActions
        ? viewActions.reduce((acc, action) => {
            if (action) {
              if (typeof action === 'object') {
                acc[action.path] = RenderServerComponent({
                  clientProps,
                  Component: action,
                  importMap: payload.importMap,
                  serverProps,
                })
              } else {
                acc[action] = RenderServerComponent({
                  clientProps,
                  Component: action,
                  importMap: payload.importMap,
                  serverProps,
                })
              }
            }

            return acc
          }, {})
        : undefined,
    }
  }, [payload, serverProps, viewActions, clientProps])

  const NavComponent = RenderServerComponent({
    clientProps,
    Component: CustomNav,
    Fallback: DefaultNav,
    importMap: payload.importMap,
    serverProps,
  })

  return (
    <EntityVisibilityProvider visibleEntities={visibleEntities}>
      <BulkUploadProvider drawerSlugPrefix={collectionSlug}>
        <ActionsProvider Actions={Actions}>
          {RenderServerComponent({
            clientProps,
            Component: CustomHeader,
            importMap: payload.importMap,
            serverProps,
          })}
          <div className="relative">
            {/* nav-toggler-wrapper - Original: sticky, z-modal, top:0, left:0, h:0, w:gutter-h, flex, justify-center
                On small screens: width:unset, justify:unset, .hamburger display:none */}
            <div
              className="sticky z-30 top-0 left-0 h-0 flex justify-center rtl:left-auto rtl:right-0 max-md:w-auto max-md:justify-start"
              style={{ width: 'var(--gutter-h)' }}
              id="nav-toggler"
            >
              {/* nav-toggler-container - Original: h:app-header-height, flex, items-center */}
              <div
                className="flex items-center"
                style={{ height: 'var(--app-header-height)' }}
                id="nav-toggler"
              >
                {/* nav-toggler - Original: flex, items-center. Hamburger hidden on small screens */}
                <NavToggler className="flex items-center max-md:hidden">
                  <NavHamburger />
                </NavToggler>
              </div>
            </div>
            <Wrapper baseClass={baseClass} className={className}>
              {NavComponent}
              {/* template-default__wrap - Original: min-w:0, w:100%, grow, relative, bg:theme-bg */}
              <div className="min-w-0 w-full grow relative bg-background">
                <AppHeader
                  CustomAvatar={
                    avatar !== 'gravatar' && avatar !== 'default'
                      ? RenderServerComponent({
                          Component: avatar?.Component,
                          importMap: payload.importMap,
                          serverProps,
                        })
                      : undefined
                  }
                  CustomIcon={
                    components?.graphics?.Icon
                      ? RenderServerComponent({
                          Component: components.graphics.Icon,
                          importMap: payload.importMap,
                          serverProps,
                        })
                      : undefined
                  }
                />
                {children}
              </div>
            </Wrapper>
          </div>
        </ActionsProvider>
      </BulkUploadProvider>
    </EntityVisibilityProvider>
  )
}
