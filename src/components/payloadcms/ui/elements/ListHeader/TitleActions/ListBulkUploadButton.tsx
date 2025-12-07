'use client'
import type { CollectionSlug } from 'payload'

import { useModal } from '../../Modal/index'
import { useRouter } from 'next/navigation'
import React from 'react'

import { useBulkUpload } from '../../../elements/BulkUpload/index'
import { useTranslation } from '@payloadcms/ui'
import { Button } from '../../Button/index'

export function ListBulkUploadButton({
  collectionSlug,
  hasCreatePermission,
  isBulkUploadEnabled,
  onBulkUploadSuccess,
}: {
  collectionSlug: CollectionSlug
  hasCreatePermission: boolean
  isBulkUploadEnabled: boolean
  onBulkUploadSuccess?: () => void
}) {
  const { drawerSlug: bulkUploadDrawerSlug, setCollectionSlug, setOnSuccess } = useBulkUpload()
  const { t } = useTranslation()
  const { openModal } = useModal()
  const router = useRouter()

  const openBulkUpload = React.useCallback(() => {
    setCollectionSlug(collectionSlug)
    openModal(bulkUploadDrawerSlug)
    setOnSuccess(() => {
      if (typeof onBulkUploadSuccess === 'function') {
        onBulkUploadSuccess()
      } else {
        router.refresh()
      }
    })
  }, [
    router,
    collectionSlug,
    bulkUploadDrawerSlug,
    openModal,
    setCollectionSlug,
    setOnSuccess,
    onBulkUploadSuccess,
  ])

  if (!hasCreatePermission || !isBulkUploadEnabled) {
    return null
  }

  return (
    <Button
      aria-label={t('upload:bulkUpload')}
      buttonStyle="pill"
      key="bulk-upload-button"
      onClick={openBulkUpload}
      size="small"
    >
      {t('upload:bulkUpload')}
    </Button>
  )
}
