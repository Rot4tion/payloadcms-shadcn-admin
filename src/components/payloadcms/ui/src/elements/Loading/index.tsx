'use client'
import { getTranslation } from '@payloadcms/translations'
import React from 'react'
import { cn } from '@/lib/utils'

import type { LoadingOverlayTypes } from '../../elements/LoadingOverlay/types.js'

import { useLoadingOverlay } from '../../elements/LoadingOverlay/index.js'
import { useFormProcessing } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'

type LoadingOverlayProps = {
  animationDuration?: string
  loadingText?: string
  overlayType?: string
  show?: boolean
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  animationDuration,
  loadingText,
  overlayType,
  show = true,
}) => {
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm',
        show ? 'animate-in fade-in duration-300' : 'animate-out fade-out duration-300',
        overlayType === 'withoutRouteTransition' && 'z-[60]',
      )}
      style={{
        animationDuration: animationDuration || '500ms',
      }}
    >
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-8 w-1 animate-pulse rounded-full bg-primary"
            style={{
              animationDelay: `${i * 100}ms`,
              animationDuration: '600ms',
            }}
          />
        ))}
      </div>

      <span className="mt-4 text-sm text-muted-foreground">
        {loadingText || t('general:loading')}
      </span>
    </div>
  )
}

export type UseLoadingOverlayToggleProps = {
  loadingText?: string
  name: string
  show: boolean
  type?: LoadingOverlayTypes
}
export const LoadingOverlayToggle: React.FC<UseLoadingOverlayToggleProps> = ({
  name: key,
  type = 'fullscreen',
  loadingText,
  show,
}) => {
  const { toggleLoadingOverlay } = useLoadingOverlay()

  React.useEffect(() => {
    toggleLoadingOverlay({
      type,
      isLoading: show,
      key,
      loadingText: loadingText || undefined,
    })

    return () => {
      toggleLoadingOverlay({
        type,
        isLoading: false,
        key,
      })
    }
  }, [show, toggleLoadingOverlay, key, type, loadingText])

  return null
}

export type FormLoadingOverlayToggleProps = {
  action: 'create' | 'loading' | 'update'
  formIsLoading?: boolean
  loadingSuffix?: string
  name: string
  type?: LoadingOverlayTypes
}

export const FormLoadingOverlayToggle: React.FC<FormLoadingOverlayToggleProps> = ({
  name,
  type = 'fullscreen',
  action,
  formIsLoading = false,
  loadingSuffix,
}) => {
  const isProcessing = useFormProcessing()
  const { i18n, t } = useTranslation()

  const labels = {
    create: t('general:creating'),
    loading: t('general:loading'),
    update: t('general:updating'),
  }

  return (
    <LoadingOverlayToggle
      loadingText={`${labels[action]} ${
        loadingSuffix ? getTranslation(loadingSuffix, i18n) : ''
      }`.trim()}
      name={name}
      show={formIsLoading || isProcessing}
      type={type}
    />
  )
}
