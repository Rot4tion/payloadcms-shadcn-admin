'use client'

import type { EditViewProps } from 'payload'

import { reduceFieldsToValues } from 'payload/shared'
import React, { useEffect } from 'react'

import { useAllFormFields, useDocumentInfo, useLivePreviewContext, useLocale } from '@payloadcms/ui'
import { useDocumentEvents } from '../../../providers/DocumentEvents/index'
import { ShimmerEffect } from '../../ShimmerEffect/index'
import { DeviceContainer } from '../Device/index'
import { IFrame } from '../IFrame/index'
import { LivePreviewToolbar } from '../Toolbar/index'
import { cn } from '@/lib/utils'

export const LivePreviewWindow: React.FC<EditViewProps> = (props) => {
  const {
    appIsReady,
    breakpoint,
    iframeRef,
    isLivePreviewing,
    loadedURL,
    popupRef,
    previewWindowType,
    url,
  } = useLivePreviewContext()

  const locale = useLocale()

  const { mostRecentUpdate } = useDocumentEvents()

  const [formState] = useAllFormFields()
  const { id, collectionSlug, globalSlug } = useDocumentInfo()

  /**
   * For client-side apps, send data through `window.postMessage`
   * The preview could either be an iframe embedded on the page
   * Or it could be a separate popup window
   * We need to transmit data to both accordingly
   */
  useEffect(() => {
    if (!isLivePreviewing || !appIsReady) {
      return
    }

    // For performance, do not reduce fields to values until after the iframe or popup has loaded
    if (formState) {
      const values = reduceFieldsToValues(formState, true)

      if (!values.id) {
        values.id = id
      }

      const message = {
        type: 'payload-live-preview',
        collectionSlug,
        data: values,
        externallyUpdatedRelationship: mostRecentUpdate,
        globalSlug,
        locale: locale.code,
      }

      // Post message to external popup window
      if (previewWindowType === 'popup' && popupRef.current) {
        popupRef.current.postMessage(message, url)
      }

      // Post message to embedded iframe
      if (previewWindowType === 'iframe' && iframeRef.current) {
        iframeRef.current.contentWindow?.postMessage(message, url)
      }
    }
  }, [
    formState,
    url,
    collectionSlug,
    globalSlug,
    id,
    previewWindowType,
    popupRef,
    appIsReady,
    iframeRef,
    mostRecentUpdate,
    locale,
    isLivePreviewing,
    loadedURL,
  ])

  /**
   * To support SSR, we transmit a `window.postMessage` event without a payload
   * This is because the event will ultimately trigger a server-side roundtrip
   * i.e., save, save draft, autosave, etc. will fire `router.refresh()`
   */
  useEffect(() => {
    if (!isLivePreviewing || !appIsReady) {
      return
    }

    const message = {
      type: 'payload-document-event',
    }

    // Post message to external popup window
    if (previewWindowType === 'popup' && popupRef.current) {
      popupRef.current.postMessage(message, url)
    }

    // Post message to embedded iframe
    if (previewWindowType === 'iframe' && iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(message, url)
    }
  }, [mostRecentUpdate, iframeRef, popupRef, previewWindowType, url, isLivePreviewing, appIsReady])

  if (previewWindowType !== 'iframe') {
    return null
  }

  return (
    <div
      className={cn(
        'bg-background hidden w-[60%] shrink-0 grow-0 sticky top-(--doc-controls-height) h-[calc(100vh-var(--doc-controls-height))] overflow-hidden max-lg:w-full',
        isLivePreviewing && 'block',
        breakpoint &&
          breakpoint !== 'responsive' &&
          '[&_.live-preview-iframe]:border [&_.live-preview-iframe]:border-(--theme-elevation-100) [&_.live-preview-window__main]:p-(--base)',
      )}
    >
      <div className="flex flex-col h-full justify-start">
        <LivePreviewToolbar {...props} />
        <div className="grow h-full w-full">
          <DeviceContainer>{url ? <IFrame /> : <ShimmerEffect height="100%" />}</DeviceContainer>
        </div>
      </div>
    </div>
  )
}
