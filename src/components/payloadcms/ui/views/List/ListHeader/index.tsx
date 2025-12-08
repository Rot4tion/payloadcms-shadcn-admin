// @ts-nocheck payloadcms original type safe issue will fix later
import type { I18nClient, TFunction } from '@payloadcms/translations'
import type { ClientCollectionConfig, ViewTypes } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import { CloseModalButton } from '../../../elements/CloseModalButton'
import { DefaultListViewTabs } from '../../../elements/DefaultListViewTabs'
import { useListDrawerContext } from '../../../elements/ListDrawer/Provider'
import { DrawerRelationshipSelect } from '../../../elements/ListHeader/DrawerRelationshipSelect'
import { ListDrawerCreateNewDocButton } from '../../../elements/ListHeader/DrawerTitleActions'
import { ListHeader } from '../../../elements/ListHeader'
import {
  ListBulkUploadButton,
  ListCreateNewButton,
  ListEmptyTrashButton,
} from '../../../elements/ListHeader/TitleActions'
import { useConfig } from '@payloadcms/ui'
import { useListQuery } from '@payloadcms/ui'
import { ListSelection } from '../ListSelection'

const drawerBaseClass = 'list-drawer'

export type ListHeaderProps = {
  Actions?: React.ReactNode[]
  className?: string
  collectionConfig: ClientCollectionConfig
  Description?: React.ReactNode
  disableBulkDelete?: boolean
  disableBulkEdit?: boolean
  hasCreatePermission: boolean
  hasDeletePermission?: boolean
  i18n: I18nClient
  isBulkUploadEnabled: boolean
  isTrashEnabled?: boolean
  newDocumentURL: string
  onBulkUploadSuccess?: () => void
  smallBreak: boolean
  TitleActions?: React.ReactNode[]
  viewType?: ViewTypes
}

export const CollectionListHeader: React.FC<ListHeaderProps> = ({
  className,
  collectionConfig,
  Description,
  disableBulkDelete,
  disableBulkEdit,
  hasCreatePermission,
  hasDeletePermission,
  i18n,
  isBulkUploadEnabled,
  isTrashEnabled,
  newDocumentURL,
  onBulkUploadSuccess,
  smallBreak,
  viewType,
}) => {
  const { config, getEntityConfig } = useConfig()
  const { drawerSlug, isInDrawer, selectedOption } = useListDrawerContext()
  const isTrashRoute = viewType === 'trash'
  const { isGroupingBy } = useListQuery()

  if (isInDrawer) {
    return (
      <ListHeader
        Actions={[
          <CloseModalButton
            className={`${drawerBaseClass}__header-close`}
            key="close-button"
            slug={drawerSlug}
          />,
        ]}
        AfterListHeaderContent={
          <>
            {Description}
            {<DrawerRelationshipSelect />}
          </>
        }
        className={`${drawerBaseClass}__header`}
        title={getTranslation(
          getEntityConfig({ collectionSlug: selectedOption.value })?.labels?.plural,
          i18n,
        )}
        TitleActions={[
          <ListDrawerCreateNewDocButton
            hasCreatePermission={hasCreatePermission}
            key="list-drawer-create-new-doc"
          />,
        ].filter(Boolean)}
      />
    )
  }

  return (
    <ListHeader
      Actions={[
        !smallBreak && !isGroupingBy && (
          <ListSelection
            collectionConfig={collectionConfig}
            disableBulkDelete={disableBulkDelete}
            disableBulkEdit={disableBulkEdit}
            key="list-selection"
            label={getTranslation(collectionConfig?.labels?.plural, i18n)}
            showSelectAllAcrossPages={!isGroupingBy}
            viewType={viewType}
          />
        ),
        <DefaultListViewTabs
          collectionConfig={collectionConfig}
          config={config}
          key="default-list-actions"
          viewType={viewType}
        />,
      ].filter(Boolean)}
      AfterListHeaderContent={Description}
      className={className}
      title={getTranslation(collectionConfig?.labels?.plural, i18n)}
      TitleActions={[
        hasCreatePermission && !isTrashRoute && (
          <ListCreateNewButton
            collectionConfig={collectionConfig}
            hasCreatePermission={hasCreatePermission}
            key="list-header-create-new-doc"
            newDocumentURL={newDocumentURL}
          />
        ),
        hasCreatePermission && isBulkUploadEnabled && !isTrashRoute && (
          <ListBulkUploadButton
            collectionSlug={collectionConfig.slug}
            hasCreatePermission={hasCreatePermission}
            isBulkUploadEnabled={isBulkUploadEnabled}
            key="list-header-bulk-upload"
            onBulkUploadSuccess={onBulkUploadSuccess}
          />
        ),
        hasDeletePermission && isTrashEnabled && viewType === 'trash' && (
          <ListEmptyTrashButton
            collectionConfig={collectionConfig}
            hasDeletePermission={hasDeletePermission}
            key="list-header-empty-trash"
          />
        ),
      ].filter(Boolean)}
    />
  )
}
