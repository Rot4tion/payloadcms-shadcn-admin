'use client'

import type { groupNavItems } from '@payloadcms-local/ui/shared'
import type { NavPreferences } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { BrowseByFolderButton, NavGroup, useConfig, useTranslation } from '@payloadcms-local/ui'
import { EntityType } from '@payloadcms-local/ui/shared'
import { usePathname } from 'next/navigation.js'
import { formatAdminURL } from 'payload/shared'
import React, { Fragment } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * @internal
 */
export const DefaultNavClient: React.FC<{
  groups: ReturnType<typeof groupNavItems>
  navPreferences: NavPreferences
}> = ({ groups, navPreferences }) => {
  const pathname = usePathname()

  const {
    config: {
      admin: {
        routes: { browseByFolder: foldersRoute },
      },
      folders,
      routes: { admin: adminRoute },
    },
  } = useConfig()

  const { i18n } = useTranslation()

  const folderURL = formatAdminURL({
    adminRoute,
    path: foldersRoute,
  })

  const viewingRootFolderView = pathname.startsWith(folderURL)

  return (
    <Fragment>
      {folders && folders.browseByFolder && <BrowseByFolderButton active={viewingRootFolderView} />}
      {groups.map(({ entities, label }, key) => {
        return (
          <NavGroup isOpen={navPreferences?.groups?.[label]?.open} key={key} label={label}>
            {entities.map(({ slug, type, label }, i) => {
              let href: string = ''
              let id: string = ''

              if (type === EntityType.collection) {
                href = formatAdminURL({ adminRoute, path: `/collections/${slug}` })
                id = `nav-${slug}`
              }

              if (type === EntityType.global) {
                href = formatAdminURL({ adminRoute, path: `/globals/${slug}` })
                id = `nav-global-${slug}`
              }

              const isActive =
                pathname.startsWith(href) && ['/', undefined].includes(pathname[href.length])

              const linkClasses = cn(
                'flex items-center relative py-1 pr-6 no-underline text-sidebar-foreground hover:text-sidebar-accent-foreground hover:underline',
                isActive && 'font-semibold',
              )

              const Label = (
                <>
                  {isActive && (
                    <div className="absolute -left-4 w-0.5 h-4 rounded-r bg-foreground" />
                  )}
                  <span className="truncate">{getTranslation(label, i18n)}</span>
                </>
              )

              // If the URL matches the link exactly
              if (pathname === href) {
                return (
                  <div className={linkClasses} id={id} key={i}>
                    {Label}
                  </div>
                )
              }

              return (
                <Link className={linkClasses} href={href} id={id} key={i} prefetch={false}>
                  {Label}
                </Link>
              )
            })}
          </NavGroup>
        )
      })}
    </Fragment>
  )
}
