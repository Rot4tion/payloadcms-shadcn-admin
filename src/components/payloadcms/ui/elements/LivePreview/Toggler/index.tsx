'use client'
import React from 'react'

import { EyeIcon } from '../../../icons/Eye/index'
import { useLivePreviewContext, useTranslation } from '@payloadcms/ui'
import { cn } from '@/lib/utils'

export const LivePreviewToggler: React.FC = () => {
  const { isLivePreviewing, setIsLivePreviewing, url: livePreviewURL } = useLivePreviewContext()
  const { t } = useTranslation()

  if (!livePreviewURL) {
    return null
  }

  return (
    <button
      aria-label={isLivePreviewing ? t('general:exitLivePreview') : t('general:livePreview')}
      className={cn(
        'size-[calc(var(--base)*1.6)] p-0 relative cursor-pointer flex items-center justify-center',
        'bg-transparent border border-(--theme-elevation-100) rounded-(--style-radius-s)',
        'transition-[border,color,background] duration-100 ease-[cubic-bezier(0,0.2,0.2,1)]',
        'hover:border-(--theme-elevation-300) hover:bg-(--theme-elevation-100)',
        isLivePreviewing &&
          'bg-(--theme-elevation-100) border-(--theme-elevation-200) hover:bg-(--theme-elevation-200)',
        '[&_.icon_.stroke]:transition-colors [&_.icon_.stroke]:duration-100',
      )}
      id="live-preview-toggler"
      onClick={() => {
        setIsLivePreviewing(!isLivePreviewing)
      }}
      title={isLivePreviewing ? t('general:exitLivePreview') : t('general:livePreview')}
      type="button"
    >
      <EyeIcon active={isLivePreviewing} />
    </button>
  )
}
