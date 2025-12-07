'use client'
import React from 'react'

import { cn } from '@/lib/utils'
import { Button } from '../../Button/index'
import { Thumbnail } from '../../Thumbnail/index'

import type { Data, FileSizes, SanitizedCollectionConfig } from 'payload'

import { DraggableSortableItem } from '../../../elements/DraggableSortable/DraggableSortableItem/index'
import { DragHandleIcon } from '../../../icons/DragHandle/index'
import { EditIcon } from '../../../icons/Edit/index'
import { useDocumentDrawer } from '../../DocumentDrawer/index'

export type DraggableFileDetailsProps = {
  collectionSlug: string
  customUploadActions?: React.ReactNode[]
  doc: {
    sizes?: FileSizes
  } & Data
  enableAdjustments?: boolean
  hasImageSizes?: boolean
  hasMany: boolean
  hideRemoveFile?: boolean
  imageCacheTag?: string
  isSortable?: boolean
  removeItem?: (index: number) => void
  rowIndex: number
  uploadConfig: SanitizedCollectionConfig['upload']
}

export const DraggableFileDetails: React.FC<DraggableFileDetailsProps> = (props) => {
  const {
    collectionSlug,
    doc,
    hideRemoveFile,
    imageCacheTag,
    isSortable,
    removeItem,
    rowIndex,
    uploadConfig,
  } = props

  const { id, filename, thumbnailURL, url } = doc

  const [DocumentDrawer, DocumentDrawerToggler] = useDocumentDrawer({
    id,
    collectionSlug,
  })

  return (
    <DraggableSortableItem id={id} key={id}>
      {(draggableSortableItemProps) => (
        <div
          className="flex gap-2.5 items-center bg-muted/50 rounded-[3px] px-3 py-2.5"
          ref={draggableSortableItemProps.setNodeRef}
          style={{
            transform: draggableSortableItemProps.transform,
            transition: draggableSortableItemProps.transition,
            zIndex: draggableSortableItemProps.isDragging ? 1 : undefined,
          }}
        >
          <div className="flex gap-2.5 items-center">
            {isSortable && draggableSortableItemProps && (
              <div
                className="cursor-grab"
                {...draggableSortableItemProps.attributes}
                {...draggableSortableItemProps.listeners}
              >
                <DragHandleIcon />
              </div>
            )}
            <Thumbnail
              className="max-w-6"
              collectionSlug={collectionSlug}
              doc={doc}
              fileSrc={thumbnailURL || url}
              imageCacheTag={imageCacheTag}
              uploadConfig={uploadConfig}
            />
          </div>
          <div>{filename}</div>

          <div className="grow-2 flex gap-2.5 items-center justify-end">
            <DocumentDrawer />
            <DocumentDrawerToggler>
              <EditIcon />
            </DocumentDrawerToggler>
            {!hideRemoveFile && removeItem && (
              <Button
                buttonStyle="icon-label"
                className="m-0"
                icon="x"
                iconStyle="none"
                onClick={() => removeItem(rowIndex)}
                round
              />
            )}
          </div>
        </div>
      )}
    </DraggableSortableItem>
  )
}
