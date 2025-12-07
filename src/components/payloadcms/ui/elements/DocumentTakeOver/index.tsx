'use client'
import React, { useEffect } from 'react'

import { useRouteCache } from '../../providers/RouteCache/index'
import { useRouteTransition } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { Button } from '@/components/ui/button'
import { Modal, useModal } from '../Modal/index'

const modalSlug = 'document-take-over'

export const DocumentTakeOver: React.FC<{
  handleBackToDashboard: () => void
  isActive: boolean
  onReadOnly: () => void
}> = ({ handleBackToDashboard, isActive, onReadOnly }) => {
  const { closeModal, openModal } = useModal()
  const { t } = useTranslation()
  const { startRouteTransition } = useRouteTransition()
  const { clearRouteCache } = useRouteCache()

  useEffect(() => {
    if (isActive) {
      openModal(modalSlug)
    } else {
      closeModal(modalSlug)
    }
  }, [isActive, openModal, closeModal])

  return (
    <Modal
      className="backdrop-blur-sm bg-background/80 flex items-center justify-center h-full"
      // // Fixes https://github.com/payloadcms/payload/issues/13778
      closeOnBlur={false}
      slug={modalSlug}
    >
      <div className="z-1 relative flex flex-col gap-(--base) p-[calc(var(--base)*2)]">
        <div className="flex flex-col gap-(--base) *:m-0">
          <h1>{t('general:editingTakenOver')}</h1>
          <p>{t('general:anotherUserTakenOver')}</p>
        </div>
        <div className="flex gap-(--base) [&_.btn]:m-0">
          <Button
            size="lg"
            id={`${modalSlug}-back-to-dashboard`}
            onClick={() => {
              startRouteTransition(() => handleBackToDashboard())
            }}
          >
            {t('general:backToDashboard')}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            id={`${modalSlug}-view-read-only`}
            onClick={() => {
              onReadOnly()
              closeModal(modalSlug)
              clearRouteCache()
            }}
          >
            {t('general:viewReadOnly')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
