'use client'
import type { GenericDescriptionProps } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import { cn } from '@/lib/utils'
import { useTranslation } from '@payloadcms/ui'

export const FieldDescription: React.FC<GenericDescriptionProps> = (props) => {
  const { className, description, marginPlacement, path } = props

  const { i18n } = useTranslation()

  if (description) {
    return (
      <div
        className={cn(
          'flex text-muted-foreground mt-[calc(var(--base)/4)]',
          marginPlacement === 'bottom' && 'mt-0 mb-[calc(var(--base)/2)]',
          `field-description-${path?.replace(/\./g, '__')}`,
          className,
        )}
      >
        {getTranslation(description, i18n)}
      </div>
    )
  }

  return null
}
