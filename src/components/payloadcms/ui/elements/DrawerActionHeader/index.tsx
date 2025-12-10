'use client'

import React from 'react'

import { cn } from '@/lib/utils'
import { FormSubmit } from '../../forms/Submit'
import { useTranslation } from '@payloadcms/ui'
import { Button } from '@/components/ui/button'

type DrawerActionHeaderArgs = {
  readonly cancelLabel?: string
  className?: string
  readonly onCancel?: () => void
  readonly onSave?: () => void
  readonly saveLabel?: string
  readonly title: React.ReactNode | string
}
export const DrawerActionHeader = ({
  cancelLabel,
  className,
  onCancel,
  onSave,
  saveLabel,
  title,
}: DrawerActionHeaderArgs) => {
  const { t } = useTranslation()

  return (
    <div className={cn('pt-[calc(var(--base)*2)] pb-(--base) border-b border-border', className)}>
      <div className="mx-(--gutter-h) flex justify-between items-center">
        <h1 className="m-0">{title}</h1>

        <div className="flex ml-auto pl-(--base) gap-(--base)">
          <Button aria-label={t('general:cancel')} variant="secondary" onClick={onCancel}>
            {cancelLabel || t('general:cancel')}
          </Button>

          <FormSubmit aria-label={t('general:applyChanges')} onClick={onSave}>
            {saveLabel || t('general:applyChanges')}
          </FormSubmit>
        </div>
      </div>
    </div>
  )
}
