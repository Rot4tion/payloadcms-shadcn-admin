'use client'
import React from 'react'

import { EyeIcon } from '../../../icons/Eye/index.js'
import { useLivePreviewContext, useTranslation } from '@payloadcms/ui'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export const LivePreviewToggler: React.FC = () => {
  const { isLivePreviewing, setIsLivePreviewing, url: livePreviewURL } = useLivePreviewContext()
  const { t } = useTranslation()

  if (!livePreviewURL) {
    return null
  }

  return (
    <Button
      aria-label={isLivePreviewing ? t('general:exitLivePreview') : t('general:livePreview')}
      variant={isLivePreviewing ? 'secondary' : 'outline'}
      size="icon"
      className={cn(
        'size-[calc(var(--base)*1.6)] p-0',
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
    </Button>
  )
}
