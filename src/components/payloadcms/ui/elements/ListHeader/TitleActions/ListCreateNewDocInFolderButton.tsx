// @ts-nocheck payloadcms original type safe issue will fix later
'use client'

import type { ClientCollectionConfig, CollectionSlug } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import { useConfig } from '@payloadcms/ui'
import { useFolder } from '../../../providers/Folders'
import { useTranslation } from '@payloadcms/ui'
import { Button } from '../../Button'
import { useDocumentDrawer } from '../../DocumentDrawer'
import { Popup, PopupList } from '../../Popup'

const baseClass = 'create-new-doc-in-folder'

export function ListCreateNewDocInFolderButton({
  buttonLabel,
  collectionSlugs,
  folderAssignedCollections,
  onCreateSuccess,
  slugPrefix,
}: {
  buttonLabel: string
  collectionSlugs: CollectionSlug[]
  folderAssignedCollections: CollectionSlug[]
  onCreateSuccess: (args: {
    collectionSlug: CollectionSlug
    doc: Record<string, unknown>
  }) => Promise<void> | void
  slugPrefix: string
}) {
  const { i18n } = useTranslation()
  const { config } = useConfig()
  const { folderCollectionConfig, folderCollectionSlug, folderFieldName, folderID } = useFolder()
  const [FolderDocumentDrawer, , { closeDrawer: closeFolderDrawer, openDrawer: openFolderDrawer }] =
    useDocumentDrawer({
      collectionSlug: folderCollectionSlug,
    })
  const [enabledCollections] = React.useState<ClientCollectionConfig[]>(() =>
    collectionSlugs.reduce((acc, collectionSlug) => {
      const collectionConfig = config.collections.find(({ slug }) => slug === collectionSlug)
      if (collectionConfig) {
        acc.push(collectionConfig)
      }
      return acc
    }, []),
  )

  // Get the first non-folder collection for the document drawer
  const firstNonFolderCollection = enabledCollections.find(
    (c) => c.slug !== folderCollectionConfig?.slug,
  )

  const [DocDrawer, , { closeDrawer: closeDocDrawer, openDrawer: openDocDrawer }] =
    useDocumentDrawer({
      collectionSlug: firstNonFolderCollection?.slug || enabledCollections[0]?.slug,
    })

  if (enabledCollections.length === 0) {
    return null
  }

  return (
    <React.Fragment>
      {enabledCollections.length === 1 ? (
        // If there is only 1 option, do not render a popup
        <Button
          buttonStyle="pill"
          className={`${baseClass}__button`}
          el="div"
          onClick={() => {
            if (enabledCollections[0].slug === folderCollectionConfig?.slug) {
              openFolderDrawer()
            } else {
              openDocDrawer()
            }
          }}
          size="small"
        >
          {buttonLabel}
        </Button>
      ) : (
        <Popup
          button={
            <Button
              buttonStyle="pill"
              className={`${baseClass}__popup-button`}
              el="div"
              icon="chevron"
              size="small"
            >
              {buttonLabel}
            </Button>
          }
          buttonType="default"
          className={`${baseClass}__action-popup`}
        >
          <PopupList.ButtonGroup>
            {enabledCollections.map((collection, index) => {
              return (
                <PopupList.Button
                  key={index}
                  onClick={() => {
                    if (collection.slug === folderCollectionConfig?.slug) {
                      openFolderDrawer()
                    } else {
                      openDocDrawer()
                    }
                  }}
                >
                  {getTranslation(collection.labels.singular, i18n)}
                </PopupList.Button>
              )
            })}
          </PopupList.ButtonGroup>
        </Popup>
      )}

      {firstNonFolderCollection && (
        <DocDrawer
          initialData={{
            [folderFieldName]: folderID,
          }}
          onSave={async ({ doc }) => {
            await onCreateSuccess({
              collectionSlug: firstNonFolderCollection.slug,
              doc,
            })
            closeDocDrawer()
          }}
          redirectAfterCreate={false}
        />
      )}

      {folderCollectionConfig && collectionSlugs.includes(folderCollectionConfig.slug) && (
        <FolderDocumentDrawer
          initialData={{
            [folderFieldName]: folderID,
            folderType: folderAssignedCollections,
          }}
          onSave={async (result) => {
            await onCreateSuccess({
              collectionSlug: folderCollectionConfig.slug,
              doc: result.doc,
            })
            closeFolderDrawer()
          }}
          redirectAfterCreate={false}
        />
      )}
    </React.Fragment>
  )
}
