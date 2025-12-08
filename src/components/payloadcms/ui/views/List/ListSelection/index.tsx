// @ts-nocheck payloadcms original type safe issue will fix later
'use client'
import type { ClientCollectionConfig, ViewTypes, Where } from 'payload'

import React, { Fragment, useCallback } from 'react'

import { useSelection, useTranslation } from '@payloadcms/ui'
import { SelectAllStatus } from '@payloadcms/ui/providers/Selection'
import { DeleteMany } from '../../../elements/DeleteMany'
import { EditMany_v4 } from '../../../elements/EditMany'
import { ListSelection_v4, ListSelectionButton } from '../../../elements/ListSelection'
import { PublishMany_v4 } from '../../../elements/PublishMany'
import { RestoreMany } from '../../../elements/RestoreMany'
import { UnpublishMany_v4 } from '../../../elements/UnpublishMany'

export type ListSelectionProps = {
  collectionConfig?: ClientCollectionConfig
  disableBulkDelete?: boolean
  disableBulkEdit?: boolean
  label: string
  modalPrefix?: string
  showSelectAllAcrossPages?: boolean
  viewType?: ViewTypes
  where?: Where
}

export const ListSelection: React.FC<ListSelectionProps> = ({
  collectionConfig,
  disableBulkDelete,
  disableBulkEdit,
  label,
  modalPrefix,
  showSelectAllAcrossPages = true,
  viewType,
  where,
}) => {
  const { count, selectAll, selectedIDs, toggleAll, totalDocs } = useSelection()
  const { t } = useTranslation()

  const onActionSuccess = useCallback(() => toggleAll(), [toggleAll])

  if (count === 0) {
    return null
  }

  const isTrashView = collectionConfig?.trash && viewType === 'trash'

  return (
    <ListSelection_v4
      count={count}
      ListActions={[
        selectAll !== SelectAllStatus.AllAvailable &&
        count < totalDocs &&
        showSelectAllAcrossPages !== false ? (
          <ListSelectionButton
            aria-label={t('general:selectAll', { count: `(${totalDocs})`, label })}
            id="select-all-across-pages"
            key="select-all"
            onClick={() => toggleAll(true)}
          >
            {t('general:selectAll', { count: `(${totalDocs})`, label: '' })}
          </ListSelectionButton>
        ) : null,
      ].filter(Boolean)}
      SelectionActions={[
        !disableBulkEdit && !isTrashView && (
          <Fragment key="bulk-actions">
            <EditMany_v4
              collection={collectionConfig}
              count={count}
              ids={selectedIDs}
              modalPrefix={modalPrefix}
              onSuccess={onActionSuccess}
              selectAll={selectAll === SelectAllStatus.AllAvailable}
              where={where}
            />
            <PublishMany_v4
              collection={collectionConfig}
              count={count}
              ids={selectedIDs}
              modalPrefix={modalPrefix}
              onSuccess={onActionSuccess}
              selectAll={selectAll === SelectAllStatus.AllAvailable}
              where={where}
            />
            <UnpublishMany_v4
              collection={collectionConfig}
              count={count}
              ids={selectedIDs}
              modalPrefix={modalPrefix}
              onSuccess={onActionSuccess}
              selectAll={selectAll === SelectAllStatus.AllAvailable}
              where={where}
            />
          </Fragment>
        ),
        isTrashView && (
          <RestoreMany collection={collectionConfig} key="bulk-restore" viewType={viewType} />
        ),
        !disableBulkDelete && (
          <DeleteMany
            collection={collectionConfig}
            key="bulk-delete"
            modalPrefix={modalPrefix}
            viewType={viewType}
          />
        ),
      ].filter(Boolean)}
    />
  )
}
