// @ts-nocheck payloadcms original type safe issue will fix later
'use client'

import type { DragEndEvent } from '@dnd-kit/core'
import type { FolderListViewClientProps } from 'payload'

import { useDndMonitor } from '@dnd-kit/core'
import { getTranslation } from '@payloadcms/translations'
import { useRouter } from 'next/navigation'
import { formatAdminURL } from 'payload/shared'
import React, { Fragment } from 'react'

import { DefaultListViewTabs } from '../../elements/DefaultListViewTabs/index'
import { DroppableBreadcrumb } from '../../elements/FolderView/Breadcrumbs/index'
import { ColoredFolderIcon } from '../../elements/FolderView/ColoredFolderIcon/index'
import { CurrentFolderActions } from '../../elements/FolderView/CurrentFolderActions/index'
import { DragOverlaySelection } from '../../elements/FolderView/DragOverlaySelection/index'
import { SortByPill } from '../../elements/FolderView/SortByPill/index'
import { ToggleViewButtons } from '../../elements/FolderView/ToggleViewButtons/index'
import { Gutter } from '../../elements/Gutter/index'
import { ListHeader } from '../../elements/ListHeader/index'
import {
  ListBulkUploadButton,
  ListCreateNewDocInFolderButton,
} from '../../elements/ListHeader/TitleActions/index'
import { NoListResults } from '../../elements/NoListResults/index'
import { SearchBar } from '../../elements/SearchBar/index'
import { useStepNav } from '../../elements/StepNav/index'
import { useConfig } from '@payloadcms/ui'
import { useEditDepth } from '@payloadcms/ui'
import { FolderProvider, useFolder } from '../../providers/Folders/index'
import { usePreferences } from '@payloadcms/ui'
import { useRouteCache } from '../../providers/RouteCache/index'
import { useRouteTransition } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'
import { useWindowInfo } from '@payloadcms/ui'
import { cn } from '@/lib/utils'
import { ListSelection } from './ListSelection/index'

export function DefaultCollectionFolderView({
  allCollectionFolderSlugs: folderCollectionSlugs,
  allowCreateCollectionSlugs,
  baseFolderPath,
  breadcrumbs,
  documents,
  folderFieldName,
  folderID,
  FolderResultsComponent,
  search,
  sort,
  subfolders,
  ...restOfProps
}: FolderListViewClientProps) {
  return (
    <FolderProvider
      allCollectionFolderSlugs={folderCollectionSlugs}
      allowCreateCollectionSlugs={allowCreateCollectionSlugs}
      baseFolderPath={baseFolderPath}
      breadcrumbs={breadcrumbs}
      documents={documents}
      folderFieldName={folderFieldName}
      folderID={folderID}
      FolderResultsComponent={FolderResultsComponent}
      search={search}
      sort={sort}
      subfolders={subfolders}
    >
      <CollectionFolderViewInContext {...restOfProps} />
    </FolderProvider>
  )
}

type CollectionFolderViewInContextProps = Omit<
  FolderListViewClientProps,
  | 'allCollectionFolderSlugs'
  | 'allowCreateCollectionSlugs'
  | 'baseFolderPath'
  | 'breadcrumbs'
  | 'documents'
  | 'folderFieldName'
  | 'folderID'
  | 'FolderResultsComponent'
  | 'subfolders'
>

