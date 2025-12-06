'use client'
import type { PreviewButtonClientProps } from 'payload'

import React from 'react'

import { cn } from '@/lib/utils'
import { ExternalLinkIcon } from '../../icons/ExternalLink/index.js'
import { usePreviewURL } from '../../providers/LivePreview/context.js'
import { useTranslation } from '@payloadcms/ui'

export function PreviewButton(props: PreviewButtonClientProps) {
  const { previewURL } = usePreviewURL()
  const { t } = useTranslation()

  if (!previewURL) {
    return null
  }

  return (
    <a
      aria-label={t('version:preview')}
      className={cn(
        'relative cursor-pointer bg-transparent border border-border rounded-sm',
        'leading-(--btn-line-height) text-(--base-body-size)',
        'px-[calc(var(--base)*0.4)] py-[calc(var(--base)*0.2)]',
        'size-[calc(var(--base)*1.6)]',
        'transition-[border,color,background] duration-100 ease-[cubic-bezier(0,0.2,0.2,1)]',
        'hover:border-muted-foreground/50 hover:bg-muted',
        '[&_.icon]:absolute [&_.icon]:top-1/2 [&_.icon]:left-1/2 [&_.icon]:-translate-x-1/2 [&_.icon]:-translate-y-1/2',
        '[&_.icon_.stroke]:transition-[stroke] [&_.icon_.stroke]:duration-100',
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
