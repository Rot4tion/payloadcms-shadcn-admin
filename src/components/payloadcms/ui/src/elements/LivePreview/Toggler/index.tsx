import React from 'react'

import { EyeIcon } from '../../../icons/Eye/index.js'
import { useLivePreviewContext } from '../../../providers/LivePreview/context.js'
import { useTranslation } from '@payloadcms/ui'
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
        'bg-transparent border border-(--theme-elevation-100) rounded-sm text-base leading-(--btn-line-height)',
        'py-[calc(var(--base)*0.2)] px-[calc(var(--base)*0.4)] cursor-pointer',
        'transition-[border,color,background] duration-100 ease-[cubic-bezier(0,0.2,0.2,1)]',
        'size-[calc(var(--base)*1.6)] relative',
        'hover:border-(--theme-elevation-300) hover:bg-(--theme-elevation-100)',
        '[&_.icon]:absolute [&_.icon]:top-1/2 [&_.icon]:left-1/2 [&_.icon]:-translate-x-1/2 [&_.icon]:-translate-y-1/2',
        '[&_.icon_.stroke]:transition-[stroke] [&_.icon_.stroke]:duration-100 [&_.icon_.stroke]:ease-[cubic-bezier(0,0.2,0.2,1)]',
        isLivePreviewing &&
          'bg-(--theme-elevation-100) border-(--theme-elevation-200) hover:bg-(--theme-elevation-200)',
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
