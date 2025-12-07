'use client'
import type { SanitizedConfig } from 'payload'

import { Button } from '@/components/payloadcms/ui/exports/client'
import { useParams, usePathname, useSearchParams } from 'next/navigation'
import { formatAdminURL } from 'payload/shared'
import React from 'react'
import { cn } from '@/lib/utils'

/**
 * DocumentTabLink - Tab link component (Tailwind version)
 *
 * Original SCSS doc-tab:
 * - flex, justify-center, items-center, whitespace-nowrap
 * - hover: .pill-version-count bg-elevation-150
 * - --active: .pill-version-count bg-elevation-250
 */
export const DocumentTabLink: React.FC<{
  adminRoute: SanitizedConfig['routes']['admin']
  ariaLabel?: string
  children?: React.ReactNode
  href: string
  isActive?: boolean
  newTab?: boolean
}> = ({
  adminRoute,
  ariaLabel,
  children,
  href: hrefFromProps,
  isActive: isActiveFromProps,
  newTab,
}) => {
  const pathname = usePathname()
  const params = useParams()

  const searchParams = useSearchParams()

  const locale = searchParams.get('locale')

  const [entityType, entitySlug, segmentThree, segmentFour, ...rest] = params.segments || []
  const isCollection = entityType === 'collections'

  let docPath = formatAdminURL({
    adminRoute,
    path: `/${isCollection ? 'collections' : 'globals'}/${entitySlug}`,
  })

  if (isCollection) {
    if (segmentThree === 'trash' && segmentFour) {
      docPath += `/trash/${segmentFour}`
    } else if (segmentThree) {
      docPath += `/${segmentThree}`
    }
  }

  const href = `${docPath}${hrefFromProps}`
  // separated the two so it doesn't break checks against pathname
  const hrefWithLocale = `${href}${locale ? `?locale=${locale}` : ''}`

  const isActive =
    (href === docPath && pathname === docPath) ||
    (href !== docPath && pathname.startsWith(href)) ||
    isActiveFromProps

  return (
    <Button
      aria-label={ariaLabel}
      buttonStyle="tab"
      className={cn(
        // doc-tab base styles
        'flex justify-center items-center whitespace-nowrap',
        // Hover state for pill
        '[&:hover_.pill-version-count]:bg-muted',
        // Active state for pill
        isActive && '[&_.pill-version-count]:bg-muted/80',
      )}
      disabled={isActive}
      el={!isActive || href !== pathname ? 'link' : 'div'}
      margin={false}
      newTab={newTab}
      size="medium"
      to={!isActive || href !== pathname ? hrefWithLocale : undefined}
    >
      {children}
    </Button>
  )
}
