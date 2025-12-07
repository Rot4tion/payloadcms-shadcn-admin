'use client'
import type { PreviewButtonClientProps } from 'payload'

import React from 'react'

import { cn } from '@/lib/utils'
import { ExternalLinkIcon } from '../../icons/ExternalLink/index'
import { useLivePreviewContext, useTranslation } from '@payloadcms/ui'

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
        'size-[calc(var(--base)*1.6)] p-0 relative cursor-pointer flex items-center justify-center',
        'bg-transparent border border-(--theme-elevation-100) rounded-(--style-radius-s)',
        'transition-[border,color,background] duration-100 ease-[cubic-bezier(0,0.2,0.2,1)]',
        'hover:border-(--theme-elevation-300) hover:bg-(--theme-elevation-100)',
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
