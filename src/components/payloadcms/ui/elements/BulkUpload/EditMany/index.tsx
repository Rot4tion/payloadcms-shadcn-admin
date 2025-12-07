'use client'

import type { ClientCollectionConfig } from 'payload'

import React from 'react'

import { cn } from '@/lib/utils'
import { useAuth } from '@payloadcms/ui'
import { EditDepthProvider } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { Drawer, DrawerToggler } from '../../Drawer/index'
import { useFormsManager } from '../FormsManager/index'
import { EditManyBulkUploadsDrawerContent } from './DrawerContent'

export type EditManyBulkUploadsProps = {
  readonly collection: ClientCollectionConfig
}

export const EditManyBulkUploads: React.FC<EditManyBulkUploadsProps> = (props) => {
  const { collection: { slug } = {}, collection } = props

  const { permissions } = useAuth()

  const { t } = useTranslation()
  const { forms } = useFormsManager() // Access forms managed in bulk uploads

  const collectionPermissions = permissions?.collections?.[slug]
  const hasUpdatePermission = collectionPermissions?.update

  const drawerSlug = `edit-${slug}-bulk-uploads`

  if (!hasUpdatePermission) {
    return null
  }

  return (
    <div>
      <DrawerToggler
        aria-label={t('general:editAll')}
        className={cn(
          'text-base leading-[calc(var(--base)*1.2)] inline-flex',
          'bg-muted text-muted-foreground rounded-sm',
          'whitespace-nowrap overflow-hidden text-ellipsis',
          'border-0 px-[calc(var(--base)*0.4)] items-center cursor-pointer',
          'no-underline',
          'hover:bg-accent active:bg-accent focus:outline-none',
        )}
        slug={drawerSlug}
      >
        {t('general:editAll')}
      </DrawerToggler>
      <EditDepthProvider>
        <Drawer Header={null} slug={drawerSlug}>
          <EditManyBulkUploadsDrawerContent
            collection={collection}
            drawerSlug={drawerSlug}
            forms={forms}
          />
        </Drawer>
      </EditDepthProvider>
    </div>
  )
}
