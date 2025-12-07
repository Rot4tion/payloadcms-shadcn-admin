'use client'

import { useModal } from '../../Modal/index'
import React from 'react'

import { useTranslation } from '@payloadcms/ui'
import { ConfirmationModal } from '../../ConfirmationModal/index'
import { useBulkUpload } from '../index'
export const discardBulkUploadModalSlug = 'bulk-upload--discard-without-saving'

export function DiscardWithoutSaving() {
  const { t } = useTranslation()
  const { closeModal } = useModal()
  const { drawerSlug } = useBulkUpload()

  const onCancel = React.useCallback(() => {
    closeModal(discardBulkUploadModalSlug)
  }, [closeModal])

  const onConfirm = React.useCallback(() => {
    closeModal(drawerSlug)
    closeModal(discardBulkUploadModalSlug)
  }, [closeModal, drawerSlug])

  return (
    <ConfirmationModal
      body={t('general:changesNotSaved')}
      cancelLabel={t('general:stayOnThisPage')}
      confirmLabel={t('general:leaveAnyway')}
      heading={t('general:leaveWithoutSaving')}
      modalSlug={discardBulkUploadModalSlug}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  )
}
