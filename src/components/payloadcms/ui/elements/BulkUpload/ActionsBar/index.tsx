'use client'

import type { ClientCollectionConfig } from 'payload'

import React from 'react'

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useConfig } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { Button } from '@/components/ui/button'
import { EditManyBulkUploads } from '../EditMany/index.js'
import { useFormsManager } from '../FormsManager/index.js'

type Props = {
  readonly collectionConfig: ClientCollectionConfig
}

export function ActionsBar({ collectionConfig }: Props) {
  const { activeIndex, forms, setActiveIndex } = useFormsManager()
  const { t } = useTranslation()

  return (
    <div className="flex px-(--gutter-h) items-center border-b border-border sticky z-1 top-0 bg-background h-(--doc-controls-height)">
      <div className="flex gap-(--base) items-center w-full max-lg:justify-between">
        <p className="tabular-nums m-0">
          <strong>{activeIndex + 1}</strong>
          {` ${t('general:of')} `}
          <strong>{forms.length}</strong>
        </p>

        <div className="flex gap-[calc(var(--base)/2)]">
          <Button
            aria-label={t('general:previous')}
            variant="secondary"
            size="icon-sm"
            onClick={() => {
              const nextIndex = activeIndex - 1
              if (nextIndex < 0) {
                setActiveIndex(forms.length - 1)
              } else {
                setActiveIndex(nextIndex)
              }
            }}
            type="button"
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <Button
            aria-label={t('general:next')}
            variant="secondary"
            size="icon-sm"
            onClick={() => {
              const nextIndex = activeIndex + 1
              if (nextIndex === forms.length) {
                setActiveIndex(0)
              } else {
                setActiveIndex(nextIndex)
              }
            }}
            type="button"
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
        <EditManyBulkUploads collection={collectionConfig} />
      </div>

      <Actions className="max-lg:hidden" />
    </div>
  )
}

type ActionsProps = {
  readonly className?: string
}
export function Actions({ className }: ActionsProps) {
  const { getEntityConfig } = useConfig()
  const { t } = useTranslation()
  const { collectionSlug, hasPublishPermission, hasSavePermission, saveAllDocs } = useFormsManager()

  const collectionConfig = getEntityConfig({ collectionSlug })

  return (
    <div className={cn('flex gap-(--base) ml-auto whitespace-nowrap', className)}>
      {collectionConfig?.versions?.drafts && hasSavePermission ? (
        <Button
          variant="secondary"
          onClick={() => void saveAllDocs({ overrides: { _status: 'draft' } })}
        >
          {t('version:saveDraft')}
        </Button>
      ) : null}
      {collectionConfig?.versions?.drafts && hasPublishPermission ? (
        <Button onClick={() => void saveAllDocs({ overrides: { _status: 'published' } })}>
          {t('version:publish')}
        </Button>
      ) : null}

      {!collectionConfig?.versions?.drafts && hasSavePermission ? (
        <Button onClick={() => void saveAllDocs()}>{t('general:save')}</Button>
      ) : null}
    </div>
  )
}
