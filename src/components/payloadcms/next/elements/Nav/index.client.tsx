'use client'

import type { groupNavItems } from '@/components/payloadcms/ui/exports/shared'
import type { NavPreferences } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { BrowseByFolderButton, NavGroup, useConfig, useTranslation } from '@/components/payloadcms/ui/exports/client'
import { EntityType } from '@/components/payloadcms/ui/exports/shared'
import { usePathname } from 'next/navigation'
import { formatAdminURL } from 'payload/shared'
import React, { Fragment } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * DefaultNavClient - Navigation links (Tailwind version)
 *
 * Original SCSS nav__link:
 * - display: flex, align-items: center, position: relative
 * - padding-block: base(0.125) = 2.5px
 * - padding-inline-start: 0, padding-inline-end: base(1.5) = 30px
 * - text-decoration: none
 * - active: font-weight: 600
 *
 * Original SCSS nav__link-indicator:
 * - position: absolute, inset-inline-start: base(-1) = -20px
 * - width: 2px, height: 16px
 * - border-radius on end corners, background: var(--theme-text)
 *
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

              // nav__link styles
              const linkClasses = cn(
                'flex items-center relative no-underline',
                'hover:underline focus-visible:underline',
                'focus:not-focus-visible:shadow-none',
                isActive && 'font-semibold',
              )

              // nav__link padding style
              const linkStyle = {
                // padding-block: base(0.125) = 2.5px
                paddingBlock: 'calc(var(--base) * 0.125)',
                paddingInlineStart: 0,
                // padding-inline-end: base(1.5) = 30px
                paddingInlineEnd: 'calc(var(--base) * 1.5)',
              }

              // nav__link-indicator styles
              const indicatorClasses = 'absolute w-0.5 h-4 rounded-e-sm bg-foreground'
              const indicatorStyle = {
                // inset-inline-start: base(-1) = -20px
                insetInlineStart: 'calc(var(--base) * -1)',
              }

              const Label = (
                <>
                  {isActive && <div className={indicatorClasses} style={indicatorStyle} />}
                  <span className="truncate">{getTranslation(label, i18n)}</span>
                </>
              )

              // If the URL matches the link exactly
              if (pathname === href) {
                return (
                  <div className={linkClasses} style={linkStyle} id={id} key={i}>
                    {Label}
                  </div>
                )
              }

              return (
                <Link
                  className={linkClasses}
                  style={linkStyle}
                  href={href}
                  id={id}
                  key={i}
                  prefetch={false}
                >
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
