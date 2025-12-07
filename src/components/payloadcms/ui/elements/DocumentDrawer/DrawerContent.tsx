'use client'

import { useModal } from '../Modal/index'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import type { DocumentDrawerProps } from './types'

import { LoadingOverlay } from '../../elements/Loading/index'
import { useConfig } from '@payloadcms/ui'
import { useLocale } from '@payloadcms/ui'
import { useServerFunctions } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { abortAndIgnore, handleAbortRef } from '../../utilities/abortAndIgnore'
import { DocumentDrawerContextProvider } from './Provider'

export const DocumentDrawerContent: React.FC<DocumentDrawerProps> = ({
  id: docID,
  collectionSlug,
  disableActions,
  drawerSlug,
  initialData,
  onDelete: onDeleteFromProps,
  onDuplicate: onDuplicateFromProps,
  onSave: onSaveFromProps,
  overrideEntityVisibility = true,
  redirectAfterCreate,
  redirectAfterDelete,
  redirectAfterDuplicate,
  redirectAfterRestore,
}) => {
  const { getEntityConfig } = useConfig()
  const locale = useLocale()

  const [collectionConfig] = useState(() => getEntityConfig({ collectionSlug }))

  const abortGetDocumentViewRef = React.useRef<AbortController>(null)

  const { closeModal } = useModal()
  const { t } = useTranslation()

  const { renderDocument } = useServerFunctions()

  const [DocumentView, setDocumentView] = useState<React.ReactNode>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  const hasInitialized = useRef(false)

  const getDocumentView = useCallback(
    (docID?: DocumentDrawerProps['id'], showLoadingIndicator: boolean = false) => {
      const controller = handleAbortRef(abortGetDocumentViewRef)

      const fetchDocumentView = async () => {
        if (showLoadingIndicator) {
          setIsLoading(true)
        }

        try {
          const result = await renderDocument({
            collectionSlug,
            disableActions,
            docID,
            drawerSlug,
            initialData,
            locale,
            overrideEntityVisibility,
            redirectAfterCreate,
            redirectAfterDelete: redirectAfterDelete !== undefined ? redirectAfterDelete : false,
            redirectAfterDuplicate:
              redirectAfterDuplicate !== undefined ? redirectAfterDuplicate : false,
            redirectAfterRestore: redirectAfterRestore !== undefined ? redirectAfterRestore : false,
            signal: controller.signal,
          })

          if (result?.Document) {
            setDocumentView(result.Document)
            setIsLoading(false)
          }
        } catch (error) {
          toast.error(error?.message || t('error:unspecific'))
          closeModal(drawerSlug)
        }

        abortGetDocumentViewRef.current = null
      }

      void fetchDocumentView()
    },
    [
      collectionSlug,
      disableActions,
      drawerSlug,
      initialData,
      redirectAfterDelete,
      redirectAfterDuplicate,
      redirectAfterRestore,
      renderDocument,
      redirectAfterCreate,
      closeModal,
      overrideEntityVisibility,
      t,
      locale,
    ],
  )

  const onSave = useCallback<DocumentDrawerProps['onSave']>(
    (args) => {
      if (args.operation === 'create') {
        getDocumentView(args.doc.id)
      }

      if (typeof onSaveFromProps === 'function') {
        void onSaveFromProps({
          ...args,
          collectionConfig,
        })
      }
    },
    [onSaveFromProps, collectionConfig, getDocumentView],
  )

  const onDuplicate = useCallback<DocumentDrawerProps['onDuplicate']>(
    (args) => {
      getDocumentView(args.doc.id)

      if (typeof onDuplicateFromProps === 'function') {
        void onDuplicateFromProps({
          ...args,
          collectionConfig,
        })
      }
    },
    [onDuplicateFromProps, collectionConfig, getDocumentView],
  )

  const onDelete = useCallback<DocumentDrawerProps['onDelete']>(
    (args) => {
      if (typeof onDeleteFromProps === 'function') {
        void onDeleteFromProps({
          ...args,
          collectionConfig,
        })
      }

      closeModal(drawerSlug)
    },
    [onDeleteFromProps, closeModal, drawerSlug, collectionConfig],
  )

  const clearDoc = useCallback(() => {
    getDocumentView(undefined, true)
  }, [getDocumentView])

  useEffect(() => {
    if (!DocumentView && !hasInitialized.current) {
      getDocumentView(docID, true)
      hasInitialized.current = true
    }
  }, [DocumentView, getDocumentView, docID])

  // Cleanup any pending requests when the component unmounts
  useEffect(() => {
    const abortGetDocumentView = abortGetDocumentViewRef.current

    return () => {
      abortAndIgnore(abortGetDocumentView)
    }
  }, [])

  if (isLoading) {
    return <LoadingOverlay />
  }

  return (
    <DocumentDrawerContextProvider
      clearDoc={clearDoc}
      drawerSlug={drawerSlug}
      onDelete={onDelete}
      onDuplicate={onDuplicate}
      onSave={onSave}
    >
      {DocumentView}
    </DocumentDrawerContextProvider>
  )
}
