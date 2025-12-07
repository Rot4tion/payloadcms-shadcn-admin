'use client'
import type { PreviewButtonClientProps } from 'payload'

import React from 'react'

import { cn } from '@/lib/utils'
import { ExternalLinkIcon } from '../../icons/ExternalLink/index.js'
import { useLivePreviewContext, useTranslation } from '@payloadcms/ui'
import { buttonVariants } from '@/components/ui/button'

export function PreviewButton(props: PreviewButtonClientProps) {
  const { previewURL } = useLivePreviewContext()
  const { t } = useTranslation()

  if (!previewURL) {
    return null
  }

  return (
    <a
      aria-label={t('version:preview')}
      className={cn(
        buttonVariants({ variant: 'outline', size: 'icon' }),
        'size-[calc(var(--base)*1.6)] p-0',
        '[&_.icon_.stroke]:transition-colors [&_.icon_.stroke]:duration-100',
      )}
      href={previewURL}
      id="preview-button"
      target="_blank"
      title={t('version:preview')}
    >
      <ExternalLinkIcon />
    </a>
  )
}
