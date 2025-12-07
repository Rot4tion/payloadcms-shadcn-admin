'use client'
import React from 'react'

import { cn } from '@/lib/utils'
import { useDrawerDepth } from '@payloadcms/ui/elements/Drawer'
import { Link } from '../../elements/Link/index'
import { useConfig } from '@payloadcms/ui'
import { useDocumentInfo } from '@payloadcms/ui'
import { formatAdminURL } from '../../utilities/formatAdminURL'
import { sanitizeID } from '../../utilities/sanitizeID'

export const IDLabel: React.FC<{ className?: string; id: string; prefix?: string }> = ({
  id,
  className,
  prefix = 'ID:',
}) => {
  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = useConfig()

  const { collectionSlug, globalSlug } = useDocumentInfo()
  const drawerDepth = useDrawerDepth()

  const docPath = formatAdminURL({
    adminRoute,
    path: `/${collectionSlug ? `collections/${collectionSlug}` : `globals/${globalSlug}`}/${id}`,
  })

  return (
    <div
      className={cn(
        'text-[calc(var(--base)*0.8)] leading-[calc(var(--base)*1.2)] font-normal',
        'text-muted-foreground bg-muted',
        'px-[calc(var(--base)*0.4)] py-[calc(var(--base)*0.2)]',
        'rounded-md inline-flex w-fit',
        className,
      )}
      title={id}
    >
      {prefix}
      &nbsp;
      {drawerDepth > 1 ? <Link href={docPath}>{sanitizeID(id)}</Link> : sanitizeID(id)}
    </div>
  )
}
