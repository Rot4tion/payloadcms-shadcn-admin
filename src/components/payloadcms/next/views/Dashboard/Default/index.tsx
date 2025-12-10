import type { groupNavItems } from '@/components/payloadcms/ui/exports/shared'
import type { AdminViewServerPropsOnly, ClientUser, Locale, ServerProps } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { RenderServerComponent } from '@/components/payloadcms/ui/elements/RenderServerComponent'
import { EntityType } from '@/components/payloadcms/ui/exports/shared'
import { formatAdminURL } from 'payload/shared'
import React, { Fragment } from 'react'
import Link from 'next/link'
import { Plus, Lock } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export type DashboardViewClientProps = {
  locale: Locale
}

export type DashboardViewServerPropsOnly = {
  globalData: Array<{
    data: { _isLocked: boolean; _lastEditedAt: string; _userEditing: ClientUser | number | string }
    lockDuration?: number
    slug: string
  }>
  /**
   * @deprecated
   * This prop is deprecated and will be removed in the next major version.
   * Components now import their own `Link` directly from `next/link`.
   */
  Link?: React.ComponentType
  navGroups?: ReturnType<typeof groupNavItems>
} & AdminViewServerPropsOnly

export type DashboardViewServerProps = DashboardViewClientProps & DashboardViewServerPropsOnly

export function DefaultDashboard(props: DashboardViewServerProps) {
  const {
    globalData,
    i18n,
    i18n: { t },
    locale,
    navGroups,
    params,
    payload: {
      config: {
        admin: {
          components: { afterDashboard, beforeDashboard },
        },
        routes: { admin: adminRoute },
      },
    },
    payload,
    permissions,
    searchParams,
    user,
  } = props

  return (
    <div className="w-full">
      <div className="px-[var(--gutter-h)] pb-[var(--spacing-view-bottom)] flex flex-col gap-[var(--base)]">
        {beforeDashboard &&
          RenderServerComponent({
            Component: beforeDashboard,
            importMap: payload.importMap,
            serverProps: {
              i18n,
              locale,
              params,
              payload,
              permissions,
              searchParams,
              user,
            } satisfies ServerProps,
          })}

        <Fragment>
          {!navGroups || navGroups?.length === 0 ? (
            <p className="text-muted-foreground">no nav groups....</p>
          ) : (
            navGroups.map(({ entities, label }, groupIndex) => {
              return (
                <div className="flex flex-col gap-[var(--base)]" key={groupIndex}>
                  <h2 className="m-0">{label}</h2>
                  <ul
                    className={cn(
                      'p-0 m-0 list-none grid gap-[var(--base)]',
                      'grid-cols-5 max-xl:grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1',
                    )}
                  >
                    {entities.map(({ slug, type, label }, entityIndex) => {
                      let title: string = ''
                      let buttonAriaLabel: string = ''
                      let createHREF: string = ''
                      let href: string = ''
                      let hasCreatePermission: boolean = false
                      let isLocked: boolean | null = null
                      let userEditing: ClientUser | number | string | null = null

                      if (type === EntityType.collection) {
                        title = getTranslation(label, i18n)

                        buttonAriaLabel = t('general:showAllLabel', { label: title })

                        href = formatAdminURL({ adminRoute, path: `/collections/${slug}` })

                        createHREF = formatAdminURL({
                          adminRoute,
                          path: `/collections/${slug}/create`,
                        })

                        hasCreatePermission = permissions?.collections?.[slug]?.create ?? false
                      }

                      if (type === EntityType.global) {
                        title = getTranslation(label, i18n)

                        buttonAriaLabel = t('general:editLabel', {
                          label: getTranslation(label, i18n),
                        })

                        href = formatAdminURL({
                          adminRoute,
                          path: `/globals/${slug}`,
                        })

                        // Find the lock status for the global
                        const globalLockData = globalData.find((global) => global.slug === slug)
                        if (globalLockData) {
                          isLocked = globalLockData.data._isLocked
                          userEditing = globalLockData.data._userEditing

                          // Check if the lock is expired
                          const lockDuration = globalLockData?.lockDuration ?? 300
                          const lastEditedAt = new Date(
                            globalLockData.data?._lastEditedAt,
                          ).getTime()

                          const lockDurationInMilliseconds = lockDuration * 1000
                          const lockExpirationTime = lastEditedAt + lockDurationInMilliseconds

                          if (new Date().getTime() > lockExpirationTime) {
                            isLocked = false
                            userEditing = null
                          }
                        }
                      }

                      const userEditingId =
                        typeof userEditing === 'object' && userEditing !== null
                          ? (userEditing as ClientUser).id
                          : null

                      return (
                        <li key={entityIndex} className="h-full">
                          <Card className="h-full py-0 hover:shadow-md transition-shadow relative group">
                            <Link
                              href={href}
                              aria-label={buttonAriaLabel}
                              className="absolute inset-0 z-0"
                            />
                            <CardHeader className="py-4">
                              <CardTitle className="text-base">
                                <h3 className="m-0 font-medium text-foreground">
                                  {getTranslation(label, i18n)}
                                </h3>
                              </CardTitle>
                              {isLocked && user?.id !== userEditingId ? (
                                <CardAction>
                                  <Badge variant="secondary" className="gap-1">
                                    <Lock className="size-3" />
                                    <span className="text-xs">Locked</span>
                                  </Badge>
                                </CardAction>
                              ) : hasCreatePermission && type === EntityType.collection ? (
                                <CardAction className="relative z-10">
                                  <Button
                                    variant="outline"
                                    size="icon-sm"
                                    aria-label={t('general:createNewLabel', { label })}
                                    asChild
                                  >
                                    <Link href={createHREF}>
                                      <Plus className="size-4" />
                                    </Link>
                                  </Button>
                                </CardAction>
                              ) : null}
                            </CardHeader>
                          </Card>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })
          )}
        </Fragment>
        {afterDashboard &&
          RenderServerComponent({
            Component: afterDashboard,
            importMap: payload.importMap,
            serverProps: {
              i18n,
              locale,
              params,
              payload,
              permissions,
              searchParams,
              user,
            } satisfies ServerProps,
          })}
      </div>
    </div>
  )
}
