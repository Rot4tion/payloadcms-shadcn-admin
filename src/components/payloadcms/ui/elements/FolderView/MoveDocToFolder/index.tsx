// @ts-nocheck payloadcms original type safe issue will fix later
'use client'

import type { CollectionSlug } from 'payload'
import type { FolderOrDocument } from 'payload/shared'

import { useModal } from '../../Modal/index'
import { getTranslation } from '@payloadcms/translations'
import React, { useId } from 'react'
import { toast } from 'sonner'

import type { Props as ButtonProps } from '../../Button/types'

import { useForm, useFormFields } from '@payloadcms/ui'
import { FolderIcon } from '../../../icons/Folder/index'
import { useConfig } from '@payloadcms/ui'
import { useDocumentInfo } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { Button } from '../../Button/index'
import { formatDrawerSlug } from '../../Drawer/index'
import { MoveItemsToFolderDrawer } from '../Drawers/MoveToFolder/index'
import { cn } from '@/lib/utils'
import { useDrawerDepth } from '@payloadcms/ui/elements/Drawer'

/**
 * This is the button shown on the edit document view. It uses the more generic `MoveDocToFolderButton` component.
 */
export function MoveDocToFolder({
  buttonProps,
  className = '',
  folderCollectionSlug,
  folderFieldName,
}: {
  readonly buttonProps?: Partial<ButtonProps>
  readonly className?: string
  readonly folderCollectionSlug: string
  readonly folderFieldName: string
}) {
  const { t } = useTranslation()
  const dispatchField = useFormFields(([_, dispatch]) => dispatch)
  const currentParentFolder = useFormFields(
    ([fields]) => (fields && fields?.[folderFieldName]) || null,
  )
  const fromFolderID = currentParentFolder?.value
  const { id, collectionSlug, initialData, title } = useDocumentInfo()
  const { setModified } = useForm()
  const [fromFolderName, setFromFolderName] = React.useState(() => `${t('general:loading')}...`)

  const { config } = useConfig()
  const modalID = useId()

  React.useEffect(() => {
    async function fetchFolderLabel() {
      if (fromFolderID && (typeof fromFolderID === 'string' || typeof fromFolderID === 'number')) {
        const response = await fetch(`${config.routes.api}/${folderCollectionSlug}/${fromFolderID}`)
        const folderData = await response.json()
        setFromFolderName(folderData?.name || t('folder:noFolder'))
      } else {
        setFromFolderName(t('folder:noFolder'))
      }
    }

    void fetchFolderLabel()
  }, [folderCollectionSlug, config.routes.api, fromFolderID, t])

  return (
    <MoveDocToFolderButton
      buttonProps={buttonProps}
      className={className}
      collectionSlug={collectionSlug}
      docData={initialData as FolderOrDocument['value']}
      docID={id}
      docTitle={title}
      folderCollectionSlug={folderCollectionSlug}
      folderFieldName={folderFieldName}
      fromFolderID={fromFolderID as number | string}
      fromFolderName={fromFolderName}
      modalSlug={`move-to-folder-${modalID}`}
      onConfirm={({ id }) => {
        if (currentParentFolder.value !== id) {
          dispatchField({
            type: 'UPDATE',
            path: folderFieldName,
            value: id,
          })
          setModified(true)
        }
      }}
      skipConfirmModal={!currentParentFolder?.value}
    />
  )
}

type MoveDocToFolderButtonProps = {
  readonly buttonProps?: Partial<ButtonProps>
  readonly className?: string
  readonly collectionSlug: string
  readonly docData: FolderOrDocument['value']
  readonly docID: number | string
  readonly docTitle?: string
  readonly folderCollectionSlug: string
  readonly folderFieldName: string
  readonly fromFolderID?: number | string
  readonly fromFolderName: string
  readonly modalSlug: string
  readonly onConfirm?: (args: { id: number | string; name: string }) => Promise<void> | void
  readonly skipConfirmModal?: boolean
}

/**
 * This is a more generic button that can be used in other contexts, such as table cells and the edit view.
 */
export const MoveDocToFolderButton = ({
  buttonProps,
  className,
  collectionSlug,
  docData,
  docID,
  docTitle,
  folderCollectionSlug,
  folderFieldName,
  fromFolderID,
  fromFolderName,
  modalSlug,
  onConfirm,
  skipConfirmModal,
}: MoveDocToFolderButtonProps) => {
  const { getEntityConfig } = useConfig()
  const { i18n, t } = useTranslation()
  const { closeModal, openModal } = useModal()
  const drawerDepth = useDrawerDepth()
  const drawerSlug = formatDrawerSlug({ slug: modalSlug, depth: drawerDepth })

  const titleToRender =
    docTitle || getTranslation(getEntityConfig({ collectionSlug }).labels.singular, i18n)

  return (
    <>
      <Button
        buttonStyle="subtle"
        className={cn(
          'm-0 [&_.btn__icon]:text-muted-foreground/60 [&_.btn__label]:font-semibold',
          className,
        )}
        icon={<FolderIcon />}
        iconPosition="left"
        onClick={() => {
          openModal(drawerSlug)
        }}
        {...buttonProps}
      >
        {fromFolderName}
      </Button>

      <MoveItemsToFolderDrawer
        action="moveItemToFolder"
        drawerSlug={drawerSlug}
        //todo this should inherit
        folderAssignedCollections={[collectionSlug]}
        folderCollectionSlug={folderCollectionSlug}
        folderFieldName={folderFieldName}
        fromFolderID={fromFolderID}
        fromFolderName={fromFolderName}
        itemsToMove={[
          {
            itemKey: `${collectionSlug}-${docID}`,
            relationTo: collectionSlug,
            value: { ...docData, id: docID },
          },
        ]}
        onConfirm={async (args) => {
          if (fromFolderID !== args.id && typeof onConfirm === 'function') {
            try {
              await onConfirm(args)

              if (args.id) {
                // moved to folder
                toast.success(
                  t('folder:itemHasBeenMoved', {
                    folderName: `"${args.name}"`,
                    title: titleToRender,
                  }),
                )
              } else {
                // moved to root
                toast.success(
                  t('folder:itemHasBeenMovedToRoot', {
                    title: titleToRender,
                  }),
                )
              }
            } catch (_) {
              // todo: add error toast?
            }
          }

          closeModal(drawerSlug)
        }}
        skipConfirmModal={skipConfirmModal}
        title={titleToRender}
      />
    </>
  )
}