function CollectionFolderViewInContext(props: CollectionFolderViewInContextProps) {
  const {
    AfterFolderList,
    AfterFolderListTable,
    BeforeFolderList,
    BeforeFolderListTable,
    collectionSlug,
    Description,
    disableBulkDelete,
    disableBulkEdit,
    search,
    viewPreference,
  } = props

  const { config, getEntityConfig } = useConfig()
  const { i18n, t } = useTranslation()
  const drawerDepth = useEditDepth()
  const { setStepNav } = useStepNav()
  const { setPreference } = usePreferences()
  const {
    allowCreateCollectionSlugs,
    breadcrumbs,
    documents,
    dragOverlayItem,
    folderCollectionConfig,
    folderCollectionSlug,
    FolderResultsComponent,
    folderType,
    getSelectedItems,
    moveToFolder,
    refineFolderData,
    selectedItemKeys,
    setIsDragging,
    subfolders,
  } = useFolder()

  const router = useRouter()
  const { startRouteTransition } = useRouteTransition()
  const { clearRouteCache } = useRouteCache()

  const collectionConfig = getEntityConfig({ collectionSlug })

  const { labels, upload } = collectionConfig
  const isUploadCollection = Boolean(upload)
  const isBulkUploadEnabled = isUploadCollection && collectionConfig.upload.bulkUpload

  const {
    breakpoints: { s: smallBreak },
  } = useWindowInfo()

  const onDragEnd = React.useCallback(
    async (event: DragEndEvent) => {
      if (!event.over) {
        return
      }

      if (event.over.data.current.type === 'folder' && 'id' in event.over.data.current) {
        try {
          await moveToFolder({
            itemsToMove: getSelectedItems(),
            toFolderID: event.over.data.current.id,
          })
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Error moving items:', error)
        }

        clearRouteCache()
      }
    },
    [moveToFolder, getSelectedItems, clearRouteCache],
  )

  const handleSetViewType = React.useCallback(
    async (view: 'grid' | 'list') => {
      await setPreference(`${collectionSlug}-collection-folder`, {
        viewPreference: view,
      })
      clearRouteCache()
    },
    [collectionSlug, setPreference, clearRouteCache],
  )

  React.useEffect(() => {
    if (!drawerDepth) {
      setStepNav([
        !breadcrumbs.length
          ? {
              label: (
                <div
                  className="m-0 flex items-center gap-[calc(var(--base)*0.25)] [&_.icon]:h-[18px]"
                  key="root"
                >
                  <ColoredFolderIcon />
                  {getTranslation(labels?.plural, i18n)}
                </div>
              ),
            }
          : {
              label: (
                <DroppableBreadcrumb
                  className="m-0 flex items-center gap-[calc(var(--base)*0.25)] [&_.icon]:h-[18px] [&.droppable-button--hover]:opacity-30"
                  id={null}
                  key="root"
                  onClick={() => {
                    startRouteTransition(() => {
                      if (config.folders) {
                        router.push(
                          formatAdminURL({
                            adminRoute: config.routes.admin,
                            path: `/collections/${collectionSlug}/${config.folders.slug}`,
                          }),
                        )
                      }
                    })
                  }}
                >
                  <ColoredFolderIcon />
                  {getTranslation(labels?.plural, i18n)}
                </DroppableBreadcrumb>
              ),
            },
        ...breadcrumbs.map((crumb, crumbIndex) => {
          return {
            label:
              crumbIndex === breadcrumbs.length - 1 ? (
                crumb.name
              ) : (
                <DroppableBreadcrumb
                  className="[&.droppable-button--hover]:opacity-30"
                  id={crumb.id}
                  key={crumb.id}
                  onClick={() => {
                    startRouteTransition(() => {
                      if (config.folders) {
                        router.push(
                          formatAdminURL({
                            adminRoute: config.routes.admin,
                            path: `/collections/${collectionSlug}/${config.folders.slug}/${crumb.id}`,
                          }),
                        )
                      }
                    })
                  }}
                >
                  {crumb.name}
                </DroppableBreadcrumb>
              ),
          }
        }),
      ])
    }
  }, [
    breadcrumbs,
    collectionSlug,
    config.folders,
    config.routes.admin,
    drawerDepth,
    i18n,
    labels?.plural,
    router,
    setStepNav,
    startRouteTransition,
  ])

  const totalDocsAndSubfolders = documents.length + subfolders.length

  return (
    <Fragment>
      <DndEventListener onDragEnd={onDragEnd} setIsDragging={setIsDragging} />

      <div className="w-full max-lg:mt-[calc(var(--base)*0.25)] max-md:mb-[calc(var(--base)*2.4)]">
        {BeforeFolderList}
        <Gutter className="pb-(--spacing-view-bottom) [&>*:not(:last-child)]:mb-(--base) max-lg:py-0">
          <ListHeader
            Actions={[
              !smallBreak && (
                <ListSelection
                  disableBulkDelete={disableBulkDelete}
                  disableBulkEdit={collectionConfig.disableBulkEdit ?? disableBulkEdit}
                  folderAssignedCollections={
                    Array.isArray(folderType) ? folderType : [collectionSlug]
                  }
                  key="list-selection"
                />
              ),
              <DefaultListViewTabs
                collectionConfig={collectionConfig}
                config={config}
                key="default-list-actions"
                viewType="folders"
              />,
            ].filter(Boolean)}
            AfterListHeaderContent={Description}
            title={getTranslation(labels?.plural, i18n)}
            TitleActions={[
              allowCreateCollectionSlugs.length && (
                <ListCreateNewDocInFolderButton
                  buttonLabel={
                    allowCreateCollectionSlugs.length > 1
                      ? t('general:createNew')
                      : `${t('general:create')} ${getTranslation(folderCollectionConfig.labels?.singular, i18n).toLowerCase()}`
                  }
                  collectionSlugs={allowCreateCollectionSlugs}
                  folderAssignedCollections={
                    Array.isArray(folderType) ? folderType : [collectionSlug]
                  }
                  key="create-new-button"
                  onCreateSuccess={clearRouteCache}
                  slugPrefix="create-document--header-pill"
                />
              ),
              <ListBulkUploadButton
                collectionSlug={collectionSlug}
                hasCreatePermission={allowCreateCollectionSlugs.includes(collectionSlug)}
                isBulkUploadEnabled={isBulkUploadEnabled}
                key="bulk-upload-button"
              />,
            ].filter(Boolean)}
          />
          <SearchBar
            Actions={[
              <SortByPill key="sort-by-pill" />,
              <ToggleViewButtons
                activeView={viewPreference}
                key="toggle-view-buttons"
                setActiveView={handleSetViewType}
              />,
              <CurrentFolderActions key="current-folder-actions" />,
            ].filter(Boolean)}
            label={t('general:searchBy', {
              label: t('general:name'),
            })}
            onSearchChange={(search) => refineFolderData({ query: { search }, updateURL: true })}
            searchQueryParam={search}
          />
          {BeforeFolderListTable}
          {totalDocsAndSubfolders > 0 && FolderResultsComponent}
          {totalDocsAndSubfolders === 0 && (
            <NoListResults
              Actions={[
                allowCreateCollectionSlugs.includes(folderCollectionSlug) && (
                  <ListCreateNewDocInFolderButton
                    buttonLabel={`${t('general:create')} ${getTranslation(folderCollectionConfig.labels?.singular, i18n).toLowerCase()}`}
                    collectionSlugs={[folderCollectionConfig.slug]}
                    folderAssignedCollections={
                      Array.isArray(folderType) ? folderType : [collectionSlug]
                    }
                    key="create-folder"
                    onCreateSuccess={clearRouteCache}
                    slugPrefix="create-folder--no-results"
                  />
                ),
                allowCreateCollectionSlugs.includes(collectionSlug) && (
                  <ListCreateNewDocInFolderButton
                    buttonLabel={`${t('general:create')} ${t('general:document').toLowerCase()}`}
                    collectionSlugs={[collectionSlug]}
                    folderAssignedCollections={
                      Array.isArray(folderType) ? folderType : [collectionSlug]
                    }
                    key="create-document"
                    onCreateSuccess={clearRouteCache}
                    slugPrefix="create-document--no-results"
                  />
                ),
              ].filter(Boolean)}
              Message={
                <p>
                  {i18n.t('general:noResults', {
                    label: `${getTranslation(labels?.plural, i18n)} ${t('general:or').toLowerCase()} ${getTranslation(
                      folderCollectionConfig.labels?.plural,
                      i18n,
                    )}`,
                  })}
                </p>
              }
            />
          )}
          {AfterFolderListTable}
        </Gutter>
        {AfterFolderList}
      </div>
      {selectedItemKeys.size > 0 && dragOverlayItem && (
        <DragOverlaySelection item={dragOverlayItem} selectedCount={selectedItemKeys.size} />
      )}
    </Fragment>
  )
}

function DndEventListener({ onDragEnd, setIsDragging }) {
  useDndMonitor({
    onDragCancel() {
      setIsDragging(false)
    },
    onDragEnd(event) {
      setIsDragging(false)
      onDragEnd(event)
    },
    onDragStart() {
      setIsDragging(true)
    },
  })

  return null
}
