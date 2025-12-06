'use client'

import { useModal } from '../../Modal/index.js'
import { getTranslation } from '@payloadcms/translations'
import { reduceFieldsToValues } from 'payload/shared'
import React from 'react'

import { useAuth } from '@payloadcms/ui'
import { useConfig } from '@payloadcms/ui'
import { DocumentInfoProvider } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { ActionsBar } from '../ActionsBar/index.js'
import { discardBulkUploadModalSlug, DiscardWithoutSaving } from '../DiscardWithoutSaving/index.js'
import { EditForm } from '../EditForm/index.js'
import { FileSidebar } from '../FileSidebar/index.js'
import { useFormsManager } from '../FormsManager/index.js'
import { DrawerHeader } from '../Header/index.js'

export function AddingFilesView() {
  const {
    activeIndex,
    collectionSlug,
    docPermissions,
    documentSlots,
    forms,
    hasPublishPermission,
    hasSavePermission,
    hasSubmitted,
    resetUploadEdits,
    updateUploadEdits,
  } = useFormsManager()
  const activeForm = forms[activeIndex]
  const { getEntityConfig } = useConfig()
  const { i18n } = useTranslation()
  const { user } = useAuth()
  const { openModal } = useModal()

  const collectionConfig = getEntityConfig({ collectionSlug })

  return (
    <div className="flex h-full w-full overflow-hidden max-lg:flex-col-reverse">
      <FileSidebar />

      <div className="grow h-full max-h-full overflow-auto">
        <DrawerHeader
          onClose={() => openModal(discardBulkUploadModalSlug)}
          title={getTranslation(collectionConfig.labels.singular, i18n)}
        />
        {activeForm ? (
          <DocumentInfoProvider
            collectionSlug={collectionSlug}
            currentEditor={user}
            docPermissions={docPermissions}
            hasPublishedDoc={false}
            hasPublishPermission={hasPublishPermission}
            hasSavePermission={hasSavePermission}
            id={null}
            initialData={reduceFieldsToValues(activeForm.formState, true)}
            initialState={activeForm.formState}
            isLocked={false}
            key={`${activeIndex}-${forms.length}`}
            lastUpdateTime={0}
            mostRecentVersionIsAutosaved={false}
            unpublishedVersionCount={0}
            Upload={documentSlots.Upload}
            versionCount={0}
          >
            <ActionsBar collectionConfig={collectionConfig} />
            <EditForm
              resetUploadEdits={resetUploadEdits}
              submitted={hasSubmitted}
              updateUploadEdits={updateUploadEdits}
              uploadEdits={activeForm?.uploadEdits}
            />
          </DocumentInfoProvider>
        ) : null}
      </div>

      <DiscardWithoutSaving />
    </div>
  )
}
