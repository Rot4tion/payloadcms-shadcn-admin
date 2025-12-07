'use client'

import type { ClientCollectionConfig, ClientConfig, ViewTypes } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { useRouter } from 'next/navigation.js'
import { formatAdminURL } from 'payload/shared'
import React from 'react'

import { cn } from '@/lib/utils'
import { usePreferences } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { Button } from '@/components/ui/button'

type DefaultListViewTabsProps = {
  collectionConfig: ClientCollectionConfig
  config: ClientConfig
  onChange?: (viewType: ViewTypes) => void
  viewType?: ViewTypes
}

export const DefaultListViewTabs: React.FC<DefaultListViewTabsProps> = ({
  collectionConfig,
  config,
  onChange,
  viewType,
}) => {
  const { i18n, t } = useTranslation()
  const { setPreference } = usePreferences()
  const router = useRouter()
  const isTrashEnabled = collectionConfig.trash
  const isFoldersEnabled = collectionConfig.folders && config.folders

  if (!isTrashEnabled && !isFoldersEnabled) {
    return null
  }

  const handleViewChange = async (newViewType: ViewTypes) => {
    if (onChange) {
      onChange(newViewType)
    }

    if (newViewType === 'list' || newViewType === 'folders') {
      await setPreference(`collection-${collectionConfig.slug}`, {
        listViewType: newViewType,
      })
    }

    let path: `/${string}` = `/collections/${collectionConfig.slug}`
    switch (newViewType) {
      case 'folders':
        if (config.folders) {
          path = `/collections/${collectionConfig.slug}/${config.folders.slug}`
        }
        break
      case 'trash':
        path = `/collections/${collectionConfig.slug}/trash`
        break
    }

    const url = formatAdminURL({
      adminRoute: config.routes.admin,
      path,
      serverURL: config.serverURL,
    })

    router.push(url)
  }

  const allButtonLabel = `${t('general:all')} ${getTranslation(collectionConfig?.labels?.plural, i18n)}`
  const allButtonId = allButtonLabel.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex gap-[calc(var(--base)*0.5)]">
      <Button
        variant={viewType === 'list' ? 'default' : 'outline'}
        size="sm"
        disabled={viewType === 'list'}
        id={allButtonId}
        onClick={() => handleViewChange('list')}
      >
        {t('general:all')} {getTranslation(collectionConfig?.labels?.plural, i18n)}
      </Button>

      {isFoldersEnabled && (
        <Button
          variant={viewType === 'folders' ? 'default' : 'outline'}
          size="sm"
          disabled={viewType === 'folders'}
          onClick={() => handleViewChange('folders')}
        >
          {t('folder:byFolder')}
        </Button>
      )}

      {isTrashEnabled && (
        <Button
          variant={viewType === 'trash' ? 'default' : 'outline'}
          size="sm"
          disabled={viewType === 'trash'}
          id="trash-view-pill"
          onClick={() => handleViewChange('trash')}
        >
          {t('general:trash')}
        </Button>
      )}
    </div>
  )
}
