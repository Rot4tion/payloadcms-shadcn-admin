'use client'
import React, { useCallback } from 'react'

import { cn } from '@/lib/utils'
import { useTranslation, useModal } from '@payloadcms/ui'
import { useDrawerDepth } from '@payloadcms/ui/elements/Drawer'
import { drawerZBase } from '@payloadcms/ui/elements/Drawer'
import { Button } from '../Button'
import { Modal } from '../Modal'

export type OnCancel = () => void

export type ConfirmationModalProps = {
  body: React.ReactNode
  cancelLabel?: string
  className?: string
  confirmingLabel?: string
  confirmLabel?: string
  heading: React.ReactNode
  modalSlug: string
  onCancel?: OnCancel
  onConfirm: () => Promise<void> | void
}

export function ConfirmationModal(props: ConfirmationModalProps) {
  const {
    body,
    cancelLabel,
    className,
    confirmingLabel,
    confirmLabel,
    heading,
    modalSlug,
    onCancel: onCancelFromProps,
    onConfirm: onConfirmFromProps,
  } = props

  const editDepth = useDrawerDepth()

  const [confirming, setConfirming] = React.useState(false)

  const { closeModal, isModalOpen } = useModal()
  const { t } = useTranslation()

  const onConfirm = useCallback(async () => {
    if (!confirming) {
      setConfirming(true)

      if (typeof onConfirmFromProps === 'function') {
        await onConfirmFromProps()
      }

      setConfirming(false)
      closeModal(modalSlug)
    }
  }, [confirming, onConfirmFromProps, closeModal, modalSlug])

  const onCancel = useCallback(() => {
    if (!confirming) {
      closeModal(modalSlug)

      if (typeof onCancelFromProps === 'function') {
        onCancelFromProps()
      }
    }
  }, [confirming, onCancelFromProps, closeModal, modalSlug])

  if (!isModalOpen(modalSlug)) {
    return null
  }

  return (
    <Modal
      className={cn('fixed inset-0 flex items-center justify-center', className)}
      closeOnBlur={false}
      slug={modalSlug}
      style={{
        zIndex: drawerZBase + editDepth,
      }}
    >
      <div className="bg-background rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <div className="mb-6">
          {typeof heading === 'string' ? (
            <h1 className="text-lg font-semibold mb-2">{heading}</h1>
          ) : (
            heading
          )}
          {typeof body === 'string' ? <p className="text-muted-foreground">{body}</p> : body}
        </div>
        <div className="flex gap-3 justify-end">
          <Button
            buttonStyle="secondary"
            disabled={confirming}
            id="confirm-cancel"
            onClick={onCancel}
            size="large"
            type="button"
          >
            {cancelLabel || t('general:cancel')}
          </Button>
          <Button id="confirm-action" onClick={onConfirm} size="large">
            {confirming
              ? confirmingLabel || `${t('general:loading')}...`
              : confirmLabel || t('general:confirm')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
