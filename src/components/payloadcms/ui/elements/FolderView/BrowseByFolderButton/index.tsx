// @ts-nocheck payloadcms original type safe issue will fix later
import { formatAdminURL } from 'payload/shared'
import React from 'react'

import { useConfig } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { Link } from '../../Link'
import { ColoredFolderIcon } from '../ColoredFolderIcon'
import { cn } from '@/lib/utils'

export function BrowseByFolderButton({ active }) {
  const { t } = useTranslation()
  const { config } = useConfig()
  const {
    admin: {
      routes: { browseByFolder: foldersRoute },
    },
    routes: { admin: adminRoute },
  } = config

  return (
    <Link
      className={cn(
        'border border-border/50 no-underline p-[calc(var(--base)/2)] flex items-center w-full',
        'gap-[calc(var(--base)*0.33)] mt-[calc(var(--base)*0.25)] mb-(--base) rounded-md text-foreground',
        '[&_.icon]:text-muted-foreground/60',
        active && 'bg-muted/50 font-semibold [&_.icon]:text-muted-foreground',
      )}
      href={formatAdminURL({
        adminRoute,
        path: foldersRoute,
      })}
      id="browse-by-folder"
      prefetch={false}
    >
      <ColoredFolderIcon />
      {t('folder:browseByFolder')}
    </Link>
  )
}
