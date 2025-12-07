'use client'

import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import { TrashIcon } from '../../icons/Trash/index.js'
import { useConfig } from '@payloadcms/ui'
import { useDocumentInfo } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'

export const TrashBanner: React.FC = () => {
  const { getEntityConfig } = useConfig()
  const { collectionSlug } = useDocumentInfo()
  const collectionConfig = getEntityConfig({ collectionSlug })

  const { labels } = collectionConfig
  const { i18n } = useTranslation()
  return (
    <div className="flex items-center gap-[calc(var(--base)*0.5)] mb-(--base) p-[calc(var(--base)*0.5)] px-[calc(var(--base)*0.75)] rounded-sm bg-yellow-100 text-yellow-600 dark:text-yellow-800">
      <TrashIcon />
      <p>
        {i18n.t('general:documentIsTrashed', {
          label: `${getTranslation(labels?.singular, i18n)}`,
        })}
      </p>
    </div>
  )
}
