// @ts-nocheck payloadcms original type safe issue will fix later
'use client'
import React, { createContext } from 'react'

import type { LoadingOverlayContext, ToggleLoadingOverlay } from './types'

import { LoadingOverlay } from '../../elements/Loading/index'
import { useDelayedRender } from '../../hooks/useDelayedRender'
import { useTranslation } from '@payloadcms/ui'
import { defaultLoadingOverlayState, reducer } from './reducer'

const animatedDuration = 250

const Context = createContext<LoadingOverlayContext>({
  isOnScreen: false,
  toggleLoadingOverlay: () => {},
})

export const LoadingOverlayProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation()
  const fallbackText = t('general:loading')
  const [overlays, dispatchOverlay] = React.useReducer(reducer, defaultLoadingOverlayState)

  const { isMounted, isUnmounting, triggerDelayedRender } = useDelayedRender({
    delayBeforeShow: 1000,
    inTimeout: animatedDuration,
    minShowTime: 500,
    outTimeout: animatedDuration,
    show: overlays.isLoading,
  })

  const toggleLoadingOverlay = React.useCallback<ToggleLoadingOverlay>(
    ({ type, isLoading, key, loadingText = fallbackText }) => {
      if (isLoading) {
        triggerDelayedRender()
        dispatchOverlay({
          type: 'add',
          payload: {
            type,
            key,
            loadingText,
          },
        })
      } else {
        dispatchOverlay({
          type: 'remove',
          payload: {
            type,
            key,
          },
        })
      }
    },
    [triggerDelayedRender, fallbackText],
  )

  return (
    <Context
      value={{
        isOnScreen: isMounted,
        toggleLoadingOverlay,
      }}
    >
      {isMounted && (
        <LoadingOverlay
          animationDuration={`${animatedDuration}ms`}
          loadingText={overlays.loadingText || fallbackText}
          overlayType={overlays.overlayType}
          show={!isUnmounting}
        />
      )}
      {children}
    </Context>
  )
}

export const useLoadingOverlay = (): LoadingOverlayContext => {
  const contextHook = React.use(Context)
  if (contextHook === undefined) {
    throw new Error('useLoadingOverlay must be used within a LoadingOverlayProvider')
  }

  return contextHook
}
