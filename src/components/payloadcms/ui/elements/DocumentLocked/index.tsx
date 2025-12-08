// @ts-nocheck payloadcms original type safe issue will fix later
'use client'
import type { ClientUser } from 'payload'

import React, { useEffect } from 'react'

import { useRouteCache } from '../../providers/RouteCache/index'
import { useRouteTransition } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { isClientUserObject } from '../../utilities/isClientUserObject'
import { Button } from '@/components/ui/button'
import { Modal, useModal } from '../Modal/index'

const modalSlug = 'document-locked'

const formatDate = (date) => {
  if (!date) {
    return ''
  }
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    hour: 'numeric',
    hour12: true,
    minute: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export const DocumentLocked: React.FC<{
  handleGoBack: () => void
  isActive: boolean
  onReadOnly: () => void
  onTakeOver: () => void
  updatedAt?: null | number
  user?: ClientUser | number | string
}> = ({ handleGoBack, isActive, onReadOnly, onTakeOver, updatedAt, user }) => {
  const { closeModal, openModal } = useModal()
  const { t } = useTranslation()
  const { clearRouteCache } = useRouteCache()
  const { startRouteTransition } = useRouteTransition()

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
      // Fixes https://github.com/payloadcms/payload/issues/13778
      closeOnBlur={false}
      onClose={() => {
        startRouteTransition(() => handleGoBack())
      }}
      slug={modalSlug}
    >
      <div className="z-1 relative flex flex-col gap-(--base) p-[calc(var(--base)*2)]">
        <div className="flex flex-col gap-(--base) max-w-[calc(var(--base)*36)] [&>*]:m-0">
          <h1>{t('general:documentLocked')}</h1>
          <p>
            <strong>
              {isClientUserObject(user) ? (user.email ?? user.id) : `${t('general:user')}: ${user}`}
            </strong>{' '}
            {t('general:currentlyEditing')}
          </p>
          <p>
            {t('general:editedSince')} <strong>{formatDate(updatedAt)}</strong>
          </p>
        </div>
        <div className="flex gap-(--base) [&_.btn]:m-0">
          <Button
            variant="secondary"
            size="lg"
            id={`${modalSlug}-go-back`}
            onClick={() => {
              closeModal(modalSlug)
              startRouteTransition(() => handleGoBack())
            }}
          >
            {t('general:goBack')}
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
          <Button
            size="lg"
            id={`${modalSlug}-take-over`}
            onClick={() => {
              onTakeOver()
              closeModal(modalSlug)
            }}
          >
            {t('general:takeOver')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
