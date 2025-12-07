'use client'

import { getTranslation } from '@payloadcms/translations'
import { reduceFieldsToValues } from 'payload/shared'
import { useModal } from '../../Modal/index'

import { DocumentInfoProvider, useAuth, useConfig, useTranslation } from '@payloadcms/ui'
import { CollectionSlug } from 'payload'
import { ActionsBar } from '../ActionsBar/index'
import { DiscardWithoutSaving, discardBulkUploadModalSlug } from '../DiscardWithoutSaving/index'
import { EditForm } from '../EditForm/index'
import { FileSidebar } from '../FileSidebar/index'
import { useFormsManager } from '../FormsManager/index'
import { DrawerHeader } from '../Header/index'

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
            collectionSlug={collectionSlug as CollectionSlug}
            currentEditor={user as any}
            docPermissions={docPermissions}
            hasPublishedDoc={false}
            hasPublishPermission={hasPublishPermission}
            hasSavePermission={hasSavePermission}
            id={undefined}
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
